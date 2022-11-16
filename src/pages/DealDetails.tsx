import {
  IonPage,
  IonContent,
  IonCard,
  IonItem,
  IonLabel,
  IonInput,
  IonBadge,
  IonButton,
  IonIcon,
  IonTitle,
  IonCol,
  IonGrid,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonFooter,
  IonTextarea,
  IonImg,
  IonDatetime,
  IonDatetimeButton,
  IonModal,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { arrowBackOutline, closeCircle } from "ionicons/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "../hooks/redux/store";
import { fetchProducts } from "../hooks/redux/actions/productsAction";
// import { filterPlainArray } from "../utilities/helpers";
import AtImageUpload from "../components/AtImageUpload";
import Select from "react-select";
import { updateDealProduct } from "../hooks/redux/actions/deal_productsAction";
import AtModalAlert from "../components/AtModalAlert";

const DealDetails: React.FC<any> = ({
  onClose,
  deal,
  onUpdateItem,
  onDeleteMode,
}) => {
  const dispatch = useDispatch();
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
  const [filters, setFilters] = useState<any>({ product_name: [] });
  let allProducts = useSelector((state: RootStore) => state.allProducts);
  const [filteredProducts, setFilteredProducts] = useState<any>({
    product_name: [],
  });
  const [selectedOptions, setSelectedOptions] = useState<any>([]);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [currentProduct, setCurrentProduct] = useState<any>({});
  const [minDate, setMinDate] = useState<any>();

  const imageFields = [
    "image_url_main",
    "image_url_other1",
    "image_url_other2",
    "image_url_other3",
    "image_url_other4",
    "image_url_other5",
    "image_url_other6",
    "image_url_other7",
  ];

  const onDismiss = async () => {
    onClose();
  };

  const updateDealProducts = () => {
    const newOptions = deal?.deal_products
      ?.filter((f: any) => f.status !== "deleted")
      ?.map((dp: any) => {
        const {
          deal_id,
          product_id,
          quantity_max,
          sold = 0,
          quantity_sold,
          product,
        } = dp;
        return {
          deal_id,
          value: product_id,
          //--- label: product.product_name_ar,
          label: product.product_name,
          product,
          product_id,
          quantity_max,
          sold: sold ? sold : quantity_sold,
        };
      });
    setSelectedOptions(newOptions);
  };
  useEffect(() => {
    if (!deal?.status) {
      deal.status = "draft";
    }
    if (deal) {
      updateDealProducts();
    }
    ////dispatch(fetchCategories());
    // eslint-disable-next-line
  }, [deal]);

  useEffect(() => {
    setFilters({ product_name: [] });
    dispatch(fetchProducts());
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (allProducts && allProducts?.length > 0) {
      // setFilteredProducts(filterPlainArray(allProducts, filters));
      const prods = allProducts.map((product: any) => {
        const { id, product_name } = product;
        return {
          value: id,
          label: product_name,
          deal_id: deal.id,
          product_id: id,
          product,
          quantity_max: 0,
          // quantity_sold: 0,
          sold: 0,
        };
      });
      setFilteredProducts(prods);
    }
    // eslint-disable-next-line
  }, [allProducts, filters]);

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
  const onChange = (e: any) => {
    // console.log("e.target.name >>>>", e.target.name, e.detail.value!);
    if (e.target.name === "date_start") {
      setMinDate(e.detail.value!);
    }
    deal[e.target.name] = e.detail.value!;
    setButtonDisabled(false);
  };

  const onChangeQuantity = (e: any, index: number) => {
    const { product_id } = selectedOptions[index];
    const dpIndex = deal.deal_products.findIndex(
      (p: any) => p.product_id === product_id
    );
    deal.deal_products[dpIndex] = {
      ...deal.deal_products[dpIndex],
      [e.target.name]: e?.target?.value!,
    };
    updateDealProducts();
    setButtonDisabled(false);
  };
  const handleChange = (data: any) => {
    // console.log("data >>>", data);
    deal.deal_products = data;
    updateDealProducts();
    // setButtonDisabled(false);  //-- disabled to avoid saving quantity=0
  };
  const onSaveData = () => {
    console.log("selectedOptions >>>>", selectedOptions);
    onUpdateItem(deal);
    const data = {
      deal_id: deal.id,
      items: selectedOptions,
    };
    dispatch(updateDealProduct(data));
    onDismiss();
  };

  const onDeleteMode_Product = (index: number) => {
    // console.log("selectedOptions[index] >>>>>>", selectedOptions[index])
    setCurrentProduct(selectedOptions[index]);
    setShowAlert(true);
  };
  const onDeleteProduct = () => {
    // console.log("currentProduct >>>>>>", currentProduct);
    deal.deal_products = deal.deal_products.filter(
      (f: any) => f.product_id !== currentProduct?.product_id
    );
    updateDealProducts();
    setButtonDisabled(false);
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
                {deal?.name ? deal?.name : "Add deal"}
                &nbsp;&nbsp;
                <IonBadge color={statusColor(deal?.status)}>
                  {deal?.status}
                </IonBadge>
              </IonTitle>
            </IonCol>
          </IonRow>
        </IonGrid>

        <div className="at-grid-2-1">
          <div className="at-grid-col-1">
            <div className="page-content-box at-box-shadow margin-10">
              <IonTitle className="size-16 at-bold color-444 pad-10-tb pad-0-left">
                Customer buys
              </IonTitle>
              {filteredProducts && filteredProducts?.length > 0 && (
                <Select
                  value={selectedOptions}
                  options={filteredProducts}
                  isMulti={true}
                  onChange={handleChange}
                  placeholder="Search products"
                  className="at-select-search is-selected-list-hidden"
                />
              )}

              <br />

              <div hidden={selectedOptions?.length <= 0}>
                <div className="at-flex size-14">
                  <div style={{ flex: "0 0 50px" }}></div>
                  <div style={{ flex: "1" }}>Product</div>
                  <div style={{ flex: "0 0 100px" }} className="at-right">
                    Maximum
                  </div>
                  <div style={{ flex: "0 0 50px" }} className="at-right">
                    Sold
                  </div>
                  <div style={{ flex: "0 0 30px" }}></div>
                </div>
                <div className="at-border-top"></div>
              </div>

              {selectedOptions &&
                selectedOptions?.length > 0 &&
                selectedOptions?.map((item: any, index: number) => {
                  // console.log("item >>>>", item);
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
                        <div style={{ flex: "0 0 100px" }} className="at-right">
                          <div className="at-input-number">
                            <input
                              min="0"
                              //---  max={item?.quantity}
                              type="number"
                              name="quantity_max"
                              // title="Edit option is currently disabled. AvT"
                              value={item?.quantity_max}
                              onChange={(e) => onChangeQuantity(e, index)}
                            />
                          </div>
                        </div>
                        <div style={{ flex: "0 0 50px" }} className="at-center">
                          <div className="x-at-input-number">
                            {/* <label> {item?.quantity_sold} </label> */}
                            <label> {item?.sold ? item?.sold : 0} </label>
                          </div>
                        </div>
                        <div style={{ flex: "0 0 30px" }} className="at-right">
                          <IonIcon
                            icon={closeCircle}
                            size="small"
                            color="danger"
                            className="cursor-pointer"
                            onClick={() => onDeleteMode_Product(index)}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
            <IonCard className="page-content-box at-box-shadow">
              <IonTitle className="size-16 at-bold color-444 pad-10-top pad-0-left">
                Customer gets
              </IonTitle>
              <IonItem className="at-data-entry">
                <IonLabel position="stacked" className="size-20">
                  Deal
                </IonLabel>
                <IonInput
                  name="name"
                  className="size-14"
                  placeholder="AED 10,000 cash"
                  value={deal?.name}
                  onIonChange={(e: any) => onChange(e)}
                ></IonInput>
              </IonItem>
              <IonItem className="at-data-entry">
                <IonLabel
                  position="stacked"
                  className="size-20  at-right"
                  style={{ alignSelf: "flex-end" }}
                >
                  صفقة
                </IonLabel>
                <IonInput
                  name="name_ar"
                  className="size-14"
                  placeholder="10،000 درهم كاش"
                  value={deal?.name_ar}
                  onIonChange={(e: any) => onChange(e)}
                  style={{ direction: "rtl" }}
                ></IonInput>
              </IonItem>
              <IonItem className="at-data-entry">
                <IonLabel position="stacked" className="size-20">
                  Description
                </IonLabel>
                <IonTextarea
                  name="description"
                  className="size-14"
                  value={deal?.description}
                  onIonChange={(e) => onChange(e)}
                  autoGrow={true}
                  autocapitalize="sentences"
                ></IonTextarea>
              </IonItem>
              <IonItem className="at-data-entry">
                <IonLabel
                  position="stacked"
                  className="size-20  at-right"
                  style={{ alignSelf: "flex-end" }}
                >
                  وصف
                </IonLabel>
                <IonTextarea
                  name="description_ar"
                  className="size-14"
                  value={deal?.description_ar}
                  onIonChange={(e) => onChange(e)}
                  autoGrow={true}
                  autocapitalize="sentences"
                  style={{ direction: "rtl" }}
                ></IonTextarea>
              </IonItem>
            </IonCard>

            {imageFields && (
              <AtImageUpload
                title="Media"
                dataObject={deal}
                imageFields={imageFields}
                setButtonDisabled={setButtonDisabled}
              />
            )}
          </div>
          <div className="at-grid-col-2">
            <IonCard className="page-content-box at-box-shadow">
              <IonTitle className="size-16 at-bold color-444 pad-10-top pad-0-left">
                Deal status
              </IonTitle>
              <IonItem lines="none" className="at-data-entry">
                <IonLabel position="stacked" className="size-20"></IonLabel>
                <IonSelect
                  name="status"
                  className="at-box size-14"
                  interface="popover"
                  placeholder="Select status"
                  value={deal?.status}
                  onIonChange={(e: any) => onChange(e)}
                >
                  <IonSelectOption value="active">Active</IonSelectOption>
                  <IonSelectOption value="draft">Draft</IonSelectOption>
                  <IonSelectOption value="archived">Archived</IonSelectOption>
                </IonSelect>
              </IonItem>
              <IonItem lines="none" className="at-data-entry">
                <IonLabel position="stacked" className="size-20">
                  Deal start at
                </IonLabel>
                <IonDatetimeButton
                  datetime="date_start"
                  className="margin-20-top size-14"
                ></IonDatetimeButton>

                <IonModal keepContentsMounted={true}>
                  <IonDatetime
                    id="date_start"
                    name="date_start"
                    // preferWheel={true}
                    value={deal?.date_start}
                    onIonChange={(e: any) => onChange(e)}
                  ></IonDatetime>
                </IonModal>
              </IonItem>
              <IonItem lines="none" className="at-data-entry">
                <IonLabel position="stacked" className="size-20">
                  Deal ends at
                </IonLabel>
                <IonDatetimeButton
                  datetime="date_end"
                  className="margin-20-top size-14"
                ></IonDatetimeButton>

                <IonModal keepContentsMounted={true}>
                  <IonDatetime
                    id="date_end"
                    name="date_end"
                    // min={deal?.date_start}
                    min={minDate}
                    value={
                      deal?.date_end < deal?.date_start
                        ? deal?.date_start
                        : deal?.date_end
                    }
                    onIonChange={(e: any) => onChange(e)}
                  ></IonDatetime>
                </IonModal>
              </IonItem>
              {/* {deal?.date_start}
                {minDate} */}
            </IonCard>
          </div>
        </div>
        <div className="at-border-top">
          <IonItem style={{ padding: "0" }} className="at-action-menu">
            <IonButton
              className="at-button"
              onClick={() => {
                onDeleteMode(deal);
              }}
              fill="outline"
              color="danger"
            >
              <span>Delete deal</span>
            </IonButton>
            <IonButton
              onClick={onSaveData}
              className="at-button at-center"
              disabled={buttonDisabled}
              slot="end"
            >
              <span>Save</span>
            </IonButton>
          </IonItem>
        </div>
      </IonContent>

      <IonFooter className="ion-no-border "></IonFooter>
      {selectedOptions && (
        <AtModalAlert
          isOpen={showAlert}
          onClose={(isOk: boolean) => {
            setShowAlert(false);
            // isOk && onDeleteProduct(currentProduct);
            isOk && onDeleteProduct();
          }}
          data={{
            label: "product",
            title: `Delete product '${currentProduct?.label}'?`,
            description: "This can’t be undone.",
          }}
        />
      )}
      {/* 
      {console.log("selectedOptions >>>>", selectedOptions)}
      {console.log("filteredProducts >>>>", filteredProducts)}
      {console.log("allProducts >>>>", allProducts)}
      {console.log("deal >>>>", deal)}
    */}
    </IonPage>
  );
};

export default DealDetails;
