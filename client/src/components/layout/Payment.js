import React from "react";
import "react-dropzone-uploader/dist/styles.css";
import "./Payment.css";

import DropzoneComponent from "react-dropzone-component";

export default class Payment extends React.Component {
  constructor(props) {
    super(props);

    // For a full list of possible configurations,
    // please consult http://www.dropzonejs.com/#configuration
    this.djsConfig = {
      addRemoveLinks: true,
      acceptedFiles: "image/jpeg,image/png,image/gif",
      autoProcessQueue: true,
    };

    this.componentConfig = {
      iconFiletypes: [".jpg", ".png", ".gif", ".pdf"],
      showFiletypeIcon: true,
      postUrl: "/uploadHandler",
    };

    this.dropzone = null;
  }

  handleFileAdded(file) {
    console.log(file);
  }

  handlePost() {
    this.dropzone.processQueue();
  }

  render() {
    const config = this.componentConfig;
    const djsConfig = this.djsConfig;

    // For a list of all possible events (there are many), see README.md!
    const eventHandlers = {
      init: (dz) => (this.dropzone = dz),
      addedfile: this.handleFileAdded.bind(this),
    };

    return (
      <div>
        <DropzoneComponent
          config={config}
          eventHandlers={eventHandlers}
          djsConfig={djsConfig}
          styles={{
            width: 400,
            height: 200,
          }}
        />
      </div>
    );
  }
}
