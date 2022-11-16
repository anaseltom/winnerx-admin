import React, { useEffect, useState } from "react";
import { RootStore } from "../hooks/redux/store";
import { useDispatch, useSelector } from "react-redux";

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
// import ProductDetails from "../components/ProductDetails";
import ProductDetails from "./ProductDetails";
// import { PlatformContext } from "../contexts/PlatformContext";
import { filterPlainArray } from "../utilities/helpers";
import Toolbar from "../components/Toolbar";
import { useParams } from "react-router";
import AtModalAlert from "../components/AtModalAlert";

const Products: React.FC<any> = () => {
  const dispatch = useDispatch();
  // const [present] = useIonAlert();
  const params: any = useParams();
  const [currentId, setCurrentId] = useState<string>("");
  // const { platform } = useContext(PlatformContext);
  const [searchText, setSearchText] = useState<string>("");
  // const [itemCode, setItemCode] = useState<string>("");
  const [currentStatus, setCurrentStatus] = useState<string>("all");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [currentProduct, setCurrentProduct] = useState<any>();
  const [filters, setFilters] = useState<any>({ product_name: [] });
  let allProducts = useSelector((state: RootStore) => state.allProducts);
  const [filteredProducts, setFilteredProducts] = useState<any>({
    product_name: [],
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
    // alert(allProducts?.length);

    if (allProducts && allProducts?.length > 0) {
      setFilteredProducts(
        filterPlainArray(
          allProducts
            .filter((f: any) => !f.parent_id)
            .filter((p: any) =>
              currentStatus === "all" ? true : p.status === currentStatus
            ),
          filters
        )
      );
    }
    // eslint-disable-next-line
  }, [allProducts, filters, currentStatus]);

  const onDeleteItem = async (item: any) => {
    const id = item?.id;
    allProducts = allProducts?.filter((p: any) => p.id !== id);
    await dispatch(updateProduct({ id, status: "deleted" }, allProducts));
    setShowModal(false);
    replaceRoute("");
  };
  const onDeleteMode = (item: any) => {
    setShowAlert(true);
  };

  const onUpdateItem = async (product: any, variants: any = []) => {
    // console.log("product >>>", product.id,product?.variants, product);

    if (allProducts) {
      if (product) {
        const index = allProducts?.findIndex((f: any) => f.id === product.id);
        if (index >= 0) {
          allProducts[index] = product;
        }
      }
      if (variants && variants.length > 0) {
        allProducts
          .filter((f: any) => f.parent_id === product.id)
          .map((p: any) => {
            p.status = "deleted";
            return false;
          });
        variants.map((variant: any) => {
          // console.log("variant >>>>", variant);
          const { units_in_stock } = variant;
          const index = allProducts?.findIndex((f: any) => f.id === variant.id);
          if (index >= 0) {
            allProducts[index] = {
              ...allProducts[index],
              units_in_stock,
              status: "active",
            };
          } else {
            allProducts = [...allProducts, variant];
          }
          return false;
        });
      }
    }

    console.log("onUpdateItem variants >>>>", product.id, variants);
    console.log(
      " allProducts >>>>",
      allProducts?.filter((f: any) => f.id === product.id),
      allProducts?.filter((f: any) => f.parent_id === product.id)
    );

    await dispatch(updateProduct(product, allProducts));
  };

  // const onFilter = (stat: string) => {
  //   // console.log("filters, status >>>", filters, stat);
  //   const status = stat?.split(" ");
  //   setFilters({ ...filters, status });
  // };

  useEffect(() => {
    if (currentId) {
      // alert(currentId);
      if (currentId === "new") {
        setCurrentProduct({});
      } else {
        if (filteredProducts && filteredProducts?.length > 0) {
          const prod = filteredProducts?.find(
            (p: any) => p.id === parseInt(currentId)
          );
          if (prod) {
            // console.log("prod =====>>>>>", prod);
            setCurrentProduct(prod);
          }
        }
      }
      setShowModal(true);
    }
  }, [currentId, filteredProducts]);

  const onAddMode = () => {
    setCurrentProduct({});
    setShowModal(true);
    replaceRoute("new");
  };
  const onEditMode = (p: any, e: any) => {
    if (!(e?.target?.tagName === "ION-ICON" && e?.target?.name === "delete")) {
      setCurrentProduct(p);
      setShowModal(true);
      replaceRoute(p.id);
    }
  };

  const replaceRoute = (id: any) => {
    const route = `/products/${id}`;
    window.history.replaceState(null, "WorkOne eCommerce", route);
  };

  const getStock = (product: any) => {
    // console.log(" allProducts >>>>", allProducts);

    // console.log(
    //   " allProducts >>>>",
    //   allProducts?.filter((f: any) => f.id === product.id),
    //   allProducts?.filter((f: any) => f.parent_id === product.id)
    // );
    // console.log(" allProducts >>>>", allProducts);

    let totalStocks = product?.units_in_stock ? product?.units_in_stock : 0;
    let variants = [];
    if (allProducts && allProducts.length > 0) {
      variants = allProducts?.filter(
        (f: any) => f.parent_id === product.id && f.status !== "deleted"
      );
      if (variants && variants.length > 0) {
        totalStocks = variants?.reduce((total: number, item: any) => {
          return (
            total + (item?.status === "deleted" ? 0 : item?.units_in_stock)
          );
        }, 0);
      }
    }
    return `${totalStocks} in stock ${
      variants && variants.length > 0
        ? `for ${variants.length} ${
            variants.length === 1 ? "variant" : "variants"
          }`
        : ""
    }`;
  };
  return (
    <IonPage>
      <IonHeader>
        <Toolbar />
      </IonHeader>
      <IonContent className="page-content">
        <IonItem hidden={showModal} className="at-title-bar" lines="none">
          <IonTitle>Products</IonTitle>
          <IonButton onClick={onAddMode} className="size-14 at-button">
            &nbsp; Add product &nbsp;
          </IonButton>
        </IonItem>

        <IonCard hidden={showModal} className="page-content-box at-box-shadow">
          <IonSegment
            className="size-10"
            onIonChange={(e) => setCurrentStatus(e.detail.value!)}
            value={currentStatus}
            style={{ maxWidth: "360px" }}
          >
            <IonSegmentButton value="all">
              <IonLabel className="size-12">All</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="active">
              <IonLabel className="size-12">Active</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="draft">
              <IonLabel className="size-12">Draft</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="archived">
              <IonLabel className="size-12">Archived</IonLabel>
            </IonSegmentButton>
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
                    <th>Status</th>
                    <th>Inventory</th>
                    <th>Type</th>
                    {/* <th>Seller</th> */}
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts?.map((product: any, index: number) => {
                    return (
                      <tr
                        key={index}
                        onClick={(e: any) => onEditMode(product, e)}
                      >
                        <td style={{ width: "30px" }}>
                          <IonImg
                            src={product?.image_url_main}
                            style={{ width: "40px", height: "40px" }}
                          ></IonImg>
                        </td>
                        <td>
                          {product?.product_name}
                          {product?.product_name_ar?.trim() && (
                            <span className="color-aaa"> | </span>
                          )}
                          {product?.product_name_ar}
                        </td>
                        <td>
                          <span className="badge badge-light-warning">
                            {product?.status}
                          </span>
                        </td>
                        <td>{getStock(product)}</td>
                        <td>{product?.category_name}</td>
                        {/* <td>{product?.seller?.store_name}</td> */}
                      </tr>
                    );
                  })}
                </tbody>
                {/* <tfoot>
                  <tr>
                    <th></th>
                    <th>Product</th>
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
                products
              </div>
            )}
          </div>
        </IonCard>

        {showModal && currentProduct && (
          <ProductDetails
            onClose={() => {
              setShowModal(false);
              replaceRoute("");
            }}
            product={currentProduct}
            onUpdateItem={onUpdateItem}
            onDeleteMode={onDeleteMode}
          />
        )}
        {currentProduct && (
          <AtModalAlert
            isOpen={showAlert}
            onClose={(isOk: boolean) => {
              setShowAlert(false);
              isOk && onDeleteItem(currentProduct);
            }}
            data={{
              label: "product",
              title: `Delete ${currentProduct?.product_name}?`,
              description: `Are you sure you want to delete the product <b>${currentProduct?.product_name}</b>? This can’t be undone.`,
            }}
          />
        )}
      </IonContent>
      <>
        {/* {allProducts &&
          allProducts.length > 0 &&
          console.log(
            " allProducts >>>>",
            allProducts?.filter((f: any) => f.id === 10), 
            allProducts?.filter((f: any) => f.parent_id === 10), 
          )} */}
        {/* {console.log(" filteredProducts >>>>", filteredProducts?.variants)} */}
        {/* {console.log(
          " process.env.REACT_APP_NOT_SECRET_CODE >>>>",
          process.env.REACT_APP_NOT_SECRET_CODE
        )} */}
      </>
    </IonPage>
  );
};

export default Products;
