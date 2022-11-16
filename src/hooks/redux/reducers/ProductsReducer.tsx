import {
  FETCH_PRODUCT,
  FETCH_PRODUCTS,
  UPDATE_PRODUCT, 
} from "../actions/types";

const ProductsReducer = (state: any = {}, action: any) => {
  switch (action.type) {
    case FETCH_PRODUCT:
      // console.log("FETCH_PRODUCT action.payload >>>>", action.payload);
      return action.payload;
    case FETCH_PRODUCTS:
      // console.log("FETCH_PRODUCTS action.payload >>>>", action.payload);
      if (action.payload?.products) {
        return action.payload?.products!;
      } else {
        return {};
      }
    case UPDATE_PRODUCT:
      // console.log("UPDATE_PRODUCT action.payload >>>>", action.payload);
      return action.payload;

    default:
      return state;
  }
};
export default ProductsReducer;
