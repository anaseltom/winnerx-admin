import { FETCH_DEAL, FETCH_DEALS, UPDATE_DEAL } from "./types";
import axiosInstance from "../../../lib/axios";

export const fetchDeals =
  (params: any = {}) =>
  async (dispatch: any) => {
    try {
      /******
      sample params: all fields are optional 
    {
      "_id":1, 
      "name":"civic", 
      "_product_id":1, 
      "_status":"active"
    }
       */

      const { data } = await axiosInstance.post("deals/fetch-all", params);
      // console.log("data >>>>", data);
      dispatch({
        type: FETCH_DEALS,
        payload: data,
      });
    } catch (e) {
      dispatch({
        type: FETCH_DEALS,
        payload: {
          status: 500,
          msg: "Something went wrong while fetching deal details.",
          items: [],
        },
      });
    }
  };

export const fetchDeal = (id: number) => async (dispatch: any) => {
  try {
    /******
      sample params: all fields are optional 
    {
      "_id":1, 
      "name":"civic", 
      "_product_id":1, 
      "_status":"active"
    }
       */
    const { data } = await axiosInstance.post("deals/fetch", { id });
    dispatch({
      type: FETCH_DEAL,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: FETCH_DEAL,
      payload: {
        status: 500,
        msg: "Something went wrong while fetching deal details.",
        items: [],
      },
    });
  }
};

export const updateDeal =
  (data: any, payload: any = data) =>
  async (dispatch: any) => {
    try {
      // console.log("JSON.stringify(data) ===========>>>", JSON.stringify(data));
      const result = await axiosInstance.post("deals/update", data);
      if (!data.id) {
        payload = [{ ...data, id: result.data.id }, ...payload];
      }
      dispatch({
        type: UPDATE_DEAL,
        payload,
      });
    } catch (e) {
      dispatch({
        type: UPDATE_DEAL,
        payload: {
          status: 500,
          msg: "Something went wrong while updating deal details.",
          items: [],
        },
      });
    }
  };
