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
  IonLabel,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { arrowBackOutline } from "ionicons/icons";
// import FileUploader from "../utilities/FileUploader";
import { useDispatch } from "react-redux";
import { fetchCategories } from "../hooks/redux/actions/categoriesAction";
import AtItemInput from "../components/AtItemInput";
import {
  CountryDropdown,
  RegionDropdown,
  CountryRegionData,
} from "react-country-region-selector";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { calculateDate } from "../utilities/helpers";
const CustomerDetails: React.FC<any> = ({
  isOpen,
  onClose,
  customer,
  onUpdateItem,
  onDeleteMode,
}) => {
  const dispatch = useDispatch();
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
  const [countryCode, setCountryCode] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [region, setRegion] = useState<string>("");
  const [phoneNo, setPhoneNo] = useState<string>("");
  const [phoneNo1, setPhoneNo1] = useState<string>("");

  const onDismiss = () => {
    onClose(1);
  };
  useEffect(() => {
    if (!customer?.status) {
      customer.status = "draft";
    }
    dispatch(fetchCategories());
    if (customer?.country) {
      setCountry(customer?.country);
    }
    if (customer?.city) {
      setRegion(customer?.city);
    }
    if (customer?.phone_no) {
      setPhoneNo(customer?.phone_no);
    }
    if (customer?.phone_no1) {
      setPhoneNo1(customer?.phone_no1);
    }
    // eslint-disable-next-line
  }, [customer]);

  const onChange = (e: any) => {
    customer[e.target.name] = e.detail.value!;
    setButtonDisabled(false);
  };

  const selectCountry = (val: string) => {
    const c: any = CountryRegionData.find((x: any) => x.includes(val));
    console.log("CountryRegionData  >>>>>", c[1]);
    setCountryCode(c[1]);
    customer["country"] = val;
    setCountry(val);
    setButtonDisabled(false);
  };

  const selectRegion = (val: string) => {
    customer["city"] = val;
    setRegion(val);
    setButtonDisabled(false);
  };
  const onChangePhoneNo = (val: string, name: string) => {
    customer[name] = val;
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
                  {customer?.first_name
                    ? customer?.first_name + " " + customer?.last_name
                    : "New customer"}
                  {customer?.created_at && (
                    <>
                      <br />
                      <div className="size-13 pad-5-top color-aaa">
                        {customer?.city ? customer?.city + ", " : ""}
                        {customer?.country}
                        &nbsp;•&nbsp;Customer for{" "}
                        {calculateDate(
                          new Date(),
                          new Date(customer?.created_at)
                        )}
                      </div>
                    </>
                  )}
                </IonTitle>
              </IonCol>
            </IonRow>
          </IonGrid>

          <div className="at-border-top at-grid-1-2">
            <IonTitle className="size-16 at-bold color-444 pad-10-top align-start">
              Customer overview
            </IonTitle>

            <IonCard className="page-content-box at-box-shadow">
              <div className="at-grid-columns">
                <div>
                  <AtItemInput
                    label="First name"
                    name="first_name"
                    value={customer?.first_name}
                    onChange={onChange}
                    placeholder=""
                  />
                </div>
                <div>
                  <AtItemInput
                    label="Last name"
                    name="last_name"
                    value={customer?.last_name}
                    onChange={onChange}
                    placeholder=""
                  />
                </div>
              </div>

              <AtItemInput
                label="Email"
                name="email"
                value={customer?.email}
                onChange={onChange}
                placeholder=""
              />

              {/* <IonItem className="at-data-entry">
                <IonLabel position="stacked" className="size-20">
                  Phone
                </IonLabel>
                <PhoneInput
                  placeholder="Enter phone number"
                  value={phoneNo}
                  onChange={onChangePhoneNo}
                />
              </IonItem> */}
              <div className="at-data-entry">
                <div className="size-14 pad-5-tb color-444">Phone number</div>
                <PhoneInput
                  country={countryCode}
                  //// enableSearch={true}
                  // value={this.state.phone}
                  // onChange={phone => this.setState({ phone })}
                  value={phoneNo}
                  // value={customer.?phone_no}
                  onChange={(val: any) => onChangePhoneNo(val, "phone_no")}
                />
              </div>

              {/* <AtItemInput
                label="Phone number"
                name="phone_no"
                value={customer?.phone_no}
                onChange={onChange}
                placeholder=""
              /> */}
            </IonCard>
          </div>

          <div className="at-border-top at-grid-1-2">
            <IonTitle className="size-16 at-bold color-444 pad-10-top align-start">
              Address
              <div className="size-12 color-888 pad-10-tb">
                The primary address of this customer
              </div>
            </IonTitle>
            <IonCard className="page-content-box at-box-shadow">
              <IonItem className="at-data-entry">
                <IonLabel position="stacked" className="size-20">
                  Country/region
                </IonLabel>
                <CountryDropdown
                  value={country}
                  onChange={(val) => selectCountry(val)}
                />
              </IonItem>

              <AtItemInput
                label="Company"
                name="company"
                value={customer?.company}
                onChange={onChange}
                placeholder=""
              />
              <AtItemInput
                label="Address"
                name="address"
                value={customer?.address}
                onChange={onChange}
                placeholder=""
              />
              <AtItemInput
                label="Apartment, suite, etc."
                name="apartment"
                value={customer?.apartment}
                onChange={onChange}
                placeholder=""
              />
              <IonItem className="at-data-entry">
                <IonLabel position="stacked" className="size-20">
                  City
                </IonLabel>

                <RegionDropdown
                  country={customer?.country}
                  value={region}
                  defaultOptionLabel="Select city"
                  onChange={(val) => selectRegion(val)}
                />
              </IonItem>
              {/* 
              <AtItemInput
                label="Phone"
                name="phone_no1"
                value={customer?.phone_no1}
                onChange={onChange}
                placeholder=""
              /> */}
              <div className="at-data-entry">
                <div className="size-14 pad-5-tb color-444">Phone number</div>
                <PhoneInput
                  country={countryCode}
                  value={phoneNo1}
                  onChange={(val: any) => onChangePhoneNo(val, "phone_no1")}
                />
              </div>
            </IonCard>
          </div>

          <div className="at-border-top at-grid-1-2">
            <IonTitle className="size-16 at-bold color-444 pad-10-top align-start">
              Notes
              <div className="size-12 color-888 pad-10-tb">
                Add notes about your customer.
              </div>
            </IonTitle>
            <IonCard className="page-content-box at-box-shadow">
              <AtItemInput
                label="Note"
                name="note"
                value={customer?.note}
                onChange={onChange}
                placeholder=""
              />
            </IonCard>
          </div>
          {/* <div className="at-border-top at-grid-1-2">
            <IonTitle className="size-16 at-bold color-444 pad-10-top align-start">
              Tags
              <div className="size-12 color-888 pad-10-tb">
                Tags can be used to categorize customers into groups.
              </div>
            </IonTitle>
            <IonCard className="page-content-box at-box-shadow">
              <AtItemInput
                label="Tags"
                name="tags"
                value={customer?.tags}
                onChange={onChange}
                placeholder=""
              />
            </IonCard>
          </div> */}

          {/* <IonItem style={{ padding: "0" }} className="at-action-menu">
            <IonButton
              onClick={() => {
                onUpdateItem(customer);
                onDismiss();
              }}
              // style={{ padding: "10px" }}
              className="at-center"
              disabled={buttonDisabled}
              slot="end"
            >
              <div className="pad-20">Save</div>
            </IonButton>
          </IonItem> */}
          <div className="at-border-top">
            <IonItem style={{ padding: "0" }} className="at-action-menu">
              <IonButton
                className="at-button"
                onClick={() => {
                  onDeleteMode(customer);
                }}
                fill="outline"
                color="danger"
              >
                <span>Delete customer</span>
              </IonButton>
              <IonButton
                onClick={() => {
                  onUpdateItem(customer);
                  onDismiss();
                }}
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
   
  );
};

export default CustomerDetails;
