import { FETCH_ORDER, FETCH_ORDERS, UPDATE_ORDER, ORDER_SUMMARY } from "../actions/types";

const OrdersReducer = (state: any = {}, action: any) => {
  switch (action.type) {
    case FETCH_ORDER:
      // console.log("FETCH_ORDER action.payload >>>>", action.payload);
      return action.payload;
    case FETCH_ORDERS:
      // console.log("FETCH_ORDERS action.payload >>>>", action.payload);
      if (action.payload?.orders) {
        return action.payload?.orders!;
      } else {
        return {};
      }
    case UPDATE_ORDER:
      // console.log("UPDATE_ORDER action.payload >>>>", action.payload);
      return action.payload;
    case ORDER_SUMMARY:
      // console.log("UPDATE_ORDER action.payload >>>>", action.payload);
      return action.payload;
    default:
      return state;
  }
};
export default OrdersReducer;
