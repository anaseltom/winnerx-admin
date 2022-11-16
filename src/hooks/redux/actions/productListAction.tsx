import { UPDATE_PRODUCT_LIST } from "./types";
import axiosInstance from "../../../lib/axios";

export const updateProductList =
  (data: any, payload: any = data) =>
  async (dispatch: any) => {
    try {
      // console.log("JSON.stringify(data) ===========>>>", JSON.stringify(data));
      await axiosInstance.post("products/update-list", data);
      // console.log("updateProductList result ===========>>>", result);
      // console.log("updateProductList payload ===========>>>", payload);
      // if (!data?.id) {
      //   payload = [{ ...data, id: result.data.id }, ...payload];
      // }
      dispatch({
        type: UPDATE_PRODUCT_LIST,
        payload,
      });
    } catch (e) {
      dispatch({
        type: UPDATE_PRODUCT_LIST,
        payload: {
          status: 500,
          msg: "Something went wrong while updating product details. >>>",
          items: [],
        },
      });
    }
  };
