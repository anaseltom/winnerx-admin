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
  IonText,
  IonReorderGroup,
  IonReorder,
  IonCheckbox,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { arrowBackOutline, trash } from "ionicons/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "../hooks/redux/store";
import { fetchCategories } from "../hooks/redux/actions/categoriesAction";
import AtImageUpload from "../components/AtImageUpload";
import { combineArray, properCase, titleCase } from "../utilities/helpers";
import NumericInput from "react-numeric-input";
import { updateProductList } from "../hooks/redux/actions/productListAction";
import { fetchProductVariants } from "../hooks/redux/actions/productVariantsAction";

const ProductDetails: React.FC<any> = ({
  onClose,
  product,
  onUpdateItem,
  onDeleteMode,
}) => {
  const dispatch = useDispatch();
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
  const [variants, setVariants] = useState<any>([
    { editMode: false, name: "size", values: [""] },
    { editMode: false, name: "color", values: [""] },
  ]);
  const [productVariants, setProductVariants] = useState<any>([]);
  const [hasOptions, setHasOptions] = useState<boolean>(false);
  let allProductVariants = useSelector(
    (state: RootStore) => state.allProductVariants
  );
  let allCategories = useSelector((state: RootStore) => state.allCategories);

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

  const onDismiss = () => {
    onClose(1);
  };

  const populateProductVariants = (arr: any) => {
    // console.log("arr >>>>", arr)

    const arrVariants = arr?.map((v: any, index: number) => {
      v.values = v.values?.filter((f: any) => f !== "");
      if (v.values?.length <= 0) {
        v.values = [...v.values, ""];
      }
      return v?.values;
    });
    const combinedVariants = combineArray(arrVariants);

    // console.log("arrVariants >>>>>>>>>>", arrVariants);
    // console.log("combinedVariants >>>>>>>>>>", combinedVariants);

    if (combinedVariants && combinedVariants.length > 0) {
      const newProductVariants = combinedVariants.map((product_name: any) => {
        let objVariants = null;
        if (allProductVariants && allProductVariants.length > 0) {
          objVariants = allProductVariants?.find(
            (p: any) =>
              p.product_name?.toLowerCase() === product_name?.toLowerCase() &&
              p.parent_id === product.id
          );
        }
        let id = 0,
          unit_price = 0,
          units_in_stock = 0,
          sku = "";

        if (objVariants) {
          id = objVariants.id;
          unit_price = objVariants.unit_price;
          units_in_stock = objVariants.units_in_stock;
          sku = objVariants.sku;
        }

        return {
          id,
          parent_id: product?.id,
          parent_name: product?.product_name,
          image_url_main: product?.image_url_main,
          product_name,
          unit_price,
          units_in_stock,
          sku,
        };
      });
      setProductVariants(newProductVariants);
    }
  };
  const onChangeProductVariant = (
    e: any,
    index: number,
    value: any = null,
    name: any = null
  ) => {
    // console.log("e.target.name >>>", name, e?.target?.name);
    // console.log("e.target.name >>>", e);
    productVariants[index][name === null ? e.target.name : name] = value;
    setButtonDisabled(false);
  };

  useEffect(() => {
    if (!product?.status) {
      product.status = "draft";
    }
    // if (product?.variants) {
    //   const newVariants = JSON.parse(product.variants).map((v: any) => {
    //     v = { ...v, editMode: false };
    //     v.values = [...v.values, ""];
    //     return v;
    //   });
    //   setVariants(newVariants);
    //   populateProductVariants(newVariants);
    // }

    let vLength = 0;
    product?.variant &&
      JSON.parse(product?.variants).map((v: any) => {
        // console.log("v >>>>", v.values.filter((f: any) => f !== "").length);
        vLength += v.values.filter((f: any) => f !== "").length;
        return false;
      });

    setHasOptions(vLength > 0);

    dispatch(fetchProductVariants({ parent_id: product.id }));

    dispatch(fetchCategories());
    // eslint-disable-next-line
  }, [product]);

  useEffect(() => {
    if (allProductVariants) {
      // console.log("allProductVariants >>>", allProductVariants);
      if (product?.variants) {
        // console.log("product?.variants >>>", product?.variants);
        const newVariants = JSON.parse(product.variants).map((v: any) => {
          v = { ...v, editMode: false };
          v.values = [...v.values, ""];
          return v;
        });

        // console.log("newVariants >>>", newVariants);

        setVariants(newVariants);
        populateProductVariants(newVariants);
      }
    }
    // eslint-disable-next-line
  }, [allProductVariants]);

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
    product[e.target.name] = e.detail.value!;
    setButtonDisabled(false);
  };

  const onChangeVariantValue = (e: any, index: number, valuesIndex: number) => {
    const newVariants = [...variants];

    newVariants[index].values[valuesIndex] = e.target.value!;
    if (valuesIndex + 1 === newVariants[index].values.length) {
      newVariants[index].values = [...newVariants[index].values, ""];
    }
    setVariants(newVariants);
  };
  const deleteVariant = (index: number, valuesIndex: number) => {
    const newVariants = [...variants];
    newVariants[index].values = newVariants[index]?.values?.filter(
      (v: any, ndx: number) => ndx !== valuesIndex
    );
    setVariants(newVariants);
  };
  const onEditVariants = (index: number, editMode: boolean) => {
    const newVariants = [...variants];
    newVariants[index].editMode = editMode;
    const lastIndex = newVariants[index].values.length - 1;
    if (newVariants[index].values[lastIndex] !== "") {
      newVariants[index].values = [...newVariants[index].values, ""];
    }
    setVariants(newVariants);
  };
  const onSaveData = () => {
    const items = productVariants?.filter(
      (item: any) => parseFloat(item.unit_price) > 0 && item.units_in_stock > 0
    );

    product.variants = JSON.stringify(variants);
    onUpdateItem(product, items);

    dispatch(updateProductList({ items }));
    onDismiss();
  };

  const saveVariants = () => {
    const newVariants = [...variants].map((v: any, index: number) => {
      v.values = v.values?.filter((o: any) => o !== "");
      return v;
    });

    // product = { ...product, variants: JSON.stringify(newVariants) };
    // product.variants = JSON.stringify(variants);
    // onUpdateItem(product);

    populateProductVariants(newVariants);
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
              <IonItem className="at-data-entry">
                <IonLabel position="stacked" className="size-20">
                  Product Name
                </IonLabel>
                <IonInput
                  name="product_name"
                  className="size-14"
                  placeholder="Apple iPhone 13 mini"
                  value={product?.product_name}
                  onIonChange={(e) => onChange(e)}
                ></IonInput>
              </IonItem>
              <IonItem className="at-data-entry">
                <IonLabel
                  position="stacked"
                  className="size-20  at-right"
                  style={{ alignSelf: "flex-end" }}
                >
                  اسم المنتج
                </IonLabel>

                <IonInput
                  name="product_name_ar"
                  className="size-14"
                  placeholder="Apple iPhone 13 mini"
                  value={product?.product_name_ar}
                  onIonChange={(e) => onChange(e)}
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
                  value={product?.description}
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
                  value={product?.description_ar}
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
                dataObject={product}
                imageFields={imageFields}
                setButtonDisabled={setButtonDisabled}
              />
            )}

            <IonCard
              hidden={hasOptions}
              className="page-content-box at-box-shadow"
            >
              <IonTitle className="size-16 at-bold color-444 pad-10-top pad-0-left">
                Pricing
              </IonTitle>
              <IonItem className="at-data-entry">
                <IonLabel position="stacked" className="size-20">
                  Price
                </IonLabel>
                <IonInput
                  name="unit_price"
                  className="size-12"
                  placeholder="0.00"
                  value={product?.unit_price}
                  onIonChange={(e) => onChange(e)}
                ></IonInput>
              </IonItem>

              <IonItem className="at-data-entry">
                <IonLabel position="stacked" className="size-20">
                  Cost per item
                </IonLabel>
                <IonInput
                  name="unit_cost"
                  className="size-12"
                  placeholder="0.00"
                  value={product?.unit_cost}
                  onIonChange={(e) => onChange(e)}
                ></IonInput>
              </IonItem>
            </IonCard>

            <IonCard
              hidden={hasOptions}
              className="page-content-box at-box-shadow"
            >
              <IonTitle className="size-16 at-bold color-444 pad-10-top pad-0-left">
                Inventory
              </IonTitle>
              <IonItem className="at-data-entry">
                <IonLabel position="stacked" className="size-20">
                  SKU (Stock Keeping Unit)
                </IonLabel>
                <IonInput
                  name="sku"
                  className="size-12"
                  value={product?.sku}
                  onIonChange={(e) => onChange(e)}
                ></IonInput>
              </IonItem>

              <IonTitle className="size-16 at-bold color-444 pad-10-top pad-0-left">
                Quantity
              </IonTitle>

              <IonItem className="at-data-entry">
                {/* <IonLabel className="size-14 at-bold color-666">
                    Location name
                  </IonLabel> */}
                <IonLabel className="size-14 at-bold color-666" slot="end">
                  Available
                </IonLabel>
              </IonItem>
              <IonItem className="at-data-entry">
                {/* <IonLabel className="size-14">Shop location</IonLabel> */}
                <IonInput
                  name="units_in_stock"
                  className="size-12"
                  slot="end"
                  type="number"
                  placeholder="0"
                  value={product?.units_in_stock}
                  onIonChange={(e) => onChange(e)}
                ></IonInput>
              </IonItem>
            </IonCard>

            <IonCard className="page-content-box at-box-shadow">
              <IonTitle className="size-16 at-bold color-444 pad-10-top pad-0-left">
                <IonLabel>Options</IonLabel>
                <IonItem className="size-14 ion-no-padding">
                  <IonCheckbox
                    slot="start"
                    checked={hasOptions}
                    onIonChange={(e) => setHasOptions(e.detail.checked)}
                  />
                  <IonLabel>
                    This product has options, like size or color
                  </IonLabel>
                </IonItem>
              </IonTitle>
              {/* set disabled={true} to activate Reordering*/}
              {hasOptions && (
                <IonReorderGroup disabled={true}>
                  {variants &&
                    variants?.length > 0 &&
                    variants?.map((variant: any, index: number) => {
                      return (
                        <div key={index}>
                          {variant?.editMode ? (
                            <>
                              <IonItem className="at-data-entry">
                                <IonLabel
                                  position="stacked"
                                  className="size-20"
                                >
                                  Option name
                                </IonLabel>
                                <IonSelect
                                  name="status"
                                  className="at-box size-14"
                                  interface="popover"
                                  // placeholder="Size"
                                  value={variant?.name}
                                  onIonChange={(e) => onChange(e)}
                                >
                                  <IonSelectOption value="size">
                                    Size
                                  </IonSelectOption>
                                  <IonSelectOption value="color">
                                    Color
                                  </IonSelectOption>
                                </IonSelect>
                              </IonItem>

                              {variant?.values &&
                                variant?.values?.length > 0 &&
                                variant?.values?.map(
                                  (varnt: any, ndx: number) => {
                                    return (
                                      <IonItem
                                        className="at-data-entry"
                                        key={ndx}
                                      >
                                        <IonInput
                                          accessKey={ndx.toString()}
                                          name="variant"
                                          className="size-12"
                                          placeholder={`${
                                            ndx === 0
                                              ? "Medium"
                                              : "Add another value"
                                          }`}
                                          value={variant?.values[ndx]}
                                          onKeyUp={(e) =>
                                            onChangeVariantValue(e, index, ndx)
                                          }
                                        ></IonInput>

                                        {ndx < variant?.values?.length - 1 ? (
                                          <IonIcon
                                            accessKey={ndx.toString()}
                                            // name={ndx}
                                            icon={trash}
                                            size="small"
                                            className="pad-10-left cursor-pointer"
                                            onClick={() =>
                                              deleteVariant(index, ndx)
                                            }
                                          />
                                        ) : (
                                          <div>
                                            <IonIcon className="pad-15-left" />
                                          </div>
                                        )}
                                      </IonItem>
                                    );
                                  }
                                )}

                              <IonButton
                                className="at-button"
                                slot="end"
                                onClick={() => {
                                  saveVariants();
                                  onEditVariants(index, false);
                                }}
                                fill="outline"
                              >
                                Done
                              </IonButton>
                            </>
                          ) : (
                            <IonItem className="at-data-entry margin-10-top at-border-top ">
                              <IonReorder slot="start" />
                              <IonLabel position="stacked" className="size-20">
                                {properCase(variant?.name)}
                              </IonLabel>
                              <IonButton
                                className="at-button-small"
                                slot="end"
                                onClick={() => onEditVariants(index, true)}
                                fill="outline"
                              >
                                Edit
                              </IonButton>
                              <IonText className="pad-10-top">
                                {variant?.values?.map(
                                  (v: any, index: number) => {
                                    return (
                                      <IonBadge
                                        key={index}
                                        color="light"
                                        className="margin-10-right pad-5"
                                      >
                                        {v}
                                      </IonBadge>
                                    );
                                  }
                                )}
                              </IonText>
                            </IonItem>
                          )}
                        </div>
                      );
                    })}
                </IonReorderGroup>
              )}
            </IonCard>
            {hasOptions && (
              <IonCard className="page-content-box at-box-shadow">
                <IonTitle className="size-16 at-bold color-444 pad-10-top pad-0-left">
                  <IonLabel>Variants</IonLabel>
                </IonTitle>
                <div className="table-responsive">
                  <table id="zero_config" className="at-table">
                    <thead>
                      <tr>
                        {/* <th></th> */}
                        <th>Variant</th>
                        <th>Price</th>
                        <th style={{ width: "10px" }}>Quantity</th>
                        <th>SKU</th>
                        <th></th>
                      </tr>
                    </thead>

                    <tbody>
                      {productVariants &&
                        productVariants.length > 0 &&
                        productVariants?.map((pv: any, index: number) => {
                          return (
                            <tr
                              key={index}
                              // className="cursor-default"
                              // onClick={(e: any) => onEditMode(product, e)}
                            >
                              {/* <td style={{ width: "30px" }}>
                                <IonImg
                                  src={product?.image_url_main}
                                  style={{ width: "40px", height: "40px" }}
                                ></IonImg>
                              </td> */}
                              <td>
                                <div
                                  className="cursor-underline"
                                  // onClick={(e: any) => {
                                  //   e.stopPropagation();
                                  //   window.location.href = `/products/${product?.id}`;
                                  // }}
                                >
                                  {titleCase(pv?.product_name)}
                                </div>
                              </td>
                              {/* <td>{product?.sku ? product?.sku : "No SKU"}</td> */}

                              <td className="at-data-entry">
                                <IonInput
                                  name="unit_price"
                                  className="size-12"
                                  placeholder="0.00"
                                  value={pv?.unit_price}
                                  onIonChange={(e) =>
                                    onChangeProductVariant(
                                      e,
                                      index,
                                      e.detail.value!
                                    )
                                  }
                                ></IonInput>
                              </td>
                              <td className="at-data-entry">
                                <NumericInput
                                  name="units_in_stock"
                                  value={pv?.units_in_stock}
                                  placeholder="0"
                                  // className="at-right pad-5 pad-25-right"
                                  min={0}
                                  //////-- max={100}
                                  // onChange={(
                                  //   valueAsNumber,
                                  //   valueAsString,
                                  //   eTarget
                                  // ) => onChangeItem(eTarget, product)}
                                  onChange={(
                                    valueAsNumber,
                                    valueAsString,
                                    eTarget
                                  ) =>
                                    onChangeProductVariant(
                                      eTarget,
                                      index,
                                      valueAsNumber,
                                      "units_in_stock"
                                    )
                                  }
                                />
                              </td>
                              <td className="at-data-entry">
                                <IonInput
                                  name="sku"
                                  className="size-12"
                                  value={pv?.sku}
                                  onIonChange={(e) =>
                                    onChangeProductVariant(
                                      e,
                                      index,
                                      e.detail.value!
                                    )
                                  }
                                ></IonInput>
                              </td>
                              {/* <td>
                                <div style={{ width: "50px" }}>
                                  <IonButton
                                    style={{ height: "30px" }}
                                    hidden={
                                      !getModifiedItem(product?.id)?.modified
                                    }
                                    className="size-12 text-transform-none"
                                    onClick={() => saveRecord(product)}
                                  >
                                    Save
                                  </IonButton>
                                </div>
                              </td> */}
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </IonCard>
            )}
            {/* <IonCard className="page-content-box at-box-shadow"></IonCard>
            <IonCard className="page-content-box at-box-shadow"></IonCard> */}
          </div>
          <div className="at-grid-col-2">
            <IonCard className="page-content-box at-box-shadow">
              <IonTitle className="size-16 at-bold color-444 pad-10-top pad-0-left">
                Product status
              </IonTitle>
              <IonItem lines="none" className="at-data-entry">
                <IonLabel position="stacked" className="size-20"></IonLabel>
                <IonSelect
                  name="status"
                  className="at-box size-14"
                  interface="popover"
                  placeholder="Select status"
                  value={product?.status}
                  onIonChange={(e) => onChange(e)}
                >
                  <IonSelectOption value="active">Active</IonSelectOption>
                  <IonSelectOption value="draft">Draft</IonSelectOption>
                  <IonSelectOption value="archived">Archived</IonSelectOption>
                </IonSelect>
              </IonItem>
            </IonCard>
            <IonCard className="page-content-box at-box-shadow">
              <IonTitle className="size-16 at-bold color-444 pad-10-top pad-0-left">
                Product organization
              </IonTitle>
              <IonItem lines="none" className="at-data-entry">
                <IonLabel position="stacked" className="size-20">
                  Type
                </IonLabel>
                <IonSelect
                  name="category_name"
                  className="at-box"
                  interface="popover"
                  placeholder="Select type"
                  value={product?.category_name}
                  onIonChange={(e) => onChange(e)}
                >
                  {allCategories &&
                    allCategories?.length > 0 &&
                    allCategories?.map((cat: any, index: number) => {
                      return (
                        <IonSelectOption value={cat.category_name} key={index}>
                          {cat.category_name}
                        </IonSelectOption>
                      );
                    })}
                </IonSelect>
              </IonItem>
            </IonCard>
          </div>
        </div>
        <div className="at-border-top">
          <IonItem style={{ padding: "0" }} className="at-action-menu">
            <IonButton
              className="at-button"
              onClick={() => {
                onDeleteMode(product);
              }}
              fill="outline"
              color="danger"
            >
              <span>Delete product</span>
            </IonButton>
            <IonButton
              onClick={onSaveData}
              // style={{ padding: "10px" }}
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
      <>
        {/* {console.log("productVariants >>>", productVariants)}
        {console.log("variants >>>", variants)} 
      */}
      </>
    </IonPage>
  );
};

export default ProductDetails;
