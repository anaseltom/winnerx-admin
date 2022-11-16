import { FETCH_WINNER, FETCH_WINNERS, UPDATE_WINNER } from "../actions/types";

const WinnersReducer = (state: any = {}, action: any) => {
  switch (action.type) {
    case FETCH_WINNER:
      // console.log("FETCH_WINNER action.payload >>>>", action.payload);
      return action.payload;
    case FETCH_WINNERS:
      // console.log("FETCH_WINNERS action.payload >>>>", action.payload);
      // if (action.payload?.winners) {
      //   return action.payload?.winners!;
      if (action.payload?.winners) {
        return action.payload?.winners!;
      } else {
        return {};
      }
    case UPDATE_WINNER:
      // console.log("UPDATE_WINNER action.payload >>>>", action.payload);
      return action.payload;
    default:
      return state;
  }
};
export default WinnersReducer;
