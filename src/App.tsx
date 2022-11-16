import React, { useEffect, useState } from "react";
import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonRouterOutlet,
  IonSplitPane,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { home, fileTray, pricetag, people, cash, trophy } from "ionicons/icons";
import { AppPage } from "./declarations";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
// import "@ionic/react/css/normalize.css";
// import "@ionic/react/css/structure.css";
// import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
// import "@ionic/react/css/padding.css";
// import "@ionic/react/css/float-elements.css";
// import "@ionic/react/css/text-alignment.css";
// import "@ionic/react/css/text-transformation.css";
// import "@ionic/react/css/flex-utils.css";
// import "@ionic/react/css/display.css";

/* Theme variables */
import "./assets/theme/variables.css";
import "./assets/styles/common.css";

/* Pages Imports */
////// import Home from "./pages/Home";
// import Page1 from "./pages/Page1";
// import Page2 from "./pages/Page2";

/* Components Imports */
import Menu from "./components/Menu";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import Inventory from "./pages/Inventory";
import Deals from "./pages/Deals";
import { Provider } from "react-redux";
import store from "./hooks/redux/store";
import Winners from "./pages/Winners";
import Signin from "./pages/Signin";
// import MenuTopBar from "./components/MenuTopBar";
// import Tester from "./components/Tester";

/* Creating appPages for routing */
// const appPages: AppPage[] = [
//   {
//     title: "Home",
//     url: "/home",
//     icon: home,
//     children: [],
//   },

//   {
//     title: "Orders",
//     url: "/orders",
//     icon: fileTray,
//     children: [],
//     // children: [
//     //   {
//     //     title: "Drafts",
//     //     url: "/draft_orders",
//     //   },
//     //   {
//     //     title: "Abandoned checkouts",
//     //     url: "/checkouts",
//     //   },
//     // ],
//   },
//   {
//     title: "Products",
//     url: "/products",
//     icon: pricetag,
//     children: [
//       {
//         title: "Inventory",
//         url: "/products/inventory",
//       },
//       /****

//        {
//          title: "Transfers",
//         url: "/transfers",
//       },
//       {
//         title: "Collections",
//         url: "/collections",
//       },
//       {
//         title: "Gift Cards",
//         url: "/gift_cards",
//       },
//       */
//     ],
//   },
//   {
//     title: "Customers",
//     url: "/customers",
//     icon: people,
//     children: [],
//   },
//   {
//     title: "Deals",
//     url: "/deals",
//     icon: cash,
//     children: [],
//   },
//   {
//     title: "Winners",
//     url: "/winners",
//     icon: trophy,
//     children: [],
//   },
// ];

// setupIonicReact({ mode: "ios" });
setupIonicReact();

const App: React.FC = () => {
  // const [isOpen, setIsOpen] = useState<boolean>(true);
  const [appPages, setAppPages] = useState<AppPage[]>([
    // {
    //   title: "Home",
    //   url: "/home",
    //   icon: home,
    //   children: [],
    // },

    {
      title: "Orders",
      url: "/orders",
      icon: fileTray,
      children: [],
      // children: [
      //   {
      //     title: "Drafts",
      //     url: "/draft_orders",
      //   },
      //   {
      //     title: "Abandoned checkouts",
      //     url: "/checkouts",
      //   },
      // ],
    },
    {
      title: "Products",
      url: "/products",
      icon: pricetag,
      children: [
        {
          title: "Inventory",
          url: "/products/inventory",
        },
        /****
       
       {
         title: "Transfers",
        url: "/transfers",
      },
      {
        title: "Collections",
        url: "/collections",
      },
      {
        title: "Gift Cards",
        url: "/gift_cards",
      },
      */
      ],
    },
    {
      title: "Customers",
      url: "/customers",
      icon: people,
      children: [],
    },
  ]);

  useEffect(() => {
 
    if (process.env.REACT_APP_IS_LOTTERY === "true") {
      setAppPages([
        ...appPages,
        {
          title: "Deals",
          url: "/deals",
          icon: cash,
          children: [],
        },
        {
          title: "Winners",
          url: "/winners",
          icon: trophy,
          children: [],
        },
      ]);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <Provider store={store}>
      <IonApp>
        {/* {isOpen && (
          <MenuTopBar
            onClose={() => {
              alert("onclose");
              setIsOpen(false);
            }}
          />
        )} */}

        <IonReactRouter>
          {["/signin", "/signup"].includes(window.location.pathname) ? (
            <Route path="/signin" component={Signin} exact={true} />
          ) : (
            <IonSplitPane contentId={"main"} when="md">
              <Menu appPages={appPages} />
              <IonRouterOutlet id={"main"}>
                {/* <Route path="/home" component={Home} exact={true} /> */}
                <Route path="/orders" component={Orders} exact={true} />
                <Route path="/orders/:id" component={Orders} exact={true} />
                <Route
                  path="/orders/:id/:menu"
                  component={Orders}
                  exact={true}
                />
                <Route path="/products" component={Products} exact={true} />
                <Route path="/products/:id" component={Products} exact={true} />
                <Route
                  path="/products/inventory"
                  component={Inventory}
                  exact={true}
                />
                <Route path="/customers" component={Customers} exact={true} />
                <Route
                  path="/customers/:id"
                  component={Customers}
                  exact={true}
                />
                <Route path="/deals" component={Deals} exact={true} />
                <Route path="/deals/:id" component={Deals} exact={true} />
                <Route path="/winners" component={Winners} exact={true} />
                <Route path="/winners/:id" component={Winners} exact={true} />
                <Route exact path="/" render={() => <Redirect to="/home" />} />
              </IonRouterOutlet>
            </IonSplitPane>
          )}
        </IonReactRouter>
      </IonApp>
    </Provider>
  );
};

export default App;
