import {
  FETCH_ORDER_FULFILLMENT,
  FETCH_ORDER_FULFILLMENTS,
  CREATE_ORDER_FULFILLMENT,
} from "../actions/types";

const OrderFulfillmentsReducer = (state: any = {}, action: any) => {
  switch (action.type) {
    case FETCH_ORDER_FULFILLMENT:
      // console.log("FETCH_ORDER_FULFILLMENT action.payload >>>>",action.payload);
      return action.payload;
    case FETCH_ORDER_FULFILLMENTS:
      // console.log("FETCH_ORDER_FULFILLMENTS action.payload >>>>",action.payload);
      if (action.payload?.order_fulfillments) {
        return action.payload?.order_fulfillments!;
      } else {
        return {};
      }
    case CREATE_ORDER_FULFILLMENT:
      // console.log("CREATE_ORDER_FULFILLMENT action.payload >>>>", action.payload);
      return action.payload;
    default:
      return state;
  }
};
export default OrderFulfillmentsReducer;
