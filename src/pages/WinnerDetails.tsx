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
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { arrowBackOutline, closeCircle } from "ionicons/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "../hooks/redux/store";
import { fetchDealEntries } from "../hooks/redux/actions/deal_entriesAction";
// import { filterPlainArray } from "../utilities/helpers";
import Select from "react-select";
import { updateWinner } from "../hooks/redux/actions/winnersAction";
import AtModalAlert from "../components/AtModalAlert";

const WinnerDetails: React.FC<any> = ({
  onClose,
  winner,
  onUpdateItem,
  onDeleteMode,
}) => {
  const dispatch = useDispatch();
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
  const [filters, setFilters] = useState<any>({ product_name: [] });
  // let allProducts = useSelector((state: RootStore) => state.allProducts);
  let allDealEntries = useSelector((state: RootStore) => state.allDealEntries);
  const [filteredEntries, setFilteredEntries] = useState<any>({
    product_name: [],
  });
  const [selectedWinner, setSelectedWinner] = useState<any>([]);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [currentWinner, setCurrentWinner] = useState<any>({});

  const onDismiss = async () => {
    onClose();
  };

  // const updateWinners = () => {
  //   const newOptions = winner?.winners
  //     ?.filter((f: any) => f.status !== "deleted")
  //     ?.map((dp: any) => {
  //       const {
  //         winner_id,
  //         product_id,
  //         quantity_max,
  //         sold = 0,
  //         quantity_sold,
  //         product,
  //       } = dp;
  //       return {
  //         winner_id,
  //         value: product_id,
  //         //--- label: product.product_name_ar,
  //         label: product.product_name,
  //         product,
  //         product_id,
  //         quantity_max,
  //         sold: sold ? sold : quantity_sold,
  //       };
  //     });
  //   setSelectedWinner(newOptions);
  // };

  useEffect(() => {
    // if (!winner?.status) {
    //   winner.status = "draft";
    // }
    if (winner && winner?.id) {
      const { id, entry_code } = winner;
      const customer_name =
        winner?.customer?.first_name + " " + winner?.customer?.last_name;
      // const product_name = winner?.product?.product_name;
      // const deal_name = winner?.deal?.name;

      winner = {
        ...winner,
        value: id,
        label: entry_code + " - " + customer_name,
        // +" | " +deal_name +" | " +product_name,
      };
      setSelectedWinner(winner);
    }

    // eslint-disable-next-line
  }, [winner]);

  useEffect(() => {
    setFilters({ product_name: [] });
    dispatch(fetchDealEntries());
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (allDealEntries && allDealEntries?.length > 0) {
      // setFilteredEntries(filterPlainArray(allDealEntries, filters));
      const entries = allDealEntries.map((entry: any) => {
        const { id, deal_id, entry_code } = entry;
        const customer_name =
          entry?.customer?.first_name + " " + entry?.customer?.last_name;
        // const product_name = entry?.product?.product_name;
        // const deal_name = entry?.deal?.name;

        return {
          value: id,
          label: entry_code + " - " + customer_name,
          // +" | " +deal_name +" | " +product_name,
          id,
          deal_id,
          entry_code,
          customer: entry?.customer,
          product: entry?.product,
          deal: entry?.deal,
        };
      });
      setFilteredEntries(entries);
    }
    // eslint-disable-next-line
  }, [allDealEntries, filters]);

  const onChange = (e: any) => {
    winner[e.target.name] = e.detail.value!;

    setButtonDisabled(false);
  };

  const handleChange = (data: any) => {
    // console.log("data >>>", data);
    setSelectedWinner(data);

    // const newOptions = winner?.winners
    // allDealEntries
    // winner.winners = data;
    // updateWinners();
    setButtonDisabled(false); //-- disabled to avoid saving quantity=0
  };
  const onSaveData = () => {
    // console.log("selectedWinner >>>>", selectedWinner);
    console.log(" new Date() >>>>", new Date());

    const newSelectedWinner = {
      ...selectedWinner,
      id: winner?.id,
      entry_code: selectedWinner?.entry_code,
      customer_id: selectedWinner?.customer?.id,
      deal_id: selectedWinner?.deal?.id,
      product_id: selectedWinner?.product?.id,
      deal_date_end: new Date().toISOString(),
    };

    onUpdateItem(newSelectedWinner);
    onDismiss();
  };

  const onDeleteMode_Winner = (index: number) => {
    // console.log("selectedWinner[index] >>>>>>", selectedWinner[index])
    setCurrentWinner(selectedWinner[index]);
    setShowAlert(true);
  };
  const onDeleteWinner = () => {
    // // console.log("currentWinner >>>>>>", currentWinner);
    // winner.winners = winner.winners.filter(
    //   (f: any) => f.product_id !== currentWinner?.product_id
    // );
    // updateWinners();
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
                  {selectedWinner?.entry_code
                    ? selectedWinner?.entry_code
                    : "Add winner"}
                  &nbsp;&nbsp;
                  {/* <IonBadge color={statusColor(winner?.status)}>
                    winner
                  </IonBadge> */}
                </IonTitle>
              </IonCol>
            </IonRow>
          </IonGrid>

          <div className="at-grid-2-1">
            <div className="at-grid-col-1">
              <div
                className="page-content-box at-box-shadow margin-10"
                hidden={winner?.id}
              >
                <IonTitle className="size-16 at-bold color-444 pad-10-tb pad-0-left">
                  Entries
                </IonTitle>
                {filteredEntries && filteredEntries?.length > 0 && (
                  <Select
                    value={selectedWinner}
                    options={filteredEntries}
                    onChange={handleChange}
                    placeholder="Search entries"
                    className="at-select-search"
                  />
                )}
              </div>
              <div
                className="page-content-box at-box-shadow margin-10"
                hidden={!selectedWinner?.entry_code}
              >
                <IonTitle className="size-16 at-bold color-444 pad-10-tb pad-0-left">
                  Details
                </IonTitle>
                <div className="pad-10-tb at-bold size-12 color-444">
                  CONTACT INFORMATION
                </div>
                <div className="pad-10-top">
                  {selectedWinner?.customer?.first_name}{" "}
                  {selectedWinner?.customer?.last_name}
                </div>
                <div className="pad-5-top">
                  {" "}
                  {selectedWinner?.customer?.email}
                </div>
                <div className="pad-5-top">
                  {" "}
                  {selectedWinner?.customer?.phone_no}
                </div>
                <hr />
                <div className="pad-10-tb at-bold size-12 color-444">PRIZE</div>
                <div className="pad-10-top">
                  {selectedWinner?.deal?.name}{" "}
                  {selectedWinner?.deal?.name_ar
                    ? ` | ${selectedWinner?.deal?.name_ar}`
                    : ""}
                </div>
                <hr />
                <div className="pad-10-tb at-bold size-12 color-444">
                  PRODUCT
                </div>
                <div className="pad-10-top">
                  {selectedWinner?.product?.product_name}
                  {selectedWinner?.product?.product_name_ar
                    ? ` | ${selectedWinner?.product?.product_name_ar}`
                    : ""}
                </div>
              </div>
            </div>
            <div className="at-grid-col-2">
              <IonCard className="page-content-box at-box-shadow">
                <IonTitle className="size-16 at-bold color-444 pad-10-top pad-0-left">
                  Winner status
                </IonTitle>
                <IonItem lines="none" className="at-data-entry">
                  <IonLabel position="stacked" className="size-20"></IonLabel>
                  <IonSelect
                    name="status"
                    className="at-box size-14"
                    interface="popover"
                    placeholder="Select status"
                    value={winner?.status}
                    onIonChange={(e) => onChange(e)}
                  >
                    <IonSelectOption value="active">Active</IonSelectOption>
                    {/* <IonSelectOption value="draft">Draft</IonSelectOption> */}
                    <IonSelectOption value="archived">Archived</IonSelectOption>
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
                  onDeleteMode(winner);
                }}
                fill="outline"
                color="danger"
              >
                <span>Delete winner</span>
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
      </IonPage>

      {selectedWinner && (
        <AtModalAlert
          isOpen={showAlert}
          onClose={(isOk: boolean) => {
            setShowAlert(false);
            // isOk && onDeleteWinner(currentWinner);
            isOk && onDeleteWinner();
          }}
          data={{
            label: "winner",
            title: `Delete winner '${selectedWinner?.label}'?`,
            description: "This can’t be undone.",
          }}
        />
      )}

      {/* 
      {console.log("filteredEntries >>>>", filteredEntries)}
      {console.log("allDealEntries >>>>", allDealEntries)}
      {console.log("winner >>>>", winner)}
    */}
      {/* {console.log("selectedWinner >>>>", selectedWinner)} */}
    </>
  );
};

export default WinnerDetails;
