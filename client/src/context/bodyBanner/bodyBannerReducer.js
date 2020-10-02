import { SHOW_BANNER, HIDE_BANNER } from "../../types";

export default (state, action) => {
  switch (action.type) {
    case SHOW_BANNER:
      return {
        ...state,
        shown: true,
        msg: action.payload,
      };
    case HIDE_BANNER:
      return {
        ...state,
        shown: false,
        msg: "",
      };
    default:
      return state;
  }
};
