import {
  FETCH_ORDER_RETURN,
  FETCH_ORDER_RETURNS,
  UPDATE_ORDER_RETURN,
  UPDATE_ORDER_RETURN_LIST,
  CREATE_ORDER_RETURN,
  DELETE_ORDER_RETURN
} from "./types";
import axiosInstance from "../../../lib/axios";

export const fetchOrderReturns =
  (params: any = {}) =>
  async (dispatch: any) => {
    try {
      /******
      sample params: all fields are optional 
      {
          "user_id":1,
          "order_id":1,
          "order_item_id":1,
          "product_id":1,
          "quantity":10,
          "package_status": "pickup",
          "reason": "unknown",
          "_status": "active",
          "status": "refunded",
          "__status": "archived",
          "___status": "refund_requested"
      }
       */

      const { data } = await axiosInstance.post(
        "order_returns/fetch-all",
        params
      );
      // console.log("data >>>>", data);
      dispatch({
        type: FETCH_ORDER_RETURNS,
        payload: data,
      });
    } catch (e) {
      dispatch({
        type: FETCH_ORDER_RETURNS,
        payload: {
          status: 500,
          msg: "Something went wrong while fetching order return details.",
          items: [],
        },
      });
    }
  };

export const fetchOrderReturn = (id: number) => async (dispatch: any) => {
  try {
    /******
      sample params: all fields are optional 
      {
        "user_id":1,
        "order_id":1,
        "order_item_id":1,
        "product_id":1,
        "quantity":10,
        "package_status": "pickup",
        "reason": "unknown",
        "_status": "active",
        "status": "refunded",
        "__status": "archived",
        "___status": "refund_requested"
    }
       */
    const { data } = await axiosInstance.post("order_returns/fetch", { id });
    dispatch({
      type: FETCH_ORDER_RETURN,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: FETCH_ORDER_RETURN,
      payload: {
        status: 500,
        msg: "Something went wrong while fetching order_return details.",
        items: [],
      },
    });
  }
};

export const updateOrderReturn =
  (data: any, payload: any = data) =>
  async (dispatch: any) => {
    try {
      // console.log("JSON.stringify(data) ===========>>>", JSON.stringify(data));
      const result = await axiosInstance.post("order_returns/update", data);
      if (!data.id) {
        payload = [{ ...data, id: result.data.id }, ...payload];
      }
      dispatch({
        type: UPDATE_ORDER_RETURN,
        payload,
      });
    } catch (e) {
      dispatch({
        type: UPDATE_ORDER_RETURN,
        payload: {
          status: 500,
          msg: "Something went wrong while updating order_return details.",
          items: [],
        },
      });
    }
  };

export const updateOrderReturnList =
  (data: any, payload: any = data) =>
  async (dispatch: any) => {
    try {
      // console.log("JSON.stringify(data) ===========>>>", JSON.stringify(data));
      const result = await axiosInstance.post(
        "order_returns/update-list",
        data
      );
      if (!data.id) {
        payload = [{ ...data, id: result.data.id }, ...payload];
      }
      dispatch({
        type: UPDATE_ORDER_RETURN_LIST,
        payload,
      });
    } catch (e) {
      dispatch({
        type: UPDATE_ORDER_RETURN_LIST,
        payload: {
          status: 500,
          msg: "Something went wrong while updating order_return details.",
          items: [],
        },
      });
    }
  };

export const createOrderReturn =
  (data: any, payload: any = data) =>
  async (dispatch: any) => {
    try {
      // console.log("JSON.stringify(data) ===========>>>", JSON.stringify(data));
      const result = await axiosInstance.post("order_returns/create", data);
      if (!data.id) {
        payload = [{ ...data, id: result.data.id }, ...payload];
      }
      dispatch({
        type: CREATE_ORDER_RETURN,
        payload,
      });
    } catch (e) {
      dispatch({
        type: CREATE_ORDER_RETURN,
        payload: {
          status: 500,
          msg: "Something went wrong while updating order_return details.",
          items: [],
        },
      });
    }
  };
export const deleteOrderReturn =
  (data: any, payload: any = data) =>
  async (dispatch: any) => {
    try {
      // console.log("JSON.stringify(data) ===========>>>", JSON.stringify(data));
      const result = await axiosInstance.post("order_returns/delete", data);
      if (!data.id) {
        payload = [{ ...data, id: result.data.id }, ...payload];
      }
      dispatch({
        type: DELETE_ORDER_RETURN,
        payload,
      });
    } catch (e) {
      dispatch({
        type: DELETE_ORDER_RETURN,
        payload: {
          status: 500,
          msg: "Something went wrong while updating order_return details.",
          items: [],
        },
      });
    }
  };
