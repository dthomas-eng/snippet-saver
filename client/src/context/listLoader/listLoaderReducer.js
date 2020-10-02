import { SHOW_LIST_LOADER, HIDE_LIST_LOADER } from "../../types";

export default (state, action) => {
  switch (action.type) {
    case SHOW_LIST_LOADER:
      return {
        ...state,
        showIt: true,
      };
    case HIDE_LIST_LOADER:
      return {
        ...state,
        showIt: false,
      };
    default:
      return state;
  }
};
