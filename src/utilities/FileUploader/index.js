import React, { useState, useCallback } from "react";
import cuid from "cuid";
import Dropzone from "./Dropzone";
// import ImageGrid from "./ImageGrid";

const ReactDropzone = ({ onFilesUploaded }) => {
  const [images, setImages] = useState([]);
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.map((file) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        setImages((prevState) => [
          ...prevState,
          { id: cuid(), src: e.target.result },
        ]);
      };
      reader.readAsDataURL(file);
      return file;
    });
  }, []);
  return (
    <>
       
      {/* {console.log("images >>>", images)} */}
     {/*  <ImageGrid
        images={images}
        onDeleteImage={() => {
          setImages([]);
          onDeleteImage();
        }}
      />
      {images.length <= 0 && <Dropzone onDrop={onDrop} accept={"image/*"} onFilesUploaded={onFilesUploaded}/>} */}
       <Dropzone onDrop={onDrop} accept={"image/*"} onFilesUploaded={onFilesUploaded}/> 
    </>
  );
};

export default ReactDropzone;
