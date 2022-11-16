import { UPDATE_PRODUCT_LIST } from "../actions/types";

const ProductsReducer = (state: any = {}, action: any) => {
  switch (action.type) {
    case UPDATE_PRODUCT_LIST:
      console.log("UPDATE_PRODUCT_LIST action.payload >>>>", action.payload);

      return action.payload;
    default:
      return state;
  }
};
export default ProductsReducer;
