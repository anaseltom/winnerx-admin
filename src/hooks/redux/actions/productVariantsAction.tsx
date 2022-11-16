import {
 
  FETCH_PRODUCT_VARIANTS,
 
} from "./types";
import axiosInstance from "../../../lib/axios";
 
export const fetchProductVariants =
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
        type: FETCH_PRODUCT_VARIANTS,
        payload: data,
      });
    } catch (e) {
      dispatch({
        type: FETCH_PRODUCT_VARIANTS,
        payload: {
          status: 500,
          msg: "Something went wrong while fetching product details.",
          items: [],
        },
      });
    }
  };
 