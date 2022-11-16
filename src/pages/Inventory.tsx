import React, { useEffect, useState } from "react";
import { RootStore } from "../hooks/redux/store";
import { useDispatch, useSelector } from "react-redux";
import NumericInput from "react-numeric-input";
import {
  fetchProducts,
  updateProduct,
} from "../hooks/redux/actions/productsAction";
import {
  IonButton,
  IonCard,
  IonContent,
  IonHeader,
  IonImg,
  IonItem,
  IonLabel,
  IonPage,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonTitle,
} from "@ionic/react";
import { filterPlainArray } from "../utilities/helpers";
import Toolbar from "../components/Toolbar";
import CurrencyFormat from "react-currency-format";

const Inventory: React.FC<any> = () => {
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState<string>("");
  const [currentStatus, setCurrentStatus] = useState<string>("all");
  const [modifiedItems, setModifiedItems] = useState<any>([]);
  const [filters, setFilters] = useState<any>({ product_name: [] });
  let allProducts = useSelector((state: RootStore) => state.allProducts);
  const [filteredProducts, setFilteredProducts] = useState<any>({
    product_name: [],
  });

  useEffect(() => {
    if (searchText) {
      const product_name = searchText?.split(" ");
      //   console.log("product_name >>>>", product_name);
      setFilters({ ...filters, product_name });
    } else {
      setFilters({});
    }
    // eslint-disable-next-line
  }, [searchText]);

  useEffect(() => {
    dispatch(fetchProducts());
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (allProducts && allProducts?.length > 0) {
      setFilteredProducts(
        filterPlainArray(
          allProducts
            .filter((f: any) => !f.variants)
            .filter((p: any) =>
              currentStatus === "all" ? true : p.status === currentStatus
            ),
          filters
        )
      );
    }
    // eslint-disable-next-line
  }, [allProducts, filters, currentStatus]);

  const saveRecord = (item: any) => {
    const items = modifiedItems.filter((i: any) => i.id !== item.id);
    setModifiedItems([...items]);
    dispatch(updateProduct(item, allProducts));
  };

  const onChangeItem = (e: any, item: any) => {
    const id = item?.id;
    const index = modifiedItems.findIndex((i: any) => i.id === id);
    if (index < 0) {
      setModifiedItems([...modifiedItems, { id, modified: true }]);
    }
    if (e?.target) {
      item[e.target.name] = e.target.value!;
    } else {
      item[e.name] = e.value!;
    }
    const idx = allProducts.findIndex((i: any) => i.id === id);
    allProducts[idx] = { ...item };
  };

  const getModifiedItem = (id: number) => {
    return modifiedItems.find((i: any) => i.id === id);
  };
  return (
    <IonPage>
      <IonHeader>
        <Toolbar />
      </IonHeader>
      <IonContent className="page-content">
        <IonItem className="at-title-bar" lines="none">
          <IonTitle>Inventory</IonTitle>
          <IonButton
            onClick={() => (window.location.href = "/products")}
            className="size-14 at-button"
          >
            &nbsp; View products &nbsp;
          </IonButton>
        </IonItem>

        <IonCard className="page-content-box at-box-shadow">
          <IonSegment
            className="size-10"
            onIonChange={(e) => setCurrentStatus(e.detail.value!)}
            value={currentStatus}
            // style={{ maxWidth: "360px" }}
            style={{ maxWidth: "90px" }}
          >
            <IonSegmentButton value="all">
              <IonLabel className="size-12">All</IonLabel>
            </IonSegmentButton>
            {/* <IonSegmentButton value="active">
              <IonLabel className="size-12">Active</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="draft">
              <IonLabel className="size-12">Draft</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="archived">
              <IonLabel className="size-12">Archived</IonLabel>
            </IonSegmentButton> */}
          </IonSegment>
          <IonSearchbar
            value={searchText}
            placeholder="Filter products"
            // className="size-12"
            onIonChange={(e) => setSearchText(e.detail.value!)}
          ></IonSearchbar>

          <div className="table-responsive">
            {filteredProducts && filteredProducts?.length > 0 ? (
              <table id="zero_config" className="at-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Product</th>
                    <th>Price</th>
                    <th>SKU</th>
                    <th style={{ width: "10px" }}>Available</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts?.map((product: any, index: number) => {
                    return (
                      <tr
                        key={index}
                        // className="cursor-default"
                        // onClick={(e: any) => onEditMode(product, e)}
                      >
                        <td style={{ width: "30px" }}>
                          <IonImg
                            src={product?.image_url_main}
                            style={{ width: "40px", height: "40px" }}
                          ></IonImg>
                        </td>
                        {/* <td> {product?.product_name}</td> */}
                        <td>
                          {/* <IonItem
                              routerLink={`/products/${product?.id}`}
                              routerDirection="root"
                              className="cursor-underline"
                  
                            >
                              {product?.product_name}
                            </IonItem> */}

                          {product?.parent_id ? (
                            <>
                              <div
                                className="cursor-underline"
                                onClick={(e: any) => {
                                  e.stopPropagation();
                                  window.location.href = `/products/${product?.parent_id}`;
                                }}
                              >
                                {product?.parent_name}
                              </div>
                              <div className="pad-5-top">
                                {product?.product_name}
                              </div>
                            </>
                          ) : (
                            <div
                              className="cursor-underline"
                              onClick={(e: any) => {
                                e.stopPropagation();
                                window.location.href = `/products/${product?.id}`;
                              }}
                            >
                              {product?.product_name}
                            </div>
                          )}
                        </td>
                        <td>
                          <CurrencyFormat
                            value={product?.unit_price}
                            displayType={"text"}
                            thousandSeparator={true}
                            prefix={""}
                          />
                        </td>
                        <td>{product?.sku ? product?.sku : "No SKU"}</td>
                        <td className="at-data-entry">
                          {/* <IonInput
                              name="units_in_stock"
                              className="size-12 at-right"
                              slot="end"
                              type="number"
                              placeholder="0"
                              value={product?.units_in_stock}
                              onInput={(e) => onChangeItem(e, product)}
                            ></IonInput>{" "} */}

                          {/* https://www.npmjs.com/package/react-numeric-input */}
                          <NumericInput
                            name="units_in_stock"
                            value={product?.units_in_stock}
                            placeholder="0"
                            // className="at-right pad-5 pad-25-right"
                            min={0}
                            //////-- max={100}
                            onChange={(valueAsNumber, valueAsString, eTarget) =>
                              onChangeItem(eTarget, product)
                            }
                          />
                        </td>
                        <td>
                          <div style={{ width: "50px" }}>
                            <IonButton
                              style={{ height: "30px" }}
                              hidden={!getModifiedItem(product?.id)?.modified}
                              className="size-12 text-transform-none"
                              onClick={() => saveRecord(product)}
                            >
                              Save
                            </IonButton>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="at-center pad-20">
                No {currentStatus === "all" ? "available" : currentStatus}{" "}
                products
              </div>
            )}
          </div>
        </IonCard>
      </IonContent>
      {/* <>{console.log("filteredProducts >>>>", filteredProducts)}</> */}
    </IonPage>
  );
};

export default Inventory;
 