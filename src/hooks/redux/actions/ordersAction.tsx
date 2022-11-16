import {
  FETCH_ORDER,
  FETCH_ORDERS,
  UPDATE_ORDER,
  ORDER_SUMMARY,
} from "./types";
import axiosInstance from "../../../lib/axios";

export const fetchOrders =
  (params: any = {}) =>
  async (dispatch: any) => {
    try {
      /******
      sample params: all fields are optional 
     {
        "id":1, 
        "_user_id":1, 
        "_status":"active"
    }
       */

      const { data } = await axiosInstance.post("orders/fetch-all", params);
      // console.log("data >>>>", data);
      dispatch({
        type: FETCH_ORDERS,
        payload: data,
      });
    } catch (e) {
      dispatch({
        type: FETCH_ORDERS,
        payload: {
          status: 500,
          msg: "Something went wrong while fetching order details.",
          items: [],
        },
      });
    }
  };

export const fetchOrder = (id: number) => async (dispatch: any) => {
  try {
    /******
      sample params: all fields are optional 
      {
          "id": 1,
          "task_id": 1,
          "user_id": 1,
          "provider_id": 1,
          "order_type": "user"
      }
       */
    const { data } = await axiosInstance.post("orders/fetch", { id });
    dispatch({
      type: FETCH_ORDER,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: FETCH_ORDER,
      payload: {
        status: 500,
        msg: "Something went wrong while fetching order details.",
        items: [],
      },
    });
  }
};

export const updateOrder =
  (data: any, payload: any = data) =>
  async (dispatch: any) => {
    try {
      // console.log("JSON.stringify(data) ===========>>>", JSON.stringify(data));
      const result = await axiosInstance.post("orders/update", data);
      if (!data.id) {
        payload = [{ ...data, id: result.data.id }, ...payload];
      }
      dispatch({
        type: UPDATE_ORDER,
        payload,
      });
    } catch (e) {
      dispatch({
        type: UPDATE_ORDER,
        payload: {
          status: 500,
          msg: "Something went wrong while updating order details.",
          items: [],
        },
      });
    }
  };

export const orderSummary =
  (params: any = {}) =>
  async (dispatch: any) => {
    try {
      /******
        no parameters required yet
       */

      const { data } = await axiosInstance.post("orders/summary", params);
      // console.log("data >>>>", data);
      dispatch({
        type: ORDER_SUMMARY,
        payload: data,
      });
    } catch (e) {
      dispatch({
        type: ORDER_SUMMARY,
        payload: {
          status: 500,
          msg: "Something went wrong while fetching order summary details.",
          items: [],
        },
      });
    }
  };
