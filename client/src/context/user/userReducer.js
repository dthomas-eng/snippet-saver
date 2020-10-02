import { LOG_IN, LOG_OUT, ADD_LIKE, REMOVE_LIKE } from "../../types";

export default (state, action) => {
  switch (action.type) {
    case LOG_IN:
      return {
        ...state,
        loggedIn: true,
        email: action.payload.email,
        name: action.payload.name,
        userId: action.payload._id,
        userLikes: action.payload.likes,
      };
    case LOG_OUT:
      return {
        ...state,
        loggedIn: false,
        email: "",
        name: "",
        userId: "",
        userLikes: "",
      };
    case ADD_LIKE:
      return {
        ...state,
        userLikes: [...state.userLikes, action.payload],
      };
    case REMOVE_LIKE:
      return {
        ...state,
        userLikes: state.userLikes.filter((snippetId) => {
          if (snippetId !== action.payload) {
            return snippetId;
          } else {
            return null;
          }
        }),
      };
    default:
      return state;
  }
};
