import { IonItem, IonLabel, IonInput } from "@ionic/react";
import React from "react";

const AtItemInput:React.FC<any> = ({label, name, value, onChange, placeholder=""}) => {
  return (
    <IonItem lines="none" className="at-data-entry">
      <IonLabel position="stacked" className="size-20">
        {label}
      </IonLabel>
      <IonInput
        name={name}
        className="size-14"
        placeholder={placeholder}
        value={value}
        onIonChange={(e) => onChange(e)}
      ></IonInput>
    </IonItem>
  );
};

export default AtItemInput;
