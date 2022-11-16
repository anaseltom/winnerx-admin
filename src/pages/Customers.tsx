import React, { useEffect, useState } from "react";
import { RootStore } from "../hooks/redux/store";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchCustomers,
  updateCustomer,
} from "../hooks/redux/actions/customersAction";
import {
  IonButton,
  IonCard,
  IonContent,
  IonHeader,
  IonItem,
  IonPage,
  IonSearchbar,
  IonTitle,
} from "@ionic/react";
import { filterPlainArray } from "../utilities/helpers";
import Toolbar from "../components/Toolbar";
import { useParams } from "react-router";
import CustomerDetails from "./CustomerDetails";
import AtModalAlert from "../components/AtModalAlert";
import CurrencyFormat from "react-currency-format";

const Customers: React.FC<any> = () => {
  const dispatch = useDispatch();
  const params: any = useParams();
  const [currentId, setCurrentId] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const [currentStatus, setCurrentStatus] = useState<string>("all");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [currentCustomer, setCurrentCustomer] = useState<any>();
  const [filters, setFilters] = useState<any>({ customerName: [] });
  let allCustomers = useSelector((state: RootStore) => state.allCustomers);
  const [filteredCustomers, setFilteredCustomers] = useState<any>({
    customerName: [],
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
      const customerName = searchText?.split(" ");

      const filtered = allCustomers.filter(
        (cust: any) =>
          [...customerName].find((x: any) =>
            cust.last_name.toLowerCase().includes(x)
          ) ||
          [...customerName].find((x: any) =>
            cust.first_name.toLowerCase().includes(x)
          )
      );
      // console.log("filtered >>>>", [...customerName], filtered);
      setFilteredCustomers(filtered);

      // setFilters({
      //   ...filters,
      //   first_name: customerName,
      //   last_name: customerName,
      // });
    } else {
      setFilters({});
    }
    // eslint-disable-next-line
  }, [searchText]);

  useEffect(() => {
    setCurrentStatus("all");
    dispatch(fetchCustomers());
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (allCustomers && allCustomers?.length > 0) {
      // console.log("filters>>>", filters);

      setFilteredCustomers(
        filterPlainArray(
          allCustomers.filter((p: any) =>
            currentStatus === "all" ? true : p.status === currentStatus
          ),
          filters
        )
      );
    }
    // eslint-disable-next-line
  }, [allCustomers, filters, currentStatus]);

  const onDeleteItem = async (item: any) => {
    const id = item?.id;
    allCustomers = allCustomers?.filter((p: any) => p.id !== id);
    await dispatch(updateCustomer({ id, status: "deleted" }, allCustomers));
    setShowModal(false);
    replaceRoute("");
  };
  const onDeleteMode = (item: any) => {
    setShowAlert(true);
  };

  const onUpdateItem = (item: any) => {
    // console.log("item >>>", item.id, item);
    dispatch(updateCustomer(item, allCustomers));
  };

  const onFilter = (stat: string) => {
    // console.log("filters, status >>>", filters, stat);
    const status = stat?.split(" ");
    setFilters({ ...filters, status });
  };

  useEffect(() => {
    if (currentId) {
      // alert(currentId);
      if (currentId === "new") {
        setCurrentCustomer({});
      } else {
        if (filteredCustomers && filteredCustomers?.length > 0) {
          const cust = filteredCustomers?.find(
            (p: any) => p.id === parseInt(currentId)
          );
          if (cust) {
            console.log("cust =====>>>>>", cust);
            setCurrentCustomer(cust);
          }
        }
      }
      setShowModal(true);
    }
  }, [currentId, filteredCustomers]);

  const onAddMode = () => {
    setCurrentCustomer({});
    setShowModal(true);
    replaceRoute("new");
  };
  const onEditMode = (p: any, e: any) => {
    if (!(e?.target?.tagName === "ION-ICON" && e?.target?.name === "delete")) {
      setCurrentCustomer(p);
      setShowModal(true);
      replaceRoute(p.id);
    }
  };

  const replaceRoute = (id: any) => {
    const route = `/customers/${id}`;
    window.history.replaceState(null, "WorkOne eCommerce", route);
  };
  return (
    <IonPage>
      <IonHeader>
        <Toolbar />
      </IonHeader>
      <IonContent className="page-content">
        <IonItem hidden={showModal} className="at-title-bar" lines="none">
          <IonTitle>Customer segment</IonTitle>
          <IonButton onClick={onAddMode} className="size-14 at-button">
            &nbsp; Add customer &nbsp;
          </IonButton>
        </IonItem>

        <IonCard hidden={showModal} className="page-content-box at-box-shadow">
          <IonSearchbar
            value={searchText}
            placeholder="Filter customers"
            // className="size-12"
            onIonChange={(e) => setSearchText(e.detail.value!)}
          ></IonSearchbar>

          <div className="table-responsive">
            {filteredCustomers && filteredCustomers?.length > 0 ? (
              <table id="zero_config" className="at-table">
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    {/* <th>Notes</th> */}
                    <th>Status</th>
                    <th>Location</th>
                    <th style={{ width: "60px" }}>Orders</th>
                    <th style={{ width: "100px" }}>Spent</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCustomers?.map((customer: any, index: number) => {
                    return (
                      <tr
                        key={index}
                        onClick={(e: any) => onEditMode(customer, e)}
                      >
                        <td>
                          {customer?.first_name} {customer?.last_name}
                        </td>
                        {/* <td>{customer?.notes}</td> */}
                        <td>{customer?.status}</td>
                        <td>
                          {customer?.city}, {customer?.country}
                        </td>
                        <td> {customer?.total_orders} orders</td>
                        <td>
                          {/* {" "}
                          AED {currencyFormat(customer?.total_spent, "")} */}
                          <span className="size-12 color-aaa">AED</span>{" "}
                          <CurrencyFormat
                            value={customer?.total_spent}
                            displayType={"text"}
                            thousandSeparator={true}
                            prefix={""}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="at-center pad-20">
                No {currentStatus === "all" ? "available" : currentStatus}{" "}
                customers
              </div>
            )}
          </div>
        </IonCard>

        {showModal && currentCustomer && (
          <CustomerDetails
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
              replaceRoute("");
            }}
            customer={currentCustomer}
            // setCustomer={setCurrentCustomer}
            onUpdateItem={onUpdateItem}
            onDeleteMode={onDeleteMode}
          />
        )}
        {currentCustomer && (
          <AtModalAlert
            isOpen={showAlert}
            onClose={(isOk: boolean) => {
              setShowAlert(false);
              isOk && onDeleteItem(currentCustomer);
            }}
            data={{
              label: "customer",
              title: `Delete ${currentCustomer?.first_name} ${currentCustomer?.last_name}?`,
              description: `Are you sure you want to delete the customer <b>${currentCustomer?.first_name} ${currentCustomer?.last_name}</b>? This can’t be undone.`,
            }}
          />
        )}
        {/* {console.log("filteredCustomers >>>", filteredCustomers)} */}
      </IonContent>
    </IonPage>
  );
};

export default Customers;
