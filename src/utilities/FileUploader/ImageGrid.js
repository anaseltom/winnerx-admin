import React from "react";

// Rendering individual images
const Image = ({ image, onDeleteImage }) => {

  return (
    <div className="file-item at-media-child">
      <button className="btn-delete" onClick={onDeleteImage}>X</button> 
      <img alt={`img - ${image.id}`} src={image.src} className="file-img" />
    </div>
  );
};

// ImageList Component//
const ImageGrid = ({ images, onDeleteImage }) => {
  // render each image by calling Image component
  const renderImage = (image, index) => {
    return <Image onDeleteImage={onDeleteImage} image={image} key={`${image.id}-image`} />;
  };
  // Return the list of files//
  // return <section  className="file-list">{images.map(renderImage)}</section>;
  return <> {images?.length > 0 && <>{images.map(renderImage)}</>} </>;
  // return (
  //   <>
  //     {" "}
  //     {images?.length > 0 && (
  //       <section className="file-list">
  //         {images.map(renderImage)}
  //         </section>
  //     )}{" "}
  //   </>
  // );
};

export default ImageGrid;
