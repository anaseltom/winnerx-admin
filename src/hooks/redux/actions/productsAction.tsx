import {
  FETCH_PRODUCT,
  FETCH_PRODUCTS, 
  UPDATE_PRODUCT, 
} from "./types";
import axiosInstance from "../../../lib/axios";

export const fetchProducts =
  (params: any = {}) =>
  async (dispatch: any) => {
    try {
      /******
       * by default this will fetch all records with parent_id: null,
      sample params: all fields are optional 
     {
        "_id": 1,
        "_sellerName": "",
        "_categoryCode": "",
        "_product_name": "",
        "_brandName": "",
        "_description": "",
        "_color": "",
        "_gender": "",
        "_size": "",
        "_keywords": "",
        "_parent_id": 329,
        "status": "active"
    }
       */

      // console.log("params >>>", params);

      const { data } = await axiosInstance.post("products/fetch-all", params);
      // console.log("data >>>>", data);
      dispatch({
        type: FETCH_PRODUCTS,
        payload: data,
      });
    } catch (e) {
      dispatch({
        type: FETCH_PRODUCTS,
        payload: {
          status: 500,
          msg: "Something went wrong while fetching product details.",
          items: [],
        },
      });
    }
  };
 
export const fetchProduct = (id: number) => async (dispatch: any) => {
  try {
    /******
     * by default this will fetch record with parent_id: null,
      sample params: all fields are optional 
      {
          "id": 1,
          "task_id": 1,
          "user_id": 1,
          "provider_id": 1,
          "product_type": "user"
      }
       */
    const { data } = await axiosInstance.post("products/fetch", { id });
    dispatch({
      type: FETCH_PRODUCT,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: FETCH_PRODUCT,
      payload: {
        status: 500,
        msg: "Something went wrong while fetching product details.",
        items: [],
      },
    });
  }
};

export const updateProduct =
  (data: any, payload: any = data) =>
  async (dispatch: any) => {
    try {
      // console.log("JSON.stringify(data) ===========>>>", JSON.stringify(data));
      const result = await axiosInstance.post("products/update", data);
      if (!data.id) {
        payload = [{ ...data, id: result.data.id }, ...payload];
      }
      dispatch({
        type: UPDATE_PRODUCT,
        payload,
      });
    } catch (e) {
      dispatch({
        type: UPDATE_PRODUCT,
        payload: {
          status: 500,
          msg: "Something went wrong while updating product details.",
          items: [],
        },
      });
    }
  };
 