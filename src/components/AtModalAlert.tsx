import React from "react";
import { close } from "ionicons/icons";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonTitle,
  IonText,
  IonItem,
  IonFooter,
} from "@ionic/react";

const AtModalAlert: React.FC<any> = ({ isOpen, onClose, data }) => {
  const onDismiss = () => {
    onClose(false);
  };
  return (
    <>
      <IonModal
        isOpen={isOpen}
        onDidDismiss={onDismiss}
        className="modal-alert"
      >
        <IonHeader className="ion-no-border">
          <IonToolbar className="pad-10-right ">
            <IonTitle className="size-18"> {data?.title}</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={onDismiss}>
                <IonIcon icon={close} className="size-26" />
              </IonButton>
            </IonButtons>
          </IonToolbar>
          <IonItem>
            <IonText
              className="pad-20 at-center color-666 size-14"
              dangerouslySetInnerHTML={{ __html: data?.description }}
            ></IonText>
          </IonItem>
        </IonHeader>
        <IonFooter>
          <IonItem className="ion-padding pad-10-tb">
            <IonButton
              className="at-button"
              slot="end"
              onClick={() => {
                onDismiss();
              }}
              fill="outline"
              // color="danger"
            >
              <span>Cancel</span>
            </IonButton>{" "}
            <IonButton
              className="at-button"
              slot="end"
              onClick={() => {
                onClose(true);
                onDismiss();
              }}
              fill="solid"
              color="danger"
            >
              <span>Delete {data.label}</span>
            </IonButton>
          </IonItem>
        </IonFooter>
      </IonModal>
    </>
  );
};

export default AtModalAlert;
