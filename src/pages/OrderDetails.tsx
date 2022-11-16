import {
  IonPage,
  IonContent,
  IonCard,
  IonItem,
  IonButton,
  IonIcon,
  IonTitle,
  IonCol,
  IonGrid,
  IonRow,
  IonFooter,
  IonImg,
  IonBadge,
  IonLabel,
  IonInput,
  IonPopover,
  IonList,
  useIonToast,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import {
  arrowBackOutline,
  checkmarkCircleOutline,
  ellipseOutline,
  linkOutline,
  ellipsisHorizontalOutline,
} from "ionicons/icons";
import CurrencyFormat from "react-currency-format";
import { properCase } from "../utilities/helpers";
import AtModalEntry from "../components/AtModalEntry";
// import { updateProductList } from "../hooks/redux/actions/productListAction";
import { useDispatch } from "react-redux";
import OrderReturnItems from "./OrderReturnItems";
import { useParams } from "react-router";
import OrderRefund from "./OrderRefund";
import { updateOrderReturnList } from "../hooks/redux/actions/order_returnsAction";
import AtModalAlert from "../components/AtModalAlert";
import OrderFulfillment from "./OrderFulfillment";
import _ from "lodash";
import {
  deleteOrderFulfillment,
  updateOrderFulfillment,
} from "../hooks/redux/actions/order_fulfillmentsAction";

const currencyCode = "AED";

const OrderDetails: React.FC<any> = ({
  // isOpen,
  onClose,
  order,
  onUpdateItem,
  onDeleteMode,
}) => {
  const dispatch = useDispatch();
  const params: any = useParams();
  const [present] = useIonToast();
  const [showTracking, setShowTracking] = useState<boolean>(false);
  const [showModal_ReturnItems, setShowModal_ReturnItems] =
    useState<boolean>(false);
  const [showModal_Refund, setShowModal_Refund] = useState<boolean>(false);
  const [showModal_Fulfillment, setShowModal_Fulfillment] =
    useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const [orderUnfulfilled, setOrderUnfulfilled] = useState<any>([]);
  const [orderFulfilled, setOrderFulfilled] = useState<any>([]);
  const [orderReturns, setOrderReturns] = useState<any>([]);
  const [trackingInfo, setTrackingInfo] = useState<any>({
    ref_no: "",
    tracking_no: "",
    shipping_carrier: "",
    tracking_url: "",
  });

  const onDismiss = () => {
    onClose(1);
  };

  const updateState_OrderItems = () => {
    if (order) {
      if (order?.order_items) {
        const order_fulfillments: any = order?.order_fulfillments?.filter(
          (o: any) => o.status !== "deleted"
        );
        let fulfilled: any = _.groupBy(
          order_fulfillments?.filter((o: any) => o.order_id === order.id),
          "ref_no"
        );
        setOrderFulfilled(fulfilled);
        const order_items: any = JSON.parse(JSON.stringify(order?.order_items));
        const unfulfilled = order_items?.map((item: any) => {
          let totalQuantity = 0;
          order_fulfillments
            ?.filter((o: any) => o.order_item_id === item.id)
            .map((item_f: any) => {
              totalQuantity += item_f.quantity;
              return false;
            });
          if (totalQuantity) {
            item.quantity -= totalQuantity; //-- unfulfilled adjustments
          }
          return item;
        });
        setOrderUnfulfilled(unfulfilled);
      }
    }
  };

  const actionButtons = (status: string, item: any) => {
    if (status !== "fulfilled") {
      return (
        <IonButton
          onClick={() => {
            setShowModal_Fulfillment(true);
          }}
          className="at-button at-center"
          slot="end"
        >
          <span>Fulfill item</span>
        </IonButton>
      );
    } else {
      if (!item.tracking_no) {
        return (
          <IonButton
            onClick={() => onEditItemTracking(item.ref_no)}
            className="at-button at-center"
            slot="end"
          >
            <span>Add tracking</span>
          </IonButton>
        );
      } else {
        <></>;
      }
    }
  };

  const showItemInfo = (item: any) => {
    return (
      <>
        <td style={{ width: "30px" }}>
          <IonImg
            src={item?.product?.image_url_main}
            style={{ width: "40px", height: "40px" }}
          ></IonImg>
        </td>
        <td>
          <div
            className="cursor-underline"
            // onClick={(e: any) => {
            //   e.stopPropagation();
            //   window.location.href=`/products/${item?.product?.id}`
            // }}
          >
            {item?.product?.product_name}
          </div>
          {item?.product?.sku && (
            <div className="pad-5-tb color-888">SKU: {item?.product?.sku}</div>
          )}
          {item?.reason && (
            <div className=" pad-15-left color-444">
              <div style={{ display: "list-item" }}>
                Return reason: {item?.reason}
              </div>
            </div>
          )}
        </td>

        <td>
          <div className="at-right">
            <span className="size-12 color-aaa">{currencyCode}</span>{" "}
            <CurrencyFormat
              value={item?.price}
              displayType={"text"}
              thousandSeparator={true}
              prefix={""}
            />{" "}
            <span className="size-10 color-aaa">X</span> {item?.quantity}
          </div>
        </td>
        <td className="at-right">
          <div>
            <span className="size-12 color-aaa">{currencyCode}</span>{" "}
            <CurrencyFormat
              value={item?.quantity * item?.price}
              displayType={"text"}
              thousandSeparator={true}
              prefix={""}
              decimalScale={2}
              fixedDecimalScale={true}
            />
          </div>
        </td>
      </>
    );
  };
  const showOrderItems = (
    items: any,
    status: string,
    ref_no: string = "",
    index: number = 0
  ) => {
    if (items && items.length > 0 && items[0]?.quantity) {
      return (
        <IonCard className="page-content-box at-box-shadow" key={index}>
          <IonTitle className="pad-10-top pad-0">
            <div className="at-grid-2">
              {showStatus(status, "fulfilled")}

              {status === "fulfilled" && (
                <div className="at-right at-bold size-18 cursor-pointer">
                  <IonIcon
                    id={`menu-fulfillment-${index}`}
                    icon={ellipsisHorizontalOutline}
                  />{" "}
                  <IonPopover
                    trigger={`menu-fulfillment-${index}`}
                    side="bottom"
                    alignment="end"
                    className="popover-menu"
                    dismissOnSelect={true}
                  >
                    <IonList>
                      {items[0]?.tracking_no && (
                        <IonItem>
                          <IonButton
                            expand="block"
                            fill="clear"
                            className="text-transform-none color-666 at-left"
                            onClick={() => {
                              onEditItemTracking(items[0].ref_no);
                            }}
                          >
                            Edit tracking
                          </IonButton>
                        </IonItem>
                      )}
                      <IonItem>
                        <IonButton
                          fill="clear"
                          className="text-transform-none color-666"
                          onClick={() => {
                            onUnfulfillItem(ref_no);
                          }}
                        >
                          Cancel fulfillment
                        </IonButton>
                      </IonItem>
                    </IonList>
                  </IonPopover>
                </div>
              )}
            </div>
          </IonTitle>
          {items[0]?.tracking_no && (
            <div className="size-12 pad-10-top">
              <div>{items[0]?.shipping_carrier}</div>
              <div className="at-flex">
                <a
                  href={`${items[0]?.tracking_url}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {items[0]?.tracking_no}
                </a>{" "}
                &nbsp;
                <IonIcon icon={linkOutline} />
              </div>
            </div>
          )}

          <br />
          <table id="zero_config" className="at-table">
            <tbody>
              {items?.map((item: any, index: number) => {
                return <tr key={index}>{showItemInfo(item)}</tr>;
              })}
            </tbody>
          </table>
          <IonItem style={{ padding: "0" }} className="at-action-menu">
            {/* {actionButtons(status, ref_no)} */}
            {actionButtons(status, items[0])}
          </IonItem>
        </IonCard>
      );
    }
    return <></>;
  };

  useEffect(() => {
    if (order) {
      updateState_OrderItems();
      // getOrderItems(order?.order_returns);
    }
    // eslint-disable-next-line
  }, []);

  /*************************************************** */

  const getOrderItems = (data: any = []) => {
    // let order_returns = data;

    // if (data && data.length > 0) {
    let order_returns = data
      ?.filter((d: any) => d?.status !== "deleted" && d?.quantity > 0)
      ?.map((dat: any) => {
        const { ref_no, quantity, reason } = dat;
        let order_items = order?.order_items?.find(
          (o: any) => o.id === dat.order_item_id
        );
        const { order_id, product_id } = order_items;
        return {
          ...order_items,
          ref_no,
          quantity,
          reason,
          order_id,
          product_id,
          user_id: order.user_id,
        };
      });
    // }
    setOrderReturns(order_returns);
    order.order_returns = { ...order_returns };
  };

  useEffect(() => {
    if (params) {
      if (params?.menu === "return") {
        setShowModal_ReturnItems(true);
      }
      if (params?.menu === "refund") {
        setShowModal_Refund(true);
      }
    }
    // eslint-disable-next-line
  }, [params]);

  const showAddressInfo = (table_name: string) => {
    if (order[table_name]) {
      return (
        <>
          <div className="pad-5-top">
            {order[table_name]?.first_name && order[table_name]?.last_name
              ? `${order[table_name]?.first_name} ${order[table_name]?.last_name}`
              : `${order?.customer?.first_name} ${order?.customer?.last_name}`}
          </div>
          {order[table_name]?.company && (
            <div className="pad-5-top"> {order[table_name]?.company}</div>
          )}
          {order[table_name]?.address && (
            <div className="pad-5-top"> {order[table_name]?.address}</div>
          )}
          {order[table_name]?.apartment && (
            <div className="pad-5-top"> {order[table_name]?.apartment}</div>
          )}
          <div className="pad-5-top">
            {order[table_name]?.city
              ? order[table_name]?.city
              : order?.customer?.city}
            {order[table_name]?.state} {order[table_name]?.city}{" "}
            {order[table_name]?.postal_code}
          </div>
          <div className="pad-5-top">
            {order[table_name]?.country
              ? order[table_name]?.country
              : order?.customer?.country}
          </div>
          <div className="pad-5-top">
            {order[table_name]?.mobile_no
              ? order[table_name]?.mobile_no
              : order[table_name]?.phone_no}
          </div>
        </>
      );
    } else {
      return (
        <div className="pad-5-top">
          No {table_name.replace("_", " ")} provided
        </div>
      );
    }
  };
  const statusColor = (status: any) => {
    switch (status) {
      // return "success";
      // return "secondary";
      case "paid":
      case "unpaid":
      case "fulfilled":
      case "unfulfilled":
        return "medium";
    }
    // "primary", "secondary", "tertiary", "success", "warning", "danger", "light", "medium", and "dark"
  };

  const onUnfulfillItem = (ref_no: string) => {
    dispatch(deleteOrderFulfillment({ ref_no, order_id: order.id }));
    order.order_fulfillments = order?.order_fulfillments?.filter(
      (o: any) => o.ref_no !== ref_no
    );
    updateState_OrderItems();
  };
  const onChange = (e: any) => {
    trackingInfo[e.target.name] = e.detail.value!;
    // setButtonDisabled(false);
  };
  const htmlContent = () => {
    // const description = "test description";
    return (
      <>
        <div className=" pad-20">
          <div className="at-grid-2">
            <IonItem className="at-data-entry">
              <IonLabel position="stacked" className="size-20">
                Tracking number
              </IonLabel>
              <IonInput
                name="tracking_no"
                className="size-14"
                value={trackingInfo?.tracking_no}
                onIonChange={(e) => onChange(e)}
              ></IonInput>
            </IonItem>
            <IonItem className="at-data-entry">
              <IonLabel position="stacked" className="size-20">
                Shipping carrier
              </IonLabel>
              <IonInput
                name="shipping_carrier"
                className="size-14"
                value={trackingInfo?.shipping_carrier}
                onIonChange={(e) => onChange(e)}
              ></IonInput>
            </IonItem>
          </div>
          <IonItem className="at-data-entry">
            <IonLabel position="stacked" className="size-20">
              Tracking URL
            </IonLabel>
            <IonInput
              name="tracking_url"
              className="size-14"
              value={trackingInfo?.tracking_url}
              onIonChange={(e) => onChange(e)}
            ></IonInput>
            {/* <IonLabel position="stacked" className="size-16">
              Enter the tracking page link
            </IonLabel> */}
          </IonItem>
        </div>
      </>
    );
  };

  const replaceRoute = (id: any) => {
    const route = `/orders/${id}`;
    window.history.replaceState(null, "WorkOne eCommerce", route);
  };

  const showStatus = (
    currentStatus: string,
    greenStatus: string,
    data: any = []
  ) => {
    return (
      <>
        <div className="at-flex size-14 at-bold color-444 ">
          <IonIcon
            icon={
              currentStatus === greenStatus
                ? checkmarkCircleOutline
                : ellipseOutline
            }
            style={{ color: "green" }}
            size="small"
          />
          &nbsp;
          <div>{properCase(currentStatus.replaceAll("_", " "))}</div>
          {/*  {data && data.length > 0 && (
            <div>
              ({data?.length})
               #<span className="color-888 text-transform-upper">
                {data[0]?.ref_no}
              </span>
              {console.log("data >>>", data)} 
            </div>
          )}*/}
        </div>
      </>
    );
  };
  // const onRefund = () => {
  //   // alert("onRefund");
  //   setShowModal_Refund(true);
  //   replaceRoute(`${order.id}/refund`);
  // };

  const cancelReturn = () => {
    dispatch(updateOrderReturnList({ order_id: order?.id }));
    setOrderReturns([]);
    //--- dispatch(deleteOrderReturn({ order_id: order?.id }));
  };
  const onUpdateItemReturns = (data: any) => {
    getOrderItems(data);
  };

  const onEditItemTracking = (refNo: string) => {
    const { ref_no, tracking_no, shipping_carrier, tracking_url } =
      orderFulfilled[refNo][0];

    setTrackingInfo({
      ...trackingInfo,
      ref_no,
      tracking_no,
      shipping_carrier,
      tracking_url,
    });
    setShowTracking(true);
  };

  const onUpdateItemTracking = (info: any, message: string = "") => {
    dispatch(updateOrderFulfillment(trackingInfo));
    orderFulfilled[trackingInfo.ref_no][0] = {
      ...orderFulfilled[trackingInfo.ref_no][0],
      ...trackingInfo,
    };

    if (message) {
      present(message, 1000);
    }
  };
  return (
    <IonPage>
      <IonContent className="page-content">
        <IonGrid className="at-center">
          <IonRow>
            <IonCol className="at-title">
              <IonButton onClick={onDismiss} fill="outline">
                <IonIcon icon={arrowBackOutline} />
              </IonButton>
              <IonTitle className="at-left at-ellipsis">
                <b>#</b>
                {order?.order_no} &nbsp;
                <IonBadge color={statusColor(order?.payment_status)}>
                  {order?.payment_status?.replace("_", " ")}
                </IonBadge>
                &nbsp;&nbsp;
                <IonBadge color={statusColor(order?.fulfillment_status)}>
                  {order?.fulfillment_status}
                </IonBadge>
              </IonTitle>
            </IonCol>
            <IonCol className="at-title at-justify-right">
              {/******************
                <IonButton
                  onClick={() => {
                    alert("refund");
                    // setShowModal_Refund(true);
                    // replaceRoute(`${order.id}/refund`);
                  }}
                  fill="outline"
                  size="small"
                  className="at-button no-border color-222"
                >
                  <IonLabel className="size-12 pad-0">Refund</IonLabel>
                </IonButton>
                */}

              {order?.fulfillment_status === "fulfilled" && (
                <IonButton
                  onClick={() => {
                    setShowModal_ReturnItems(true);
                    replaceRoute(`${order.id}/return`);
                  }}
                  fill="outline"
                  size="small"
                  className="at-button no-border color-222"
                >
                  <IonLabel className="size-12">Return items</IonLabel>
                </IonButton>
              )}
            </IonCol>
          </IonRow>
        </IonGrid>

        <div className="at-grid-2-1">
          <div className="at-grid-col-1">
            {showOrderItems(orderUnfulfilled, "unfulfilled")}

            {Object.keys(orderFulfilled).map((ref_no: any, index: number) => {
              return showOrderItems(
                orderFulfilled[ref_no],
                "fulfilled",
                ref_no,
                index
              );
            })}

            <IonCard className="page-content-box at-box-shadow">
              {showStatus(order?.payment_status?.replace("_", " "), "paid")}
              <div className="at-grid-3 pad-20-top">
                <div>Subtotal</div>
                <div></div>
                <div className="at-right">
                  <span className="size-12 color-aaa">{currencyCode}</span>{" "}
                  <CurrencyFormat
                    value={order?.total_price}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={""}
                  />
                </div>
              </div>

              <div className="at-grid-3 pad-20-top">
                <div>Discount</div>
                <div>--</div>
                <div className="at-right">
                  <span className="size-12 color-aaa">{currencyCode}</span>{" "}
                  {order?.discount}
                </div>
              </div>
              <div className="at-grid-3 pad-20-top">
                <div>Shipping</div>
                <div>--</div>
                <div className="at-right">
                  <span className="size-12 color-aaa">{currencyCode}</span>{" "}
                  {order?.shipping_fee}
                </div>
              </div>
              <div className="at-grid-3 pad-20-top">
                <div>Tax</div>
                <div>VAT 5%</div>
                <div className="at-right">
                  <span className="size-12 color-aaa">{currencyCode}</span>{" "}
                  {order?.tax}
                </div>
              </div>
              <div className="at-grid-3 pad-20-tb at-bold">
                <div>Total</div>
                <div></div>
                <div className="at-right">
                  <span className="size-12 color-aaa">{currencyCode}</span>{" "}
                  <CurrencyFormat
                    value={order?.total_price}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={""}
                  />
                </div>
              </div>

              {/**** for payment_status='pending' */}
              {/* {order?.payment_status === "pending" && (
                  <div className="at-border-top">
                    <div className="at-grid-3 pad-20-tb at-bold ">
                      <div>Paid by customer</div>
                      <div></div>
                      <div className="at-right">
                        <span className="size-12 color-aaa">
                          {currencyCode}
                        </span>{" "}
                        <CurrencyFormat
                          value={order?.partial_payment}
                          displayType={"text"}
                          thousandSeparator={true}
                          prefix={""}
                        />
                      </div>
                    </div>
                  </div>
                )}
                 */}
              <div className="at-border-top">
                <IonItem style={{ padding: "0" }} className="at-action-menu">
                  <IonButton
                    className="at-button"
                    onClick={() => {
                      // onDeleteMode(order);
                    }}
                    fill="outline"
                    color="danger"
                    slot="end"
                  >
                    <span>Send invoice</span>
                  </IonButton>
                  {/* <IonButton
                      className="at-button"
                      onClick={() => {
                        // onDeleteMode(order);
                        alert("Collect payment");
                      }}
                      slot="end"
                    >
                      <span>Collect payment</span>
                    </IonButton> */}
                </IonItem>
              </div>
            </IonCard>
          </div>
          <div className="at-grid-col-2">
            <IonCard className="page-content-box at-box-shadow">
              <IonTitle className="size-16 at-bold color-444 pad-10-top pad-0-left">
                Delivery status
              </IonTitle>
              <div className="pad-20-top">
                {order?.package_status
                  ? properCase(order?.package_status)
                  : "No delivery status yet"}
              </div>
            </IonCard>
            <IonCard className="page-content-box at-box-shadow">
              <IonTitle className="size-16 at-bold color-444 pad-10-top pad-0-left">
                Notes
              </IonTitle>
              <div className="pad-20-top">
                {order?.remarks ? order?.remarks : "No notes from customer"}
              </div>
            </IonCard>
            <IonCard className="page-content-box at-box-shadow">
              <IonTitle className="size-16 at-bold color-444 pad-10-top pad-0-left">
                Customer
              </IonTitle>
              <div className="pad-20-top">
                {order?.customer?.first_name} {order?.customer?.last_name}
              </div>
              <div className="pad-5-top">
                {" "}
                {order?.customer?.total_orders === 1
                  ? "1 total order"
                  : `${
                      order?.customer?.total_orders === 0
                        ? "No"
                        : `${order?.customer?.total_orders} total`
                    } orders`}
              </div>

              <div className="pad-5-top"> {order?.customer?.notes}</div>
              <hr />
              <div className="pad-10-tb at-bold size-12 color-444">
                {" "}
                CONTACT INFORMATION
              </div>
              <div className="pad-5-top"> {order?.customer?.email}</div>
              <div className="pad-5-top"> {order?.customer?.phone_no}</div>
              <hr />
              <div className="at-grid-2 pad-10-tb at-bold size-12 color-444 ion-no-padding">
                <label> SHIPPING ADDRESS</label>
                {/* <a
                    className="at-right cursor-pointer"
                    href=""
                    onClick={(e: any) => {
                      e.preventDefault();
                      alert();
                    }}
                  >
                    Edit
                  </a> */}
              </div>
              {showAddressInfo("shipping_address")}
              <hr />
              <div className="at-grid-2 pad-10-tb at-bold size-12 color-444">
                <label>BILLING ADDRESS</label>
                {/* <a
                    className="at-right cursor-pointer"
                    href=""
                    onClick={(e: any) => {
                      e.preventDefault();
                      alert();
                    }}
                  >
                    Edit
                  </a> */}
              </div>
              {showAddressInfo("billing_address")}
            </IonCard>
          </div>
        </div>

        <div className="at-border-top">
          <IonItem style={{ padding: "0" }} className="at-action-menu">
            <IonButton
              className="at-button"
              onClick={() => {
                onDeleteMode(order);
              }}
              fill="outline"
              color="danger"
            >
              <span>Delete order</span>
            </IonButton>
            {/* <IonButton
              onClick={() => {
                onUpdateItem(order);
                onDismiss();
              }}
              className="at-button at-center"
              disabled={buttonDisabled}
              slot="end"
            >
              <span>Save</span>
            </IonButton> */}
          </IonItem>
        </div>
      </IonContent>

      <IonFooter className="ion-no-border "></IonFooter>
      <>
        {order && (
          <AtModalEntry
            htmlContent={htmlContent}
            isOpen={showTracking}
            onClose={(isOk: boolean) => {
              setShowTracking(false);
              isOk &&
                onUpdateItemTracking(
                  trackingInfo,
                  "Tracking information updated"
                );
            }}
            data={{
              label: "order",
              title: `Add tracking for #${trackingInfo.ref_no}`,
              description: `Are you sure you want to delete the order  ? This can’t be undone.`,
            }}
          />
        )}

        {showModal_ReturnItems && order && (
          <OrderReturnItems
            onClose={() => {
              setShowModal_ReturnItems(false);
              replaceRoute(order.id);
            }}
            order={order}
            orderReturns={orderReturns}
            onUpdateItemReturns={onUpdateItemReturns}
            // onDeleteMode={onDeleteMode}
            // setOrderReturns={setOrderReturns}
          />
        )}
        {showModal_Refund && order && (
          <OrderRefund
            onClose={() => {
              setShowModal_Refund(false);
              replaceRoute(order.id);
            }}
            order={order}
            onUpdateItem={onUpdateItem}
            onDeleteMode={onDeleteMode}
          />
        )}
        {showModal_Fulfillment && order && (
          <OrderFulfillment
            onClose={() => {
              setShowModal_Fulfillment(false);
              replaceRoute(order.id);
            }}
            order={order}
            orderUnfulfilled={orderUnfulfilled}
            updateState_OrderItems={updateState_OrderItems}
          />
        )}
        {order && (
          <AtModalAlert
            isOpen={showAlert}
            onClose={(isOk: boolean) => {
              setShowAlert(false);
              isOk && cancelReturn();
            }}
            data={{
              label: "return",
              title: "Cancel return",
              description:
                "All items in this return will be marked as fulfilled.",
            }}
          />
        )}
      </>
    </IonPage>
  );
};

export default OrderDetails;
