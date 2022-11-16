import {
  IonPage,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  IonTitle,
  IonLabel,
  IonCard,
  IonImg,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonInput,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import {
  arrowBackOutline,
  checkmarkCircleOutline,
  ellipseOutline,
  linkOutline,
} from "ionicons/icons";
import { properCase } from "../utilities/helpers";
import _ from "lodash";
import { useDispatch } from "react-redux";
import { updateOrderReturnList } from "../hooks/redux/actions/order_returnsAction";

const OrderRefund: React.FC<any> = ({
  onClose,
  order,
  orderReturns,
  onUpdateItemReturns,
  //   onDeleteMode,
  //   setOrderReturns,
}) => {
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
  const [counter, setCounter] = useState<number>(0);
  const [summary, setSummary] = useState<any>([]);
  const [itemReturn, setItemReturn] = useState<any>([]);
  const dispatch = useDispatch();
  const reasons = [
    "unknown",
    "size was too small",
    "size was too large",
    "customer changed their mind",
    "item not as described",
    "received the wrong item",
    "damaged or defective",
    "style",
    "color",
    "other",
  ];
  const onDismiss = () => {
    onClose(1);
  };

  useEffect(() => {
    if (order) {
      let item_returns = order?.order_items?.map((item: any, index: number) => {
        const order_items = order["order_items"];
        const { id, order_id, product_id } = order_items[index];
        // const order_returns = orderReturns?.find(
        //   (o: any) => o.order_id === order_id && o.product_id === product_id
        // );
        let quantity = 0,
          reason = "unknown";
        // if (order_returns) {
        //   quantity = order_returns.quantity;
        //   reason = order_returns.reason;
        // }

        return {
          order_item_id: id,
          user_id: order.user_id,
          order_id,
          product_id,
          quantity,
          reason,
        };
      });
      setItemReturn(item_returns);
    }
  }, [order]);

  const showStatus = (currentStatus: string, greenStatus: string) => {
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
          <div>{properCase(currentStatus)}</div>
        </div>
      </>
    );
  };
  const showReturnReason = (index: number) => {
    return (
      <IonItem lines="none" className="at-data-entry">
        <IonLabel position="stacked" className="size-18 color-888">
          Select a return reason
        </IonLabel>
        <IonSelect
          name="reason"
          className="at-box size-14"
          interface="popover"
          value={itemReturn[index]?.reason}
          onIonChange={(e) => onChange(e, index)}
        >
          {reasons &&
            reasons.map((reason: string, index: number) => {
              return (
                <IonSelectOption key={index} value={reason} className="size-14">
                  {properCase(reason)}
                </IonSelectOption>
              );
            })}
        </IonSelect>
      </IonItem>
    );
  };

  const onChange = (e: any, index: number) => {
    let item_return = itemReturn[index];
    const name = e.target.name;

    item_return = {
      ...item_return,
      [name]: e.target.value!,
    };
    itemReturn[index] = item_return;
    setItemReturn(itemReturn);
    setCounter(counter + 1); //-- remedy for state auto update that doesn't work
    getSummary();
  };

  const getSummary = () => {
    const reasons: any = _.groupBy(itemReturn, "reason");

    let total = 0;
    let currentSummary: any = Object.keys(reasons).map(
      (reason: any, index: number) => {
        const sum = _.sumBy(reasons[reason], (o: any) => {
          return parseInt("0" + o.quantity);
        });
        total += sum;
        return { reason, sum };
      }
    );
    setButtonDisabled(total <= 0);
    setSummary(currentSummary);
  };
  const showSummary = () => {
    if (buttonDisabled) {
      return <div className="pad-20-top pad-10-bottom">No items selected </div>;
    }
    return (
      <ul className="pad-20-left">
        {summary &&
          summary.map((item: any, index: number) => {
            const { reason, sum } = item;
            return (
              <li hidden={sum <= 0} className="pad-10-top" key={index}>
                <div>
                  Returning {sum} {sum <= 1 ? "item" : "items"}
                </div>
                <div className="size-12 color-aaa">
                  Reason: {properCase(reason)}
                </div>
              </li>
            );
          })}
      </ul>
    );
  };
  const createReturn = () => {
    dispatch(updateOrderReturnList({ order_id: order?.id, items: itemReturn }));
    //--- dispatch(createOrderReturn({ order_no: order?.order_no, items: itemReturn }));
    onUpdateItemReturns(itemReturn);
    onClose(1);
  };

  const onIonChange = (e: any) => {
    const name = e.target.name;
    itemReturn.map((item: any, index: number) => {
      let item_return = itemReturn[index];
      item_return = {
        ...item_return,
        [name]: e.target.value!,
      };
      itemReturn[index] = item_return;
      return false;
    });
    setItemReturn(itemReturn);
    setButtonDisabled(false);
  };
  return (
    <>
      <IonPage>
        <IonContent className="page-content">
          <IonGrid className="at-center">
            <IonRow>
              <IonCol className="at-title">
                <IonButton onClick={onDismiss} fill="outline">
                  <IonIcon icon={arrowBackOutline} />
                </IonButton>
                <IonTitle className="at-left at-ellipsis">
                  Refund returned items
                </IonTitle>
              </IonCol>
            </IonRow>
          </IonGrid>
          <div className="at-grid-2-1">
            <div className="at-grid-col-1">
              <IonCard className="page-content-box at-box-shadow">
                <IonTitle className="pad-10-top pad-0">
                  <div className="at-grid-2">
                    {showStatus(order?.fulfillment_status, "fulfilled")}
                  </div>
                </IonTitle>
                {order?.tracking_no && (
                  <div className="size-12 pad-10-top">
                    <div>{order?.shipping_carrier}</div>
                    <div className="at-flex">
                      <a
                        href={`${order?.tracking_url}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {order?.tracking_no}
                      </a>{" "}
                      &nbsp;
                      <IonIcon icon={linkOutline} />
                    </div>
                  </div>
                )}

                <br />
                {order?.order_items?.map((item: any, index: number) => {
                  return (
                    <div
                      key={index}
                      className={`pad-10-tb ${index > 0 && "at-border-top"}`}
                    >
                      <div className="at-flex">
                        <div style={{ flex: "0 0 50px" }}>
                          <IonImg
                            src={item?.product?.image_url_main}
                            style={{ width: "40px", height: "40px" }}
                          ></IonImg>
                        </div>
                        <div style={{ flex: "1" }}>
                          <div className="cursor-underline color-444">
                            {item?.product?.product_name}
                          </div>
                          {item?.product?.sku && (
                            <div className="pad-5-tb color-888">
                              SKU: {item?.product?.sku}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="at-input-number">
                            <input
                              min="0"
                              max={item?.quantity}
                              type="number"
                              name="quantity"
                              //   value={item?.order_return?.quantity}
                              value={itemReturn[index]?.quantity}
                              onChange={(e) => onChange(e, index)}
                            />
                            <label>/ {item?.quantity} </label>
                          </div>
                        </div>
                      </div>

                      {itemReturn && itemReturn[index]?.quantity > 0 && (
                        <div>{showReturnReason(index)}</div>
                      )}
                    </div>
                  );
                })}
              </IonCard>
              <IonCard className="page-content-box at-box-shadow">
                <div className="at-flex size-14 at-bold color-444 ">
                  Return shipping options
                </div>
                <div className=" pad-20">
                  <div className="at-grid-2">
                    <IonItem className="at-data-entry">
                      <IonLabel position="stacked" className="size-20">
                        Tracking number
                      </IonLabel>
                      <IonInput
                        name="tracking_no"
                        className="size-14"
                        // value={order?.tracking_no}
                        onIonChange={(e) => onIonChange(e)}
                      ></IonInput>
                    </IonItem>
                    <IonItem className="at-data-entry">
                      <IonLabel position="stacked" className="size-20">
                        Shipping carrier
                      </IonLabel>
                      <IonInput
                        name="shipping_carrier"
                        className="size-14"
                        // value={order?.shipping_carrier}
                        onIonChange={(e) => onIonChange(e)}
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
                      //   value={order?.tracking_url}
                      onIonChange={(e) => onIonChange(e)}
                    ></IonInput>
                    {/* <IonLabel position="stacked" className="size-16">
              Enter the tracking page link
            </IonLabel> */}
                  </IonItem>
                </div>
              </IonCard>
            </div>
            <div className="at-grid-col-2">
              <IonCard className="page-content-box at-box-shadow">
                <div className="at-flex size-14 at-bold color-444 ">
                  Summary
                </div>
                <div>{showSummary()}</div>
                <div className="at-border-top">
                  <IonButton
                    //   onClick={onSaveData}
                    onClick={createReturn}
                    className="pad-10-top at-button at-center width-full"
                    disabled={buttonDisabled}
                  >
                    <span>Create return</span>
                  </IonButton>
                </div>
              </IonCard>
            </div>
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default OrderRefund;
