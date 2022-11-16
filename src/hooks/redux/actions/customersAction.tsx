import { FETCH_CUSTOMER, FETCH_CUSTOMERS, UPDATE_CUSTOMER } from "./types";
import axiosInstance from "../../../lib/axios";

export const fetchCustomers =
  (params: any = {}) =>
  async (dispatch: any) => {
    try {
      /******
      sample params: all fields are optional 
     {
        "_id": 1,
        "user_id": 1,
        "_userName": "",
        "_keywords": "",
        "status": "active"
    }
       */

      const { data } = await axiosInstance.post("customers/fetch-all", params);
      // console.log("data >>>>", data);
      dispatch({
        type: FETCH_CUSTOMERS,
        payload: data,
      });
    } catch (e) {
      dispatch({
        type: FETCH_CUSTOMERS,
        payload: {
          status: 500,
          msg: "Something went wrong while fetching customer details.",
          items: [],
        },
      });
    }
  };

export const fetchCustomer = (id: number) => async (dispatch: any) => {
  try {
    /******
      sample params: all fields are optional 
      {
          "_id": 1,
          "user_id": 1,
          "_userName": "",
          "_keywords": "",
          "status": "active"
      }
       */
    const { data } = await axiosInstance.post("customers/fetch", { id });
    dispatch({
      type: FETCH_CUSTOMER,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: FETCH_CUSTOMER,
      payload: {
        status: 500,
        msg: "Something went wrong while fetching customer details.",
        items: [],
      },
    });
  }
};

export const updateCustomer =
  (data: any, payload: any = data) =>
  async (dispatch: any) => {
    try {
      // console.log("JSON.stringify(data) ===========>>>", JSON.stringify(data));
      const result = await axiosInstance.post("customers/update", data);
      if (!data.id) {
        payload = [{ ...data, id: result.data.id }, ...payload];
      }
      dispatch({
        type: UPDATE_CUSTOMER,
        payload,
      });
    } catch (e) {
      dispatch({
        type: UPDATE_CUSTOMER,
        payload: {
          status: 500,
          msg: "Something went wrong while updating customer details.",
          items: [],
        },
      });
    }
  };
