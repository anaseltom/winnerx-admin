import {
  IonAccordion,
  IonAccordionGroup,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  // IonMenuToggle,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { AppPage } from "../declarations";
interface MenuProps extends RouteComponentProps {
  appPages: AppPage[];
}

const Menu: React.FC<MenuProps> = ({ appPages }) => (
  <IonMenu contentId="main" type="overlay">
    <IonHeader>
      <IonToolbar>
        <IonTitle>Menu</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <div className="menu-content">
        <IonAccordionGroup>
          {appPages.map((appPage: any, index: number) => {
            return (
              <IonAccordion value={appPage.title} key={index}>
                <IonItem
                  className="size-14 at-bold"
                  lines="none"
                  slot="header"
                  routerLink={appPage.url}
                  routerDirection="root"
                  detail={false}
                >
                  <IonIcon
                    slot="start"
                    size="small"
                    className="color-666"
                    icon={appPage.icon}
                  />
                  <IonLabel className="size-14 color-666" aria-details="false">
                    {appPage.title}
                  </IonLabel>
                </IonItem>
                {appPage?.children && appPage?.children.length > 0 && (
                  <IonList slot="content" className="side-menu">
                    {appPage?.children.map((page: any, idx: number) => {
                      return (
                        <IonItem
                          className="size-14"
                          lines="none"
                          slot="content"
                          routerLink={page.url}
                          routerDirection="none"
                          detail={false}
                          key={idx}
                        >
                          <IonIcon slot="start" size="small" />
                          <IonLabel className="color-888">
                            {page.title}
                          </IonLabel>
                        </IonItem>
                      );
                    })}
                  </IonList>
                )}
              </IonAccordion>
            );
          })}
        </IonAccordionGroup>
      </div>
    </IonContent>
  </IonMenu>
);

export default withRouter(Menu);
