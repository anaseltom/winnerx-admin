//*Dropzone.js*//
import React, { useEffect } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import "./dropzone.css";

// const uploadURL = "https://api.storein.net/upload";
// const uploadPath = "https://api.storein.net/uploads/user/";

// const uploadURL = "https://www.api.winnerx.shop/upload";
// const uploadPath = "https://www.api.winnerx.shop/uploads/user/";

// const uploadURL = "https://www.api.pvu.one/upload";
// const uploadPath = "https://www.api.pvu.one/uploads/user/";

const uploadURL = process.env.REACT_APP_UPLOAD_URL;
const uploadPath = `${process.env.REACT_APP_UPLOAD_PATH}/user/`;
 
// const uploadURL = "http://localhost:5000/upload";
const Dropzone = ({ onDrop, accept, open, onFilesUploaded }) => {
  const {
    getRootProps,
    getInputProps,
    // isDragActive,
    acceptedFiles,
  } = useDropzone({
    accept,
    onDrop,
  });

  useEffect(() => {
    if (acceptedFiles) {
      const folder = "don-store";

      // console.log("acceptedFiles >>>>", acceptedFiles);
      // onFilesUploaded(acceptedFiles, folder);
      acceptedFiles.map((file) => {
        const formData = new FormData();
        formData.append("folder", folder);
        //   formData.append("images", acceptedFiles);
        formData.append("images", file);
        const config = {
          header: {
            "content-type": "multipart/form-data",
          },
        };

        axios
          .post(uploadURL, formData, config)
          .then((res) => {
            console.log("res >>>>", res.config);
            onFilesUploaded(acceptedFiles, uploadPath + folder);
          })
          .catch((res) => {});
        return true;
      });
    }
  }, [acceptedFiles]);

  // const files = acceptedFiles.map((file) => (
  //   <li key={file.path}>
  //     {file.path} - {file.size} bytes
  //   </li>
  // ));
  return (
    <>
      <div
        {...getRootProps({ className: "dropzone" })}
        // style={{ width: "100%" }}
      >
        <div className="dropzone-container">
          <input className="input-zone" {...getInputProps()} />
          <div className="text-center">
            {/* {isDragActive ? (
          <p className="dropzone-content">Release to drop the files here</p>
        ) : (
          <p className="dropzone-content">
            Drag’n’drop some files here, or click to select files
          </p>
        )} */}

            {/* <p className="dropzone-content">
            Drag’n’drop files here <br /> or click to select files
          </p> */}

            <button type="button" onClick={open} className="btn">
              Add file
            </button>
            <p className="dropzone-content size-12 color-888 ">
              Accepts .jpg, .png files
            </p>
          </div>
          {/* <aside>
        <ul>{files}</ul>
      </aside> */}
        </div>
      </div>
    </>
  );
};

export default Dropzone;
