import {
 
  FETCH_PRODUCT_VARIANTS,
 
} from "../actions/types";

const ProductsReducer = (state: any = {}, action: any) => {
  switch (action.type) {
    // case FETCH_PRODUCT:
    //   // console.log("FETCH_PRODUCT action.payload >>>>", action.payload);
    //   return action.payload;
    // case FETCH_PRODUCTS:
    //   // console.log("FETCH_PRODUCTS action.payload >>>>", action.payload);
    //   if (action.payload?.products) {
    //     return action.payload?.products!;
    //   } else {
    //     return {};
    //   }
    case FETCH_PRODUCT_VARIANTS:
      // console.log("FETCH_PRODUCTS action.payload >>>>", action.payload);
      if (action.payload?.products) {
        return action.payload?.products!;
      } else {
        return {};
      }
    // case UPDATE_PRODUCT:
    //   // console.log("UPDATE_PRODUCT action.payload >>>>", action.payload);
    //   return action.payload;
    // case UPDATE_PRODUCT_LIST:
    //   return action.payload;
    default:
      return state;
  }
};
export default ProductsReducer;
