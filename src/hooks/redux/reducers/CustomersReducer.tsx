import { FETCH_CUSTOMER, FETCH_CUSTOMERS, UPDATE_CUSTOMER } from "../actions/types";

const ReviewsReducer = (state: any = {}, action: any) => {
  switch (action.type) {
    case FETCH_CUSTOMER:
      // console.log("FETCH_CUSTOMER action.payload >>>>", action.payload);
      return action.payload;
    case FETCH_CUSTOMERS:
      // console.log("FETCH_CUSTOMERS action.payload >>>>", action.payload);
      if (action.payload?.customers) {
        return action.payload?.customers!;
      } else {
        return {};
      }
    case UPDATE_CUSTOMER:
      // console.log("UPDATE_CUSTOMER action.payload >>>>", action.payload);
      return action.payload;
    default:
      return state;
  }
};
export default ReviewsReducer;
