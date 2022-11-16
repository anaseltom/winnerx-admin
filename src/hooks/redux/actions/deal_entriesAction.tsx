import { FETCH_DEAL_ENTRY, FETCH_DEAL_ENTRIES, UPDATE_DEAL_ENTRY } from "./types";
import axiosInstance from "../../../lib/axios";

export const fetchDealEntries =
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

      const { data } = await axiosInstance.post("deal_entries/fetch-all", params);
      // console.log("data >>>>", data);
      dispatch({
        type: FETCH_DEAL_ENTRIES,
        payload: data,
      });
    } catch (e) {
      dispatch({
        type: FETCH_DEAL_ENTRIES,
        payload: {
          status: 500,
          msg: "Something went wrong while fetching winner details.",
          items: [],
        },
      });
    }
  };

export const fetchDealEntry = (id: number) => async (dispatch: any) => {
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
    const { data } = await axiosInstance.post("deal_entries/fetch", { id });
    dispatch({
      type: FETCH_DEAL_ENTRY,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: FETCH_DEAL_ENTRY,
      payload: {
        status: 500,
        msg: "Something went wrong while fetching winner details.",
        items: [],
      },
    });
  }
};

export const updateDealEntry =
  (data: any, payload: any = data) =>
  async (dispatch: any) => {
    try {
      // console.log("JSON.stringify(data) ===========>>>", JSON.stringify(data));
      const result = await axiosInstance.post("deal_entries/update", data);
      if (!data.id) {
        payload = [{ ...data, id: result.data.id }, ...payload];
      }
      dispatch({
        type: UPDATE_DEAL_ENTRY,
        payload,
      });
    } catch (e) {
      dispatch({
        type: UPDATE_DEAL_ENTRY,
        payload: {
          status: 500,
          msg: "Something went wrong while updating winner details.",
          items: [],
        },
      });
    }
  };
