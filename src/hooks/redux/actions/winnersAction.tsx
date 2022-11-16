import { FETCH_WINNER, FETCH_WINNERS, UPDATE_WINNER } from "./types";
import axiosInstance from "../../../lib/axios";

export const fetchWinners =
  (params: any = {}) =>
  async (dispatch: any) => {
    try {
      /******
      sample params: all fields are optional 
      {
          "_id": 1,
          "_entry_code": "",
          "_customer_id": "",
          "_product_id": 1,
          "_deal_id": 1,
          "_status": "active"
      }
       */
   
      const { data } = await axiosInstance.post(
        "winners/fetch-all",
        params
      );

      // console.log("data >>>>", data);
      dispatch({
        type: FETCH_WINNERS,
        payload: data,
      });
    } catch (e) {
      dispatch({
        type: FETCH_WINNERS,
        payload: {
          status: 500,
          msg: "Something went wrong while fetching winner details.",
          items: [],
        },
      });
    }
  };

export const fetchWinner = (id: number) => async (dispatch: any) => {
  try {
    /******
      sample params: all fields are optional 
      {
          "_id": 1,
          "_entry_code": "",
          "_customer_id": "",
          "_product_id": 1,
          "_deal_id": 1,
          "_status": "active"
      }
       */
    const { data } = await axiosInstance.post("winners/fetch", { id });
    dispatch({
      type: FETCH_WINNER,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: FETCH_WINNER,
      payload: {
        status: 500,
        msg: "Something went wrong while fetching winner details.",
        items: [],
      },
    });
  }
};

export const updateWinner =
  (data: any, payload: any = data) =>
  async (dispatch: any) => {
    try {
      // console.log("JSON.stringify(data) ===========>>>", JSON.stringify(data));
      const result = await axiosInstance.post("winners/update", data);
      if (!data.id) {
        payload = [{ ...data, id: result.data.id }, ...payload];
      }
      dispatch({
        type: UPDATE_WINNER,
        payload,
      });
    } catch (e) {
      dispatch({
        type: UPDATE_WINNER,
        payload: {
          status: 500,
          msg: "Something went wrong while updating winner details.",
          items: [],
        },
      });
    }
  };
