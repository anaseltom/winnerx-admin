import { FETCH_CATEGORIES } from "./types";
// import axios from "axios";
import axiosInstance from "../../../lib/axios";

export const fetchCategories = () => async (dispatch: any) => {
  try {
    const { data } = await axiosInstance.post("categories/fetch-all", {});

    dispatch({
      type: FETCH_CATEGORIES,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: FETCH_CATEGORIES,
      payload: {
        status: 500,
        msg: "Something went wrong while fetching categories.",
        items: [],
      },
    });
  }
};
 