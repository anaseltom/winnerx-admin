import {
  IonPage,
  IonHeader,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonToggle,
  IonInput,
  IonRadio,
  IonCheckbox,
  IonBadge,
  IonButton,
  IonButtons,
  IonIcon,
  IonTitle,
  IonToolbar,
  IonCol,
  IonGrid,
  IonRow,
} from "@ionic/react";
import React from "react";
import { arrowBackOutline } from "ionicons/icons";

const GridSample: React.FC<any> = ({
  isOpen,
  onClose,
  product,
  onUpdateProduct,
}) => {
  const onDismiss = () => {
    onClose(1);
  };
  const statusColor = (status: any) => {
    switch (status) {
      case "active":
        return "success";
      case "draft":
        return "secondary";
      case "archived":
        return "medium";
    }
  };
  return (
    <IonPage>
      <IonContent className="page-content">
        <IonGrid className="at-center">
          <IonRow>
            <IonCol className="at-title">
              <IonButton onClick={onDismiss}>
                <IonIcon icon={arrowBackOutline} />
              </IonButton>
              <IonTitle className="at-left">
                {product?.product_name ? product?.product_name : "Add product"}
                &nbsp;&nbsp;
                <IonBadge color={statusColor(product?.status)}>
                  {product?.status}
                </IonBadge>
              </IonTitle>
            </IonCol>
          </IonRow>
        </IonGrid>

        <div className="at-grid-2-1">
          <div className="at-grid-col-1">
            <IonCard className="page-content-box at-box-shadow">
              <IonCardHeader>
                <IonCardTitle>Sample GridSample</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Eu
                turpis egestas pretium aenean pharetra magna. Feugiat pretium
                nibh ipsum consequat. Congue nisi vitae suscipit tellus. Et
                egestas quis ipsum suspendisse ultrices. Dictum fusce ut
                placerat orci. Massa tincidunt nunc pulvinar sapien et ligula
                ullamcorper malesuada. Mauris pellentesque pulvinar pellentesque
                habitant morbi tristique senectus et netus. Velit ut tortor
                pretium viverra suspendisse potenti nullam ac. Enim neque
                volutpat ac tincidunt vitae semper quis lectus.
              </IonCardContent>
            </IonCard>
            <IonCard className="page-content-box at-box-shadow">
              <IonCardHeader>
                <IonCardTitle>Sample GridSample</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Eu
                turpis egestas pretium aenean pharetra magna. Feugiat pretium
                nibh ipsum consequat. Congue nisi vitae suscipit tellus. Et
                egestas quis ipsum suspendisse ultrices. Dictum fusce ut
                placerat orci. Massa tincidunt nunc pulvinar sapien et ligula
                ullamcorper malesuada. Mauris pellentesque pulvinar pellentesque
                habitant morbi tristique senectus et netus. Velit ut tortor
                pretium viverra suspendisse potenti nullam ac. Enim neque
                volutpat ac tincidunt vitae semper quis lectus.
              </IonCardContent>
            </IonCard>
          </div>
          <div className="at-grid-col-2">
            <IonCard className="page-content-box at-box-shadow">
              <IonCardHeader>
                <IonCardTitle>Sample GridSample</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Eu
                turpis egestas pretium aenean pharetra magna. Feugiat pretium
                nibh ipsum consequat. Congue nisi vitae suscipit tellus. Et
                egestas quis ipsum suspendisse ultrices. Dictum fusce ut
                placerat orci. Massa tincidunt nunc pulvinar sapien et ligula
                ullamcorper malesuada. Mauris pellentesque pulvinar pellentesque
                habitant morbi tristique senectus et netus. Velit ut tortor
                pretium viverra suspendisse potenti nullam ac. Enim neque
                volutpat ac tincidunt vitae semper quis lectus.
              </IonCardContent>
            </IonCard>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default GridSample;
