import {
  FETCH_DEAL_ENTRY,
  FETCH_DEAL_ENTRIES,
  UPDATE_DEAL_ENTRY,
} from "../actions/types";

const DealEntriesReducer = (state: any = {}, action: any) => {
  switch (action.type) {
    case FETCH_DEAL_ENTRY:
      // console.log("FETCH_DEAL_ENTRY action.payload >>>>", action.payload);
      return action.payload;
    case FETCH_DEAL_ENTRIES:
      // console.log("FETCH_DEAL_ENTRIES action.payload >>>>", action.payload);
      if (action.payload?.deal_entries) {
        return action.payload?.deal_entries!;
      } else {
        return {};
      }
    case UPDATE_DEAL_ENTRY:
      // console.log("UPDATE_DEAL_ENTRY action.payload >>>>", action.payload);
      return action.payload;
    default:
      return state;
  }
};
export default DealEntriesReducer;
