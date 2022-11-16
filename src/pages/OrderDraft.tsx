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
  IonLabel,
} from "@ionic/react";
import React from "react";
import { arrowBackOutline } from "ionicons/icons";
import CurrencyFormat from "react-currency-format";

const currencyCode = "AED";

const OrderDraft: React.FC<any> = ({
  // isOpen,
  onClose,
  order,
  // onUpdateItem,
  onDeleteMode,
}) => {
  const onDismiss = () => {
    onClose(1);
  };

  const showAddressInfo = (table_name: string) => {
    if (order[table_name]) {
      return (
        <>
          <div className="pad-5-top">
            {order[table_name]?.first_name && order[table_name]?.last_name
              ? `${order[table_name]?.first_name} ${order[table_name]?.last_name}`
              : `${order?.user?.customer?.first_name} ${order?.user?.customer?.last_name}`}
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
              : order?.user?.customer?.city}
            {order[table_name]?.state} {order[table_name]?.city}{" "}
            {order[table_name]?.postal_code}
          </div>
          <div className="pad-5-top">
            {order[table_name]?.country
              ? order[table_name]?.country
              : order?.user?.customer?.country}
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
                  <b>#</b>
                  {order?.order_no}
                </IonTitle>
              </IonCol>
            </IonRow>
          </IonGrid>

          <div className="at-grid-2-1">
            <div className="at-grid-col-1">
              <IonCard className="page-content-box at-box-shadow">
                <IonTitle className="size-16 at-bold color-444 pad-10-top pad-0-left">
                  Products
                </IonTitle>
                <table id="zero_config" className="at-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th></th>
                      <th>Quantity</th>
                      <th className="at-right"> Total</th>
                    </tr>
                  </thead>

                  <tbody>
                    {order?.order_items?.map((item: any, index: number) => {
                      return (
                        <tr
                          key={index}
                          // className="cursor-default"
                          // onClick={(e: any) => onEditMode(product, e)}
                        >
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
                              <div className="pad-5-tb color-888">
                                SKU: {item?.product?.sku}
                              </div>
                            )}
                            <div>
                              <span className="size-12 color-aaa">
                                {currencyCode}
                              </span>{" "}
                              <CurrencyFormat
                                value={item?.price}
                                displayType={"text"}
                                thousandSeparator={true}
                                prefix={""}
                              />
                            </div>
                          </td>

                          <td>
                            <div>{item?.quantity}</div>
                          </td>
                          <td className="at-right">
                            <div>
                              <span className="size-12 color-aaa">
                                {currencyCode}
                              </span>{" "}
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
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </IonCard>
              <IonCard className="page-content-box at-box-shadow">
                <IonTitle className="size-16 at-bold color-444 pad-10-top pad-0-left">
                  Payment
                </IonTitle>
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

                <div className="at-border-top">
                  <IonItem style={{ padding: "0" }} className="at-action-menu">
                    <IonButton
                      className="at-button"
                      onClick={() => {
                        // onDeleteMode(order);
                        alert("send invoice");
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
                  Customer
                </IonTitle>
                <div className="pad-20-top">
                  {order?.user?.customer?.first_name}{" "}
                  {order?.user?.customer?.last_name}
                </div>
                <div className="pad-5-top">
                  {" "}
                  {order?.user?.customer?.total_orders === 1
                    ? "1 total order"
                    : `${
                        order?.user?.customer?.total_orders === 0
                          ? "No"
                          : `${order?.user?.customer?.total_orders} total`
                      } orders`}
                </div>

                <div className="pad-5-top"> {order?.user?.customer?.notes}</div>
                <hr />
                <div className="pad-10-tb at-bold size-12 color-444">
                  {" "}
                  CONTACT INFORMATION
                </div>
                <div className="pad-5-top"> {order?.user?.customer?.email}</div>
                <div className="pad-5-top">
                  {" "}
                  {order?.user?.customer?.phone_no}
                </div>
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
              <IonCard className="page-content-box at-box-shadow">
                <IonTitle className="size-16 at-bold color-444 pad-10-top pad-0-left">
                  Notes
                </IonTitle>
                <div className="pad-20-top">
                  {order?.remarks ? order?.remarks : " No notes"}
                </div>
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
      </IonPage>
      {console.log("order >>>", order)}
    </>
  );
};

export default OrderDraft;
