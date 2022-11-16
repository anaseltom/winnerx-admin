import { IonCard, IonTitle, IonIcon, IonImg } from "@ionic/react";
import React, { useEffect, useState } from "react";
import FileUploader from "../utilities/FileUploader";
import AtModalAlert from "./AtModalAlert";
import { closeCircle } from "ionicons/icons";

const AtImageUpload: React.FC<any> = ({
  title,
  dataObject,
  imageFields,
  setButtonDisabled,
}) => {
  const [state, setState] = useState<any>({ boxes: [] });
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<any>({});

  useEffect(() => {
    onBoxInit();
  }, []);

  const onBoxInit = () => {
    let boxes: any = [];
    imageFields.map((fld: any, index: number) => {
      const image = dataObject[fld];
      if (image) {
        boxes = [...boxes, { id: index + 1, image }];
      }
    });
    setState({ boxes });
  };

  const swapBoxes = (fromBox: any, toBox: any) => {
    let boxes = state.boxes.slice();
    let fromIndex = -1;
    let toIndex = -1;

    for (let i = 0; i < boxes.length; i++) {
      if (boxes[i].id === fromBox.id) {
        fromIndex = i;
      }
      if (boxes[i].id === toBox.id) {
        toIndex = i;
      }
    }

    if (fromIndex !== -1 && toIndex !== -1) {
      let { fromId, ...fromRest } = boxes[fromIndex];
      let { toId, ...toRest } = boxes[toIndex];
      boxes[fromIndex] = { id: fromBox.id, ...toRest };
      boxes[toIndex] = { id: toBox.id, ...fromRest };

      console.log("boxes after>>", boxes);
      setState({ boxes });
    }
    return boxes;
  };

  const handleDragStart = (e: any, data: any) => {
    // console.log("onDraStart e >>>", data, e);
    e.target.style.cursor = "grabbing";
    let fromBox = JSON.stringify({ id: data.id });
    e.dataTransfer.setData("dragContent", fromBox);
  };

  const handleDragLeave = (e: any) => {
    e.target.style.opacity = "1";
    e.preventDefault(); // Necessary. Allows us to drop.
    return false;
  };

  const handleDragOver = (e: any) => {
    e.target.style.opacity = ".5";
    // console.log("onDragOver e >>>",data, e);
    e.preventDefault(); // Necessary. Allows us to drop.
    return false;
  };

  const handleDrop = (e: any, data: any) => {
    e.target.style.opacity = "1";
    e.target.style.cursor = "grab";
    // console.log("onDrop e >>>", data, e);
    e.preventDefault();

    let fromBox = JSON.parse(e.dataTransfer.getData("dragContent"));
    let toBox = { id: data.id };

    const boxes=swapBoxes(fromBox, toBox);
    onUpdateImages(boxes);
    setButtonDisabled(false);
    return false;
  };

  const onDeleteMode_Image = (box: any) => {
    setCurrentImage(box);
    setShowAlert(true);
  };
  const onUpdateImages = (boxes: any) => {
    // alert("boxes >>>" + JSON.stringify(boxes));
    imageFields.map((fld: any, index: number) => {
      dataObject[fld] = "";
      if (boxes && boxes.length > 0) {
        // return
        dataObject[fld] = boxes[index].image;
      }
      setButtonDisabled(false);
    });
  
    // console.log("dataObject ====>>>>", dataObject);
  };
  const onDeleteImage: any = (image: any) => {
    let boxes: any = state.boxes.filter((x: any) => x.id !== image.id);
    setState({ boxes });
    onUpdateImages(boxes);
    //// setButtonDisabled(false);
  };

  const onFilesUploaded: any = (files: any, folder: string) => {
    // alert("onFilesUploaded" + folder +" | " + JSON.stringify(files));
    if (files && files.length > 0) {
      const boxes = [
        ...state.boxes,
        {
          id: state.boxes.length + 1,
          image: `${folder}/${files[0]?.path}`,
        },
      ];
      setState({ boxes });
      onUpdateImages(boxes);
      ////setButtonDisabled(false);
    }
  };

  return (
    <>
      {" "}
      <IonCard className="page-content-box at-box-shadow">
        <IonTitle className="size-16 at-bold color-444 pad-10-top pad-0-left">
          {title}
        </IonTitle>

        <div className="pad-20-top">
          <div className="at-grid-layout">
            {state.boxes.map((box: any, index: number) => {
              return (
                <div
                  key={index}
                  className="at-grid-layout-item"
                  style={{ backgroundColor: box.color, cursor: "grab" }}
                >
                  <IonIcon
                    icon={closeCircle}
                    size="large"
                    onClick={() => onDeleteMode_Image(box)}
                  />
                  <IonImg src={box.image}></IonImg>
                </div>
              );
            })}
            {imageFields && state.boxes.length < imageFields.length && (
              <FileUploader onFilesUploaded={onFilesUploaded} />
            )}
          </div>
        </div>

        {dataObject && (
          <AtModalAlert
            isOpen={showAlert}
            onClose={(isOk: boolean) => {
              setShowAlert(false);
              isOk && onDeleteImage(currentImage);
            }}
            data={{
              label: "file",
              title: `Delete file?`,
              description: "This can’t be undone.",
            }}
          />
        )}
      </IonCard>
      {/* {console.log("dataObject >>>>", dataObject)} */}
    </>
  );
};

export default AtImageUpload;
