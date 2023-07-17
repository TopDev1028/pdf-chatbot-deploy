const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const upload = require("./upload");
const Token = require("../../models/token");
const sendEmail = require("../../utils/sendEmail");
const crypto = require("crypto");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const tesseract = require("node-tesseract-ocr");
const path = require("path");
const FormData = require("form-data");
const axios = require("axios");
const dotenv = require("dotenv");
const result = dotenv.config({ path: path.resolve(__dirname, "../../.env") });
const WordExtractor = require("word-extractor");
const extractor = new WordExtractor();
const EPUBToText = require("../../utils/epub");
const speech = require('@google-cloud/speech');
const epubToText = new EPUBToText();
const { promisify } = require('util');

const OPEN_API_KEY = process.env.OPENAI_API_KEY;

const model = "whisper-1";

let text = "";

const config = {
  lang: "eng",
  oem: 1,
  psm: 3,
};

const rimraf = require("rimraf");
const mkdirp = require("mkdirp");
const multiparty = require("multiparty");

const fileInputName = process.env.FILE_INPUT_NAME || "qqfile";
const publicDir = process.env.PUBLIC_DIR;

const nodeModulesDir = process.env.NODE_MODULES_DIR;
const uploadedFilesPath = process.env.UPLOADED_FILES_DIR;
const chunkDirName = "chunks";
const port = process.env.SERVER_PORT || 8000;
const maxFileSize = process.env.MAX_FILE_SIZE || 0;

function onUpload(req, res) {

  var form = new multiparty.Form();

  form.parse(req, function (err, fields, files) {
    
    var partIndex = fields.qqpartindex;
   
    // text/plain is required to ensure support for IE9 and older
    res.set("Content-Type", "text/plain");
    console.log(partIndex)
    if (partIndex == undefined) {

      onSimpleUpload(fields, files[fileInputName][0], res);
      
    } else {

      onChunkedUpload(fields, files[fileInputName][0], res);
      
    }
  });
}

function onSimpleUpload(fields, file, res) {
  var uuid = fields.qquuid,
  responseData = {
    success: false,
  };
  
  file.name = fields.qqfilename;
  if (isValid(file.size)) {

    moveUploadedFile(
      file,
      uuid,
      function () {
        responseData.success = true;
        res.send(responseData);
      },
      function () {
        responseData.error = "Problem copying the file!";
        res.send(responseData);
      }
    );
  } else {
    failWithTooBigFile(responseData, res);
  }
}

function onChunkedUpload(fields, file, res) {
  var size = parseInt(fields.qqtotalfilesize),
    uuid = fields.qquuid,
    index = fields.qqpartindex,
    totalParts = parseInt(fields.qqtotalparts),
    responseData = {
      success: false,
    };

  file.name = fields.qqfilename;

  if (isValid(size)) {
    storeChunk(
      file,
      uuid,
      index,
      totalParts,
      function () {

        if (index < totalParts - 1) {
          responseData.success = true;
          res.send(responseData);
        } else {
          combineChunks(
            file,
            uuid,
            function () {
              responseData.success = true;
              res.send(responseData);
            },
            function () {
              responseData.error = "Problem conbining the chunks!";
              res.send(responseData);
            }
          );
        }
      },
      function (reset) {
        responseData.error = "Problem storing the chunk!";
        res.send(responseData);
      }
    );
  } else {
    failWithTooBigFile(responseData, res);
  }
}

function failWithTooBigFile(responseData, res) {
  responseData.error = "Too big!";
  responseData.preventRetry = true;
  res.send(responseData);
}

function onDeleteFile(req, res) {
  console.log("asdfasdf")
  var uuid = req.params.uuid,
    dirToDelete = uploadedFilesPath + uuid;

  rimraf(dirToDelete, function (error) {
    if (error) {
      console.error("Problem deleting file! " + error);
      res.status(500);
    }

    res.send();
  });
}

function isValid(size) {
  return maxFileSize === 0 || size < maxFileSize;
}

async function moveFile(
  destinationDir,
  sourceFile,
  destinationFile,
  success,
  failure
) {
    try{
      var sourceStream, destStream;
      await fs.promises.mkdir(destinationDir, { recursive: true });
      console.log("Directory created successfully");
      
      sourceStream = fs.createReadStream(sourceFile);
      destStream = fs.createWriteStream(destinationFile);
 
      sourceStream
        .on("error", function (error) {
          console.error("Problem copying file: " + error.stack);
          destStream.end();
          failure();
        })
        .on("end", function () {
          destStream.end();
          success();
        })
        .pipe(destStream);
    }
    catch (err) {
      console.error(err)
    }
  
  // mkdirp(destinationDir)
  //   .then( ()=>{
  //     var sourceStream, destStream;
  //     sourceStream = fs.createReadStream(sourceFile);
  //     destStream = fs.createWriteStream(destinationFile);

  //     sourceStream
  //       .on("error", function (error) {
  //         console.error("Problem copying file: " + error.stack);
  //         destStream.end();
  //         failure();
  //       })
  //       .on("end", function () {
  //         destStream.end();
  //         success();
  //       })
  //       .pipe(destStream);
  //   })
  //   .catch((error) => {
  //     console.error(
  //       "Problem creating directory " + destinationDir + ": " + error
  //     );
  //     failure();
  //   })
}

function moveUploadedFile(file, uuid, success, failure) {
  var destinationDir = uploadedFilesPath + uuid + "/",
    fileDestination = destinationDir + file.name;
  moveFile(destinationDir, file.path, fileDestination, success, failure);
}

function storeChunk(file, uuid, index, numChunks, success, failure) {
  var destinationDir = uploadedFilesPath + uuid + "/" + chunkDirName + "/",
    chunkFilename = getChunkFilename(index, numChunks),
    fileDestination = destinationDir + chunkFilename;
  moveFile(destinationDir, file.path, fileDestination, success, failure);
}

function combineChunks(file, uuid, success, failure) {
  var chunksDir = uploadedFilesPath + uuid + "/" + chunkDirName + "/",
    destinationDir = uploadedFilesPath + uuid + "/",
    fileDestination = destinationDir + file.name;

  fs.readdir(chunksDir, function (err, fileNames) {
    var destFileStream;

    if (err) {
      console.error("Problem listing chunks! " + err);
      failure();
    } else {
      fileNames.sort();
      destFileStream = fs.createWriteStream(fileDestination, { flags: "a" });

      appendToStream(
        destFileStream,
        chunksDir,
        fileNames,
        0,
        function () {
          rimraf(chunksDir, function (rimrafError) {
            if (rimrafError) {
              console.log("Problem deleting chunks dir! " + rimrafError);
            }
          });
          success();
        },
        failure
      );
    }
  });
}

function appendToStream(
  destStream,
  srcDir,
  srcFilesnames,
  index,
  success,
  failure
) {
  if (index < srcFilesnames.length) {
    fs.createReadStream(srcDir + srcFilesnames[index])
      .on("end", function () {
        appendToStream(
          destStream,
          srcDir,
          srcFilesnames,
          index + 1,
          success,
          failure
        );
      })
      .on("error", function (error) {
        console.error("Problem appending chunk! " + error);
        destStream.end();
        failure();
      })
      .pipe(destStream, { end: false });
  } else {
    destStream.end();
    success();
  }
}

function getChunkFilename(index, count) {
  var digits = new String(count).length,
    zeros = new Array(digits + 1).join("0");

  return (zeros + index).slice(-digits);
}

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../models/UserSchema");
const { PassThrough } = require("stream");

// Extract Data from PDF
const extract_data_pdf = async (name) => {
  const getPDF = async (file) => {
    let readFileSync = fs.readFileSync(file);
 
      let pdfExtract = await pdfParse(readFileSync);
      text = pdfExtract.text + text;
   
  };
  const pdfPath = path.join(__dirname, "../../uploads/", name);
  await getPDF(pdfPath);
};

// Extract data from docx
const extract_data_docx = async (name) => {
  const filePath = path.join(__dirname, "../../uploads", name);

  const extracted = await extractor.extract(filePath);

  text += extracted.getBody();
  console.log(text)
};

// Extract Data from Img
const extract_data_img = async (name) => {
  const filePath = path.join(__dirname, "../../uploads", name);

  const txt = await tesseract.recognize(filePath, config);

  text += txt;
};

// Extract Data from Epub
const extract_data_epub = async (name) => {
  const filePath = path.join(__dirname, "../../uploads", name);
   epubToText.extract(filePath, (_err, txt) => {
    text += txt;
  });
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log(text)

};

// Extract Data from Audio
const extract_data_audio =async(name) => {
  const filePath = path.join(__dirname, "../../uploads/" + name);
  
    // Creates a client
  const client = new speech.SpeechClient();

  // Reads a local audio file and converts it to base64
  const file = fs.readFileSync(filePath);
  const audioBytes = file.toString('base64');
  // The audio file's encoding, sample rate in hertz, and language
const audio = {
  content: audioBytes,
};
const config = {
  encoding: 'LINEAR16',
  sampleRateHertz: 16000,
  languageCode: 'en-US',
};
const request = {
  audio: audio,
  config: config,
};

// Detects speech in the audio file
client
  .recognize(request)
  .then(data => {
    const response = data[0];
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    console.log(`Transcription: ${transcription}`);
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
 
};
// @route POST api/users/register
// @desc Register user
// @access Public

router.post("/register", async (req, res) => {
  try {
    // Form validation
    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }
    let user = await User.findOne({ email: req.body.email });
    if (user)
      return res
        .status(409)
        .send({ message: "User with given email already Exist!" });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    user = await new User({ ...req.body, password: hashPassword }).save();

    const token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();
    const url = `${process.env.BASE_URL}users/${user.id}/verify/${token.token}`;
    await sendEmail(user.email, "Verify Email", url);

    res
      .status(201)
      .send({ message: "An Email sent to your account please verify" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public

router.post("/login", (req, res) => {
  //Form Valdiation
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  //Find user by Email
  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }

    // Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name,
        };

        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926,
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

// @route POST api/upload_file
// @desc Save Uploaded the file
// @access Public
router.post("/upload_file", upload.array("files"), async (req, res) => {
  text = ''
  if (!req.files) {
    throw Error("File Missing");
  } else {
    for (let i = 0; i < req.files.length; i += 1) {
      //Check the File type == PDF
      if (req.files[i].mimetype === "application/pdf")
        try {
          await extract_data_pdf(req.files[i].filename);
        } catch {
          res.status(500).send('Internal Error');
          return;
        }
        
      //Check the File Type == docx
      if (
        req.files[i].mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      )
        try {
          await extract_data_docx(req.files[i].filename);
        } catch (error) {
          res.status(500).send('Internal Error');
          return;
        }
        
      //Check the File Type == Epub
      if (req.files[i].mimetype === "application/epub+zip") 
      try {
        await extract_data_epub(req.files[i].filename);
      } catch (error) {
        res.status(500).send('Internal Error');
        return;
      }
        
      
      //File TYPE == Image'
      if (req.files[i].mimetype.includes("image"))
      try {
        await extract_data_img(req.files[i].filename);
      } catch (error) {
        res.status(500).send('Internal Error');
        return;
      }
       
      //FILE TYPE == Audio
      if (req.files[i].mimetype.includes("audio"))
      try {
        await extract_data_audio(req.files[i].filename);
      } catch (error) {
        res.status(500).send('Internal Error');
        return;
      }
        
    }
    if(text == '')   res.status(500).send('Internal Error');

  }
  res.send({ status: "success", result: text });
  text = ''
});

router.post("/upload", onUpload);
//@route GET api/:id/verify/:token/
//@desc send verify code
//@access Public

router.post("/delete/id", () => {
  console.log("sadfsadf");
});
router.get("/:id/verify/:token/", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send({ message: "Invalid link" });

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send({ message: "Invalid link" });

    await User.updateOne({ _id: user._id, verified: true });
    await token.remove();

    res.status(200).send({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
