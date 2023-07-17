import { useState } from "react";
import { useHistory } from "react-router-dom";
import React from "react";
import "./DragDrop.css";
import axios from "axios";
import { ProgressBar, Alert, Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-dropzone-uploader/dist/styles.css";
import FineUploaderTraditional from "fine-uploader-wrappers";
import Gallery from "react-fine-uploader";
import "react-fine-uploader/gallery/gallery.css";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";

// drag drop file component
const DragDropFile = () => {
  // drag state
  const history = useHistory();
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState();
  const [error, setError] = useState();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isShow, setIsShow] = useState(false);
  
  // ref
  const inputRef = React.useRef(null);

  const  submitHandler = (e) => {
    e.preventDefault();
    //clear error message
    setError("");
    let countSize = 0;
    let formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      countSize += selectedFiles[i].size;
      formData.append("files", selectedFiles[i]);
    }

    if (countSize >= 5242880000000) {
      setIsShow(true);
    } else {
      axios
        .post("/api/users/upload_file", formData, {
          headers: {
            "Content-type": "multipart/form-date",
          },
          onUploadProgress: (data) => {
            //set the progress value  to show the progress bar
            setProgress(Math.round((100 * data.loaded) / data.total));
          },
        })
        .then((res) => {
          if (res.data.status === "success") {
            var text = new FormData();
            text.append("text", res.data.result);
            console.log(res.data.result);
            axios
              .post("http://127.0.0.1:3801/api/ai/embedding",text).then((re) => {
                console.log(re.data.status)
                if(re.data == "ok") {
                  history.push({
                    pathname: "/chatroom",
                    state: { detail: res.data.result },
                  });
                }
              })                        
          }     
        })
        .catch((error) => {
          const { code } = error?.response?.data;
          switch (code) {
            case "FILE_MISSING":
              setError("Please select a file before uploading!");
              break;
            case "LIMIT_FILE_SIZE":
              setError(
                "File size is too large. Please upload files below 1MB!"
              );
              break;
            case "INVALID_TYPE":
              setError(
                "This file type is not supported! Only .png, .jpg and .jpeg files are allowed"
              );
              break;

            default:
              setError("Sorry! Something went wrong. Please try again later");
              break;
          }
        });
    }
  };

  // handle drag events
  const handleDrag = function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // // triggers when file is dropped
  const handleDrop = function (e) {
    setError("");
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const chosenFiles = Array.prototype.slice.call(e.dataTransfer.files);
      setSelectedFiles(chosenFiles);
    }
  };

  // triggers when file is selected with click
  const handleChange = function (e) {
    setError("");
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const chosenFiles = Array.prototype.slice.call(e.target.files);
      setSelectedFiles(chosenFiles);
    }
  };

  // triggers the input when the button is clicked
  const onButtonClick = () => {
    inputRef.current.click();
  };
  //Fake the modal
  const initModal = () => {
    setIsShow(false);
  };
  // go to signin
  const gotoLogin = () => {
    history.push("/login");
  };
  return (
  
    <><Navbar />
    <div className="col-md-12">
      <header>
        <h1 className="text-dark subtitle">Chat With Any PDF</h1>
        <h3 className="subtitle-1">You want efficently analyze documents</h3>
      </header>
      <br />
      <br />
      <form onDragEnter={handleDrag} onSubmit={submitHandler} method="post">
      <input
        ref={inputRef}
        type="file"
        id="input-file-upload"
        multiple={true}
        onChange={handleChange}
      />
      <label
        id="label-file-upload"
        htmlFor="input-file-upload"
        className={dragActive ? "drag-active" : ""}
      >
        <div className="text">
          <img src="pdf_icon.png" className="pdf-icon" alt="pdf icon"></img>
          <h4 className="pdf_title">
            {selectedFiles.length === 0 &&
              "Drop your PDF here or Browse or URL"}
          </h4>
          <h4 className="subtitle_pdf">
            {selectedFiles.length === 0 && "Find a PDF"}
          </h4>
          <button className="upload-button" onClick={onButtonClick}></button>
          {selectedFiles.length !== 0 && (
            <button type="submit" className="btn btn-primary submit-btn">
              Submit
            </button>
          )}
          <div className="error">
            {error && <Alert variant="danger">{error}</Alert>}
            {!error && progress && (
              <ProgressBar
                className="progressbar"
                now={progress}
                label={`${progress}%`}
              />
            )}
          </div>
        </div>
      </label>
      {dragActive && (
        <div
          id="drag-file-element"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        ></div>
      )}
    </form>
      {/* <div>
        <Gallery fileInput-children={fileInputChildren} uploader={uploader} />
      </div> */}

      <div className="container mt-3">
        <Modal show={isShow}>
          <Modal.Header closeButton onClick={initModal}>
            <Modal.Title>Your File is too Large!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Please SignIn to get a service.</h4>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={initModal}>
              Close
            </Button>
            <Button variant="dark" onClick={gotoLogin}>
              Go to Login
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <div className="container second-stage">
        <div className="title-features">
          <h1>Features</h1>
        </div>
        <div className="row">
          <div className="col-md-4">
            <img className="card-img-top" src="student.png" alt="students" />
            <h2>For Students</h2>
            <br />
            <p className="card-text">
              Enhance your learning experience with ChatPDF. Comprehend
              textbooks, handouts, and presentations effortlessly. Don't spend
              hours flipping through research papers and academic articles.
              Support your academic growth and succeed in your studies
              effectively and responsibly.
            </p>
            <br />
            <br />
            <br />
          </div>
          <div className="col-md-4">
            <img className="card-img-top" src="work.png" alt="students" />
            <h2>For Work</h2>
            <br />
            <p className="card-text">
              Efficiently analyze your documents. From financial and sales
              reports to project and business proposals, training manuals, and
              legal contracts, ChatPDF can quickly provide you with the
              information you need. Your information is kept confidential in a
              secure cloud storage and deleted after 7 days for your peace of
              mind
            </p>
            <br />
            <br />
            <br />
          </div>
          <div className="col-md-4">
            <img className="card-img-top" src="curious.png" alt="students" />
            <br />
            <h3>For Curious Minds</h3>
            <br />
            <p className="card-text">
              Efficiently analyze your documents. From financial and sales
              reports to project and business proposals, training manuals, and
              legal contracts, ChatPDF can quickly provide you with the
              information you need. Your information is kept confidential in a
              secure cloud storage and deleted after 7 days for your peace of
              mind
            </p>
            <br />
            <br />
            <br />
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default DragDropFile;
