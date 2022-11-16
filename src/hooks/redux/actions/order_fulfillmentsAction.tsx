import {
  FETCH_ORDER_FULFILLMENT,
  FETCH_ORDER_FULFILLMENTS,
  CREATE_ORDER_FULFILLMENT,
  DELETE_ORDER_FULFILLMENT,
  UPDATE_ORDER_FULFILLMENT,
} from "./types";
import axiosInstance from "../../../lib/axios";

export const fetchOrderFulfillments =
  (params: any = {}) =>
  async (dispatch: any) => {
    try {
      /******
      sample params: all fields are optional 
      {
          "_id": 1,
          "_user_id": 1,
          "_order_id": 1,
          "_product_id": 1,
          "status": "active"
      }
       */

      const { data } = await axiosInstance.post(
        "order_fulfillments/fetch-all",
        params
      );
      // console.log("data >>>>", data);
      dispatch({
        type: FETCH_ORDER_FULFILLMENTS,
        payload: data,
      });
    } catch (e) {
      dispatch({
        type: FETCH_ORDER_FULFILLMENTS,
        payload: {
          status: 500,
          msg: "Something went wrong while fetching order return details.",
          items: [],
        },
      });
    }
  };

export const fetchOrderFulfillment = (id: number) => async (dispatch: any) => {
  try {
    /******
      sample params: all fields are optional 
      {
          "_id": 1,
          "_user_id": 1,
          "_order_id": 1,
          "_product_id": 1,
          "status": "active"
      }
    */
    const { data } = await axiosInstance.post("order_fulfillments/fetch", {
      id,
    });
    dispatch({
      type: FETCH_ORDER_FULFILLMENT,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: FETCH_ORDER_FULFILLMENT,
      payload: {
        status: 500,
        msg: "Something went wrong while fetching order_fulfillment details.",
        items: [],
      },
    });
  }
};

export const createOrderFulfillment =
  (data: any, payload: any = data) =>
  async (dispatch: any) => {
    try {
      /*****
      {
          "order_id": 1 ,
          "order_no":"1001",
          "items": [
              {
                  "quantity": "11",
                  "user_id": 1,
                  "order_id": 1,
                  "product_id": 2 
              },
              {
                  "quantity": "2",
                  "user_id": 1,
                  "order_id": 1,
                  "product_id": 1 
              },
              {
                  "quantity": "1",
                  "user_id": 1,
                  "order_id": 1,
                  "product_id": 3 
              }
          ]
      }  
       
       */
      // console.log("JSON.stringify(data) ===========>>>", JSON.stringify(data));
      const result = await axiosInstance.post(
        "order_fulfillments/create",
        data
      );
      console.log("result >>>>>", result);
      dispatch({
        type: CREATE_ORDER_FULFILLMENT,
        payload: result.data,
      });
      return "test";
    } catch (e) {
      dispatch({
        type: CREATE_ORDER_FULFILLMENT,
        payload: {
          status: 500,
          msg: "Something went wrong while updating order fulfillment details.",
          items: [],
        },
      });
    }
  };

export const updateOrderFulfillment =
  (data: any, payload: any = data) =>
  async (dispatch: any) => {
    try {
      const result = await axiosInstance.post(
        "order_fulfillments/update",
        data
      );
      if (!data.id) {
        payload = [{ ...data, id: result.data.id }, ...payload];
      }
      dispatch({
        type: UPDATE_ORDER_FULFILLMENT,
        payload,
      });
    } catch (e) {
      dispatch({
        type: UPDATE_ORDER_FULFILLMENT,
        payload: {
          status: 500,
          msg: "Something went wrong while deleting order fulfillment details.",
          items: [],
        },
      });
    }
  };

export const deleteOrderFulfillment =
  (data: any, payload: any = data) =>
  async (dispatch: any) => {
    try {
      // console.log("JSON.stringify(data) ===========>>>", JSON.stringify(data));
      const result = await axiosInstance.post(
        "order_fulfillments/delete",
        data
      );
      if (!data.id) {
        payload = [{ ...data, id: result.data.id }, ...payload];
      }
      dispatch({
        type: DELETE_ORDER_FULFILLMENT,
        payload,
      });
    } catch (e) {
      dispatch({
        type: DELETE_ORDER_FULFILLMENT,
        payload: {
          status: 500,
          msg: "Something went wrong while deleting order fulfillment details.",
          items: [],
        },
      });
    }
  };
