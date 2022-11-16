import React, { useEffect, useState } from "react";
import { RootStore } from "../hooks/redux/store";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchWinners,
  updateWinner,
} from "../hooks/redux/actions/winnersAction";
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
import { filterPlainArray, formatDate } from "../utilities/helpers";
import Toolbar from "../components/Toolbar";
import { useParams } from "react-router"; 
import AtModalAlert from "../components/AtModalAlert"; 
import WinnerDetails from "./WinnerDetails";

const Winners: React.FC<any> = () => {
  const dispatch = useDispatch();
  const params: any = useParams();
  const [currentId, setCurrentId] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const [currentStatus, setCurrentStatus] = useState<string>("all");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [currentWinner, setCurrentWinner] = useState<any>();
  const [filters, setFilters] = useState<any>({ winnerName: [] }); 
  let allWinners = useSelector((state: RootStore) => state.allWinners);
  const [filteredWinners, setFilteredWinners] = useState<any>({
    winnerName: [],
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
      const winnerName = searchText?.split(" ");

      const filtered = allWinners.filter(
        (cust: any) =>
          [...winnerName].find((x: any) =>
            cust?.customer?.last_name.toLowerCase().includes(x)
          ) ||
          [...winnerName].find((x: any) =>
            cust?.customer?.first_name.toLowerCase().includes(x)
          )  ||
          [...winnerName].find((x: any) =>
            cust?.entry_code.toLowerCase().includes(x)
          )
      );
      // console.log("filtered >>>>", [...winnerName], filtered);
      setFilteredWinners(filtered);

      // setFilters({
      //   ...filters,
      //   first_name: winnerName,
      //   last_name: winnerName,
      // });
    } else {
      setFilters({});
    }
    // eslint-disable-next-line
  }, [searchText]);

  useEffect(() => {
    setCurrentStatus("all");
    dispatch(fetchWinners());
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (allWinners && allWinners?.length > 0) {
      // console.log("filters>>>", filters);

      setFilteredWinners(
        filterPlainArray(
          allWinners.filter((p: any) =>
            currentStatus === "all" ? true : p.status === currentStatus
          ),
          filters
        )
      );
    }
    // eslint-disable-next-line
  }, [allWinners, filters, currentStatus]);

  const onDeleteItem = async (item: any) => {
    const id = item?.id;
    allWinners = allWinners?.filter((p: any) => p.id !== id);
    await dispatch(updateWinner({ id, status: "deleted" }, allWinners));
    setShowModal(false);
    replaceRoute("");
  };
  const onDeleteMode = (item: any) => {
    setShowAlert(true);
  };

  const onUpdateItem = (item: any) => {
    // console.log("item >>>", item.id, item);
    dispatch(updateWinner(item, allWinners));
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
        setCurrentWinner({});
      } else {
        if (filteredWinners && filteredWinners?.length > 0) {
          const cust = filteredWinners?.find(
            (p: any) => p.id === parseInt(currentId)
          );
          if (cust) {
            // console.log("cust =====>>>>>", cust);
            setCurrentWinner(cust);
          }
        }
      }
      setShowModal(true);
    }
  }, [currentId, filteredWinners]);

  const onAddMode = () => {
    setCurrentWinner({});
    setShowModal(true);
    replaceRoute("new");
  };
  const onEditMode = (p: any, e: any) => {
    if (!(e?.target?.tagName === "ION-ICON" && e?.target?.name === "delete")) {
      setCurrentWinner(p);
      setShowModal(true);
      replaceRoute(p.id);
    }
  };

  const replaceRoute = (id: any) => {
    const route = `/winners/${id}`;
    window.history.replaceState(null, "WorkOne eCommerce", route);
  };
  return (
    <IonPage>
      <IonHeader>
        <Toolbar />
      </IonHeader>
      <IonContent className="page-content">
        <IonItem hidden={showModal} className="at-title-bar" lines="none">
          <IonTitle>Winners segment</IonTitle>
          <IonButton onClick={onAddMode} className="size-14 at-button">
            &nbsp; Add winner &nbsp;
          </IonButton>
        </IonItem>

        <IonCard hidden={showModal} className="page-content-box at-box-shadow">
          <IonSearchbar
            value={searchText}
            placeholder="Filter winners"
            // className="size-12"
            onIonChange={(e) => setSearchText(e.detail.value!)}
          ></IonSearchbar>

          <div className="table-responsive">
            {filteredWinners && filteredWinners?.length > 0 ? (
              <table id="zero_config" className="at-table">
                <thead>
                  <tr>
                    <th>Entry Code</th>
                    <th>Winner Name</th>
                    <th>Product</th>
                    <th>Prize</th>
                    <th style={{ width: "60px" }}>Deal End Date</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredWinners?.map((winner: any, index: number) => {
                    return (
                      <tr
                        key={index}
                        onClick={(e: any) => onEditMode(winner, e)}
                      >
                        <td>{winner?.entry_code}</td>
                        <td>
                          {winner?.customer?.first_name}{" "}
                          {winner?.customer?.last_name}
                        </td>
                        <td>{winner?.product?.product_name}</td>
                        <td> {winner?.deal?.name} </td> 
                        <td>{formatDate(winner?.deal_date_end)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="at-center pad-20">
                No {currentStatus === "all" ? "available" : currentStatus}{" "}
                winners
              </div>
            )}
          </div>
        </IonCard>

        {showModal && currentWinner && (
          <WinnerDetails
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
              replaceRoute("");
            }}
            winner={currentWinner}
            // setWinner={setCurrentWinner}
            onUpdateItem={onUpdateItem}
            onDeleteMode={onDeleteMode}
          />
        )}
        {currentWinner && (
          <AtModalAlert
            isOpen={showAlert}
            onClose={(isOk: boolean) => {
              setShowAlert(false);
              isOk && onDeleteItem(currentWinner);
            }}
            data={{
              label: "winner",
              title: `Delete ${currentWinner?.customer?.first_name} ${currentWinner?.customer?.last_name}?`,
              description: `Are you sure you want to delete the winner <b>${currentWinner?.customer?.first_name} ${currentWinner?.customer?.last_name}</b>? This can’t be undone.`,
            }}
          />
        )}
        {/* {console.log("currentWinner >>>", currentWinner)} */}
        
        {/* {console.log("allWinners >>>", allWinners)}
        {console.log("filteredWinners >>>", filteredWinners)} */}
      </IonContent>
    </IonPage>
  );
};

export default Winners;
