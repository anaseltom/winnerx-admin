import { IonToolbar, IonButton, IonTitle } from "@ionic/react";
import React from "react";

const MenuTopBar: React.FC<any> = ({ isOpen, onClose }) => {
  return (
    <IonToolbar className="pad-20-right">
      <IonTitle>winnerX</IonTitle>
      <IonButton className="at-button" fill="outline" slot="end" onClick={() => onClose()}>Discard</IonButton>
      
      <IonButton className="at-button"  slot="end" onClick={() => onClose()}
      style={{marginLeft:'10px'}}>
        Save
      </IonButton>
    
    </IonToolbar>
  );
};

export default MenuTopBar;
