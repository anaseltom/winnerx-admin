import React, { useEffect, useState } from "react";
import { RootStore } from "../hooks/redux/store";
import { useDispatch, useSelector } from "react-redux";

import { fetchDeals, updateDeal } from "../hooks/redux/actions/dealsAction";
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
import DealDetails from "./DealDetails";
import { filterPlainArray, formatDate } from "../utilities/helpers";
import Toolbar from "../components/Toolbar";
import { useParams } from "react-router";
import AtModalAlert from "../components/AtModalAlert";

const Deals: React.FC<any> = () => {
  const dispatch = useDispatch();
  const params: any = useParams();
  const [currentId, setCurrentId] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const [currentStatus, setCurrentStatus] = useState<string>("all");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [currentDeal, setCurrentDeal] = useState<any>();
  const [filters, setFilters] = useState<any>({ name: [] });
  let allDeals = useSelector((state: RootStore) => state.allDeals);
  const [filteredDeals, setFilteredDeals] = useState<any>({
    name: [],
  });

  useEffect(() => {
    // console.log("params>>>>", params);
    // alert("params >>>" + JSON.stringify(params));
    if (params) {
      setCurrentId(params?.id);
    }
  }, [params]);

  useEffect(() => {
    if (searchText) {
      const name = searchText?.split(" ");
      //   console.log("name >>>>", name);
      setFilters({ ...filters, name });
    } else {
      setFilters({});
    }
    // eslint-disable-next-line
  }, [searchText]);

  useEffect(() => {
    dispatch(fetchDeals());
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (allDeals && allDeals?.length > 0) {
      setFilteredDeals(
        filterPlainArray(
          allDeals.filter((p: any) =>
            currentStatus === "all" ? true : p.status === currentStatus
          ),
          filters
        )
      );
    }
    // eslint-disable-next-line
  }, [allDeals, filters, currentStatus]);

  const onDeleteItem = async (item: any) => {
    const id = item?.id;
    allDeals = allDeals?.filter((p: any) => p.id !== id);
    await dispatch(updateDeal({ id, status: "deleted" }, allDeals));
    setShowModal(false);
    replaceRoute("");
  };
  const onDeleteMode = (item: any) => {
    setShowAlert(true);
  };

  const onUpdateItem = (item: any) => {
    console.log("item >>>", item.id, item);
    dispatch(updateDeal(item, allDeals));
  };

  // const onFilter = (stat: string) => {
  //   console.log("filters, status >>>", filters, stat);
  //   const status = stat?.split(" ");
  //   setFilters({ ...filters, status });
  // };

  useEffect(() => {
    if (currentId) {
      // alert(currentId);
      if (currentId === "new") {
        setCurrentDeal({});
      } else {
        if (filteredDeals && filteredDeals?.length > 0) {
          const prod = filteredDeals?.find(
            (p: any) => p.id === parseInt(currentId)
          );
          if (prod) {
            // console.log("prod =====>>>>>", prod);
            setCurrentDeal(prod);
          }
        }
      }
      setShowModal(true);
    }
  }, [currentId, filteredDeals]);

  const onAddMode = () => {
    setCurrentDeal({});
    setShowModal(true);
    replaceRoute("new");
  };
  const onEditMode = (p: any, e: any) => {
    if (!(e?.target?.tagName === "ION-ICON" && e?.target?.name === "delete")) {
      setCurrentDeal(p);
      setShowModal(true);
      replaceRoute(p.id);
    }
  };

  const replaceRoute = (id: any) => {
    const route = `/deals/${id}`;
    window.history.replaceState(null, "WorkOne eCommerce", route);
    // alert(id)
    // if(!id){
    //   setShowModal(false);
    // }
  }; 
  const getProductDetails = (deal: any) => {
    // console.log("deal >>>", deal);

    const deal_products = deal?.deal_products.filter(
      (f: any) => f.status !== "deleted"
    );
    const productCount = deal_products?.length;
    if (deal_products && productCount > 0) {
      return (
        <>
          {" "}
          {deal_products[0]?.product?.product_name}
          {deal_products[0]?.product?.product_name_ar
            ? ` | ${deal_products[0]?.product?.product_name_ar}`
            : ""}
          <span className="color-888">
            {" "}
            {productCount - 1 > 0 ? ` and ${productCount - 1} more` : ""}{" "}
          </span>
        </>
      );
    }
    // {deal?.deal_products?.product_name
    //     ? deal?.product?.product_name
    return <span className="color-888">No products associated yet</span>;
  };
  const getSum = (deal: any, fieldName: string) => {
    // console.log("deal>>>>>>>>>>>>>>>>", deal);
    return deal?.deal_products?.reduce((total: number, item: any) => {
      // console.log(">>>>>>>>>>>>>>>>",item?.deleted, item[fieldName])
      return total + (item?.status === "deleted" ? 0 : item[fieldName]);
    }, 0);
  };
  return (
    <IonPage>
      <IonHeader>
        <Toolbar />
      </IonHeader>
      <IonContent className="page-content">
        <IonItem hidden={showModal} className="at-title-bar" lines="none">
          <IonTitle>Deals</IonTitle>
          <IonButton onClick={onAddMode} className="size-14 at-button">
            &nbsp; Add deal &nbsp;
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
            {/* <IonSegmentButton value="scheduled">
              <IonLabel className="size-12">Scheduled</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="expired">
              <IonLabel className="size-12">Expired</IonLabels>
            </IonSegmentButton> */}
            <IonSegmentButton value="draft">
              <IonLabel className="size-12">Draft</IonLabel>
            </IonSegmentButton>
            {/* <IonSegmentButton value="soldout">
              <IonLabel className="size-12">Sold Out</IonLabel>
            </IonSegmentButton> */}
          </IonSegment>
          <IonSearchbar
            value={searchText}
            placeholder="Filter deals"
            // className="size-12"
            onIonChange={(e) => setSearchText(e.detail.value!)}
          ></IonSearchbar>

          <div className="table-responsive">
            {filteredDeals && filteredDeals?.length > 0 ? (
              <table id="zero_config" className="at-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Id</th>
                    <th>Deal</th>
                    <th>Available entries</th>
                    <th>Start date</th>
                    <th>End date</th>
                    <th>Quantity sold</th>
                    {/* <th>Products</th> */}

                    {/****** 
                    <th>Price</th>
                    <th>Sold</th>
                    <th>Max. Qty</th> */}
                  </tr>
                </thead>

                <tbody>
                  {filteredDeals?.map((deal: any, index: number) => {
                    return (
                      <tr key={index} onClick={(e: any) => onEditMode(deal, e)}>
                        <td style={{ width: "30px" }}>
                          <IonImg
                            // src={`https://picsum.photos/40/40?random=${index}`}
                            src={
                              deal?.image_url_main
                                ? deal?.image_url_main
                                : "/assets/img/placeholder.jpg"
                            }
                            // style={{ width: "40px", height: "40px" }}
                          ></IonImg>
                        </td>
                        <td style={{ width: "10px" }}>{deal?.id}</td>
                        <td>
                          {deal?.name}
                          {deal?.name_ar && (
                            <span className="color-aaa"> | </span>
                          )}
                          {deal?.name_ar}
                        </td>
                        <td className="at-center">
                          {getSum(deal, "quantity_max")}
                          {/* {deal?.deal_products?.reduce(
                            (total: number, item: any) => {
                              return total + item?.quantity_max;
                            },
                            0
                          )} */}
                        </td>
                        <td>
                          {deal?.date_start && formatDate(deal?.date_start)}
                        </td>
                        <td>{deal?.date_end && formatDate(deal?.date_end)}</td>
                        <td className="at-center">
                          {getSum(deal, "quantity_sold")}
                          {/* {deal?.deal_products?.reduce(
                            (total: number, item: any) => {
                              return total + item?.quantity_sold;
                            },
                            0
                          )} */}
                        </td>
                        {/* <td>
                          <div
                          // className="cursor-underline"
                          // onClick={(e: any) => {
                          //   e.stopPropagation();
                          //   window.location.href = `/products/${deal?.product?.id}`;
                          // }}
                          >
                            {getProductDetails(deal)}
                          </div>
                        </td> */}
                        {/*******
                         <td>
                          <div
                            className="cursor-underline"
                            onClick={(e: any) => {
                              e.stopPropagation();
                              window.location.href = `/products/${deal?.product?.id}`;
                            }}
                          >
                            {deal?.product?.product_name
                              ? deal?.product?.product_name
                              : deal?.product_name}
                            {deal?.product?.product_name_ar && (
                              <span className="color-aaa"> | </span>
                            )}

                            {deal?.product?.product_name_ar
                              ? deal?.product?.product_name_ar
                              : deal?.product_name_ar}
                          </div>
                        </td>
                        <td>
                          {deal?.product?.currencyCode}&nbsp;
                          {deal?.product?.unit_price
                            ? deal?.product?.unit_price
                            : 0}
                        </td>
                        <td className="at-center">
                          {deal?.quantity_sold ? deal?.quantity_sold : 0}
                        </td>
                        <td className="at-center">{deal?.quantity_max}</td> */}
                      </tr>
                    );
                  })}
                </tbody>
                {/* <tfoot>
                  <tr>
                    <th></th>
                    <th>Deal</th>
                    <th>Status</th>
                    <th>Inventory</th>
                    <th>Type</th>
                    <th>Seller</th>
                  </tr>
                </tfoot> */}
              </table>
            ) : (
              <div className="at-center pad-20">
                No {currentStatus === "all" ? "available" : currentStatus} deals
              </div>
            )}
          </div>
        </IonCard>
        <div>
          {showModal && currentDeal && (
            <DealDetails
              onClose={() => {
                setShowModal(false);
                replaceRoute("");
              }}
              deal={currentDeal}
              onUpdateItem={onUpdateItem}
              onDeleteMode={onDeleteMode}
            />
          )}
          {currentDeal && (
            <AtModalAlert
              isOpen={showAlert}
              onClose={(isOk: boolean) => {
                setShowAlert(false);
                isOk && onDeleteItem(currentDeal);
              }}
              data={{
                label: "deal",
                title: `Delete ${currentDeal?.name}?`,
                description: `Are you sure you want to delete the deal <b>${currentDeal?.name}</b>? This can’t be undone.`,
              }}
            />
          )}
        </div>
        {/*
        <>{console.log("filteredDeals >>>", filteredDeals)}</>
      */} 
      </IonContent>
    </IonPage>
  );
};

export default Deals;
