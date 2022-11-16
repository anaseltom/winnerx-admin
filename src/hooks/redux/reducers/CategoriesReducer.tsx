import { FETCH_CATEGORIES } from "../actions/types";

const CategoriesReducer = (state: any = {}, action: any) => {
  switch (action.type) {
    case FETCH_CATEGORIES:
      // return { ...state, items: action.payload };
      if (action.payload?.categories) {
        return action.payload?.categories!;
      } else {
        return {};
      }
    default:
      return state;
  }
};
export default CategoriesReducer;
