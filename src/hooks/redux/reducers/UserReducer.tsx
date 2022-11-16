import { USER_INFO } from "../actions/types";
import { USER_SIGNIN } from "../actions/types";
import { USER_SIGNUP } from "../actions/types";

const UserReducer = (state: any = {}, action: any) => {
  switch (action.type) {
    case USER_SIGNIN:
      // use the below return code if you have multiple items
      // return { ...state, items: action.payload };
      console.log("actionpayload", action.payload)
      return action.payload;
    case USER_INFO:
      return action.payload;
    default:
      return state;
  }
};
export default UserReducer;
