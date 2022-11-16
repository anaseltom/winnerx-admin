import { FETCH_DEAL_PRODUCT, FETCH_DEAL_PRODUCTS, UPDATE_DEAL_PRODUCT } from "./types";
import axiosInstance from "../../../lib/axios";

export const fetchDealProducts =
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

      const { data } = await axiosInstance.post("deal_products/fetch-all", params);
      // console.log("data >>>>", data);
      dispatch({
        type: FETCH_DEAL_PRODUCTS,
        payload: data,
      });
    } catch (e) {
      dispatch({
        type: FETCH_DEAL_PRODUCTS,
        payload: {
          status: 500,
          msg: "Something went wrong while fetching deal product details.",
          items: [],
        },
      });
    }
  };

export const fetchDealProduct = (id: number) => async (dispatch: any) => {
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
    const { data } = await axiosInstance.post("deal_products/fetch", { id });
    dispatch({
      type: FETCH_DEAL_PRODUCT,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: FETCH_DEAL_PRODUCT,
      payload: {
        status: 500,
        msg: "Something went wrong while fetching deal_product details.",
        items: [],
      },
    });
  }
};


/**** updateDealProduct optional parameters:
 {
    "_id": 0,
    "_user_id": 1,
     "deal_id": 1,
    "status": "active",
    "items": [
        {
            "deal_id": 1,
            "product_id": 1,
            "quantity_max": "5",
            "quantity_sold": 0
        },
        {
            "deal_id": 1,
            "product_id": "3",
            "quantity_max": "8",
            "quantity_sold": 0
        }
    ]
}
 */
export const updateDealProduct =
  (data: any, payload: any = data) =>
  async (dispatch: any) => {
    try {
      // console.log("JSON.stringify(data) ===========>>>", JSON.stringify(data));
      const result = await axiosInstance.post("deal_products/update", data);
      if (!data.id) {
        payload = [{ ...data, id: result.data.id }, ...payload];
      }
      dispatch({
        type: UPDATE_DEAL_PRODUCT,
        payload,
      });
    } catch (e) {
      dispatch({
        type: UPDATE_DEAL_PRODUCT,
        payload: {
          status: 500,
          msg: "Something went wrong while updating deal_product details.",
          items: [],
        },
      });
    }
  };
