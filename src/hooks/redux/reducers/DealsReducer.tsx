import { FETCH_DEAL, FETCH_DEALS, UPDATE_DEAL } from "../actions/types";

const DealsReducer = (state: any = {}, action: any) => {
  switch (action.type) {
    case FETCH_DEAL:
      // console.log("FETCH_DEAL action.payload >>>>", action.payload);
      return action.payload;
    case FETCH_DEALS:
      // console.log("FETCH_DEALS action.payload >>>>", action.payload);
      if (action.payload?.deals) {
        return action.payload?.deals!;
      } else {
        return {};
      }
    case UPDATE_DEAL:
      // console.log("UPDATE_DEAL action.payload >>>>", action.payload);
      return action.payload;
    default:
      return state;
  }
};
export default DealsReducer;
