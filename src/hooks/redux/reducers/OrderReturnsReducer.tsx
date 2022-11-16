import {
  FETCH_ORDER_RETURN,
  FETCH_ORDER_RETURNS,
  UPDATE_ORDER_RETURN,
  CREATE_ORDER_RETURN,
  DELETE_ORDER_RETURN,
} from "../actions/types";

const OrderReturnsReducer = (state: any = {}, action: any) => {
  switch (action.type) {
    case FETCH_ORDER_RETURN:
      // console.log("FETCH_ORDER_RETURN action.payload >>>>", action.payload);
      return action.payload;
    case FETCH_ORDER_RETURNS:
      // console.log("FETCH_ORDER_RETURNS action.payload >>>>", action.payload);
      if (action.payload?.order_returns) {
        return action.payload?.order_returns!;
      } else {
        return {};
      }
    case UPDATE_ORDER_RETURN:
      // console.log("UPDATE_ORDER_RETURN action.payload >>>>", action.payload);
      return action.payload;
    case CREATE_ORDER_RETURN:
      // console.log("CREATE_ORDER_RETURN action.payload >>>>", action.payload);
      return action.payload;
    case DELETE_ORDER_RETURN:
      // console.log("DELETE_ORDER_RETURN action.payload >>>>", action.payload);
      return action.payload;
    default:
      return state;
  }
};
export default OrderReturnsReducer;
