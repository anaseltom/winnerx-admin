import React, { useEffect, useState } from "react";
import { RootStore } from "../hooks/redux/store";
import { useDispatch, useSelector } from "react-redux";

import { fetchOrders, updateOrder } from "../hooks/redux/actions/ordersAction";
import {
  IonCard,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonPage,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  useIonToast,
} from "@ionic/react";
import OrderDetails from "./OrderDetails";
// import { PlatformContext } from "../contexts/PlatformContext";
import { filterPlainArray, properCase, titleCase } from "../utilities/helpers";
import Toolbar from "../components/Toolbar";
import { useParams } from "react-router";
import AtModalAlert from "../components/AtModalAlert";

import format from "date-fns/format";
import isToday from "date-fns/isToday";
import isYesterday from "date-fns/isYesterday";
import CurrencyFormat from "react-currency-format";

const Orders: React.FC<any> = () => {
  const dispatch = useDispatch();
  // const [present] = useIonAlert();
  const [present, dismiss] = useIonToast();

  const params: any = useParams();
  const [currentId, setCurrentId] = useState<string>("");
  // const { platform } = useContext(PlatformContext);
  const [searchText, setSearchText] = useState<string>("");
  // const [itemCode, setItemCode] = useState<string>("");
  const [currentStatus, setCurrentStatus] = useState<string>("all");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [currentOrder, setCurrentOrder] = useState<any>();
  const [filters, setFilters] = useState<any>({ order_name: [] });
  let allOrders = useSelector((state: RootStore) => state.allOrders);
  const [filteredOrders, setFilteredOrders] = useState<any>({
    order_name: [],
  });

  useEffect(() => {
    // console.log("params>>>>", params);
    // alert("params >>>" + JSON.stringify(params));
    if (params) {
      if (params?.id !== "inventory") {
        setCurrentId(params?.id);
      }
    }
    // alert(showModal)
  }, [params]);

  useEffect(() => {
    if (searchText) {
      const order_no = searchText?.split(" ");
      //   console.log("order_no >>>>", order_no);
      setFilters({ ...filters, order_no });
    } else {
      setFilters({});
    }
    // eslint-disable-next-line
  }, [searchText]);

  useEffect(() => {
    dispatch(fetchOrders());
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (allOrders && allOrders?.length > 0) {
      let orders: any = allOrders;
      if (currentStatus === "unfulfilled") {
        orders = allOrders.filter(
          (p: any) => p.fulfillment_status === currentStatus
        );
      } else if (currentStatus === "unpaid") {
        orders = allOrders.filter(
          (p: any) => p.payment_status === currentStatus
        );
      } else if (currentStatus.includes("delivery")) {
        orders = allOrders.filter(
          (p: any) => p.delivery_method === currentStatus
        );
      } else {
        orders = allOrders.filter((p: any) =>
          currentStatus === "all" ? true : p.status === currentStatus
        );
      }

      setFilteredOrders(filterPlainArray(orders, filters));
    }
    // eslint-disable-next-line
  }, [allOrders, filters, currentStatus]);

  const onDeleteItem = async (item: any) => {
    const id = item?.id;
    allOrders = allOrders?.filter((p: any) => p.id !== id);
    await dispatch(updateOrder({ id, status: "deleted" }, allOrders));
    setShowModal(false);
    replaceRoute("");
  };
  const onDeleteMode = (item: any) => {
    setShowAlert(true);
  };

  const onUpdateItem = (item: any, message: string = "") => {
    // console.log("item >>>", item.id, item);
    dispatch(updateOrder(item, allOrders));
    if (message) {
      present(message, 1000);
    }
  };

  const onFilter = (stat: string) => {
    console.log("filters, status >>>", filters, stat);
    const status = stat?.split(" ");
    setFilters({ ...filters, status });
  };

  useEffect(() => {
    if (currentId) {
      // alert(currentId);
      if (currentId === "new") {
        setCurrentOrder({});
      } else {
        if (filteredOrders && filteredOrders?.length > 0) {
          const prod = filteredOrders?.find(
            (p: any) => p.id === parseInt(currentId)
          );
          if (prod) {
            // console.log("prod =====>>>>>", prod);
            setCurrentOrder(prod);
          }
        }
      }
      setShowModal(true);
    }
  }, [currentId, filteredOrders]);

  const onAddMode = () => {
    setCurrentOrder({});
    setShowModal(true);
    replaceRoute("new");
  };
  const onEditMode = (p: any, e: any) => {
    if (!(e?.target?.tagName === "ION-ICON" && e?.target?.name === "delete")) {
      setCurrentOrder(p);
      setShowModal(true);
      replaceRoute(p.id);
    }
  };

  const replaceRoute = (id: any) => {
    const route = `/orders/${id}`;
    window.history.replaceState(null, "WorkOne eCommerce", route);
  };

  const formatDate = (d: any) => {
    if (isToday(d)) {
      // return `Today at ${format(d, "kk:mm")}`;
      return `Today at ${format(d, "p").toLowerCase()}`;
    }
    if (isYesterday(d)) {
      // return `Yesterday at ${format(d, "kk:mm p")}`;
      return `Yesterday at ${format(d, "p").toLowerCase()}`;
    }
    // return format(d, "dd/MM/yyyy");
    return `${format(d, "MMM dd")} at ${format(d, "p").toLowerCase()}`;
  };

  return (
    <IonPage>
      <IonHeader>
        <Toolbar />
      </IonHeader>
      <IonContent className="page-content">
        <IonItem hidden={showModal} className="at-title-bar" lines="none">
          <IonTitle>Orders</IonTitle>
          {/* <IonButton onClick={onAddMode} className="size-14 at-button">
            &nbsp; Add order &nbsp;
          </IonButton> */}
        </IonItem>

        <IonCard hidden={showModal} className="page-content-box at-box-shadow">
          <IonSegment
            className="size-10"
            onIonChange={(e) => setCurrentStatus(e.detail.value!)}
            value={currentStatus}
            // style={{ maxWidth: "600px" }}
            style={{ maxWidth: "400px" }}
          >
            <IonSegmentButton value="all">
              <IonLabel className="size-12">All</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="unfulfilled">
              <IonLabel className="size-12">Unfulfilled</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="unpaid">
              <IonLabel className="size-12">Unpaid</IonLabel>
            </IonSegmentButton>
            {/* <IonSegmentButton value="open">
              <IonLabel className="size-12">Open</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="closed">
              <IonLabel className="size-12">Closed</IonLabel>
            </IonSegmentButton> */}
            <IonSegmentButton value="local delivery">
              <IonLabel className="size-12">Local Delivery</IonLabel>
            </IonSegmentButton>
          </IonSegment>
          <IonSearchbar
            value={searchText}
            placeholder="Filter orders"
            // className="size-12"
            onIonChange={(e) => setSearchText(e.detail.value!)}
          ></IonSearchbar>

          <div className="table-responsive">
            {filteredOrders && filteredOrders?.length > 0 ? (
              <table id="zero_config" className="at-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Payment status</th>
                    <th>Fullfilment status</th>
                    <th>Items</th>
                    <th>Delivery method</th>
                    {/* <th>Tags</th> */}
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders?.map((order: any, index: number) => {
                    return (
                      <tr
                        key={index}
                        onClick={(e: any) => onEditMode(order, e)}
                      >
                        <td style={{ width: "30px" }}>#{order?.order_no}</td>
                        <td style={{ width: "140px" }}>
                          {/* {order?.created_at} */}
                          {formatDate(new Date(order?.created_at))}
                        </td>
                        <td>
                          {order?.customer?.first_name
                            ? titleCase(
                                order?.customer?.first_name +
                                  " " +
                                  order?.customer?.last_name
                              )
                            : "New customer"}
                        </td>
                        {/* <td>{order?.currency_code} {currencyFormat(order?.total_price, "")}</td> */}
                        <td className="at-center">
                          <span className="size-12 color-aaa">AED</span>{" "}
                          <CurrencyFormat
                            value={order?.total_price}
                            displayType={"text"}
                            thousandSeparator={true}
                            prefix={""}
                          />
                        </td>
                        <td>
                          {properCase(order?.payment_status?.replace("_", " "))}
                        </td>
                        <td>{properCase(order?.fulfillment_status)}</td>
                        <td className="at-center">
                          {order?.total_quantity}{" "}
                          {order?.total_quantity > 1 ? "items" : "item"}
                        </td>
                        <td>{properCase(order?.delivery_method)}</td>
                        {/* <td>{order?.tags}</td> */}
                      </tr>
                    );
                  })}
                </tbody>
                {/* <tfoot>
                  <tr>
                    <th></th>
                    <th>Order</th>
                    <th>Status</th>
                    <th>Inventory</th>
                    <th>Type</th>
                    <th>Seller</th>
                  </tr>
                </tfoot> */}
              </table>
            ) : (
              <div className="at-center pad-20">
                No {currentStatus === "all" ? "available" : currentStatus}{" "}
                orders
              </div>
            )}
          </div>
        </IonCard>

        {showModal && currentOrder && (
          <OrderDetails
            onClose={() => {
              setShowModal(false);
              replaceRoute("");
            }}
            order={currentOrder}
            onUpdateItem={onUpdateItem}
            onDeleteMode={onDeleteMode}
          />
        )}
        {currentOrder && (
          <AtModalAlert
            isOpen={showAlert}
            onClose={(isOk: boolean) => {
              setShowAlert(false);
              isOk && onDeleteItem(currentOrder);
            }}
            data={{
              label: "order",
              // title: `Delete ${currentOrder?.order_name}?`,
              // description: `Are you sure you want to delete the order <b>${currentOrder?.order_name}</b>? This can’t be undone.`,
              title: `Delete order?`,
              description: `Are you sure you want to delete the order? This can’t be undone.`,
            }}
          />
        )}
      </IonContent>
    </IonPage>
  );
};

export default Orders;
