import { SHOW_BODY_LOADER, HIDE_BODY_LOADER } from "../../types";

export default (state, action) => {
  switch (action.type) {
    case SHOW_BODY_LOADER:
      return {
        ...state,
        showIt: true,
      };
    case HIDE_BODY_LOADER:
      return {
        ...state,
        showIt: false,
      };
    default:
      return state;
  }
};
