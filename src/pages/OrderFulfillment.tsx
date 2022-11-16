import {
  IonPage,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  IonTitle,
  IonCard,
  IonImg,
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
import { useDispatch, useSelector } from "react-redux";
import { createOrderFulfillment } from "../hooks/redux/actions/order_fulfillmentsAction";
import { RootStore } from "../hooks/redux/store";

const OrderFulfillment: React.FC<any> = ({
  onClose,
  order,
  orderUnfulfilled,
  updateState_OrderItems,
  // onUpdateItem,
  //   onDeleteMode,
}) => {
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  // const [counter, setCounter] = useState<number>(0);
  const [summary, setSummary] = useState<any>({});
  const [isCreated, setIsCreated] = useState<boolean>(false);
  const [itemFulfillment, setItemFulfillment] = useState<any>([]);
  const dispatch = useDispatch();

  let allOrderFulfillmentsReducer = useSelector(
    (state: RootStore) => state.allOrderFulfillmentsReducer
  );

  const onDismiss = () => {
    onClose(1);
  };

  useEffect(() => {
    if (isCreated) {
      order.order_fulfillments = allOrderFulfillmentsReducer.order_fulfillments;
      updateState_OrderItems();
      onDismiss();
    }
  }, [isCreated, allOrderFulfillmentsReducer]);

  useEffect(() => {
    if (order) {
      let total = 0;
      let item_fulfillments = orderUnfulfilled?.map(
        (item: any, index: number) => {
          const { id, order_id, product_id, quantity, price } = item;
          total += parseInt("0" + quantity);
          return {
            order_item_id: id,
            user_id: order?.user_id,
            order_id,
            product_id,
            quantity,
            price,
          };
        }
      );
      setSummary({ ...summary, sum: total, total });
      setItemFulfillment(item_fulfillments);
    }
    // eslint-disable-next-line
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

  const onChange = (e: any, index: number) => {
    let item_return = itemFulfillment[index];
    const name = e.target.name;

    item_return = {
      ...item_return,
      [name]: e.target.value!,
    };
    itemFulfillment[index] = item_return;
    setItemFulfillment(itemFulfillment);
    // setCounter(counter + 1); //-- remedy for state auto update that doesn't work
    getSummary(itemFulfillment);
  };

  const getSummary = (data: any) => {
    const sum = _.sumBy(data, (o: any) => {
      return parseInt("0" + o.quantity);
    });

    setButtonDisabled(sum <= 0);
    setSummary({ ...summary, sum });
  };

  const fulfillItems = async () => {
    const { id, order_no } = order; 
    await dispatch(
      createOrderFulfillment({ order_no, order_id: id, items: itemFulfillment })
    );
    setIsCreated(true);
    // order.order_fulfillments = [...order.order_fulfillments, itemFulfillment];
    // updateState_OrderItems();
    // onDismiss();
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
                  Fulfill items
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
                {orderUnfulfilled?.map((item: any, index: number) => {
                  return (
                    <div
                      key={index}
                      // className={`pad-10-tb ${index > 0 && "at-border-top"}`}
                      className="pad-10-tb"
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
                              title="Edit option is currently disabled. AvT"
                              readOnly={true} //-- remove to activate multiple item fulfillment
                              value={itemFulfillment[index]?.quantity}
                              onChange={(e) => onChange(e, index)}
                            />
                            <label>of {item?.quantity} </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </IonCard>
            </div>
            <div className="at-grid-col-2">
              <IonCard className="page-content-box at-box-shadow">
                <div className="at-flex size-14 at-bold color-444 ">
                  Summary
                </div>
                <div className="pad-20">
                  Fulfilling {summary.sum} of {summary.total}
                  {summary.total <= 0 ? " item" : " items"}
                </div>
                <div className="at-border-top">
                  <IonButton
                    onClick={fulfillItems}
                    className="pad-10-top at-button at-center width-full"
                    disabled={buttonDisabled}
                  >
                    <span>Fulfill items</span>
                  </IonButton>
                </div>
              </IonCard>
            </div>
          </div>
        </IonContent>
      </IonPage>
      {/* {console.log("itemFulfillment >>>>", itemFulfillment)} */}
    </>
  );
};

export default OrderFulfillment;
