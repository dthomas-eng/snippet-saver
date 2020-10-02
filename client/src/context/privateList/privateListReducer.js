import {
  NEW_SNIPPET,
  SET_CURRENT,
  UPDATE_SNIPPET,
  DELETE_SNIPPET,
  FILTER_SNIPPETS,
  LOAD_SNIPPETS,
} from "../../types";

export default (state, action) => {
  switch (action.type) {
    case NEW_SNIPPET:
      return {
        ...state,
        snippets: [...state.snippets, action.payload],
        current: action.payload,
      };
    case LOAD_SNIPPETS:
      return {
        ...state,
        snippets: action.payload,
        loadingList: false,
      };
    case SET_CURRENT:
      return {
        ...state,
        current: action.payload,
      };
    case UPDATE_SNIPPET:
      return {
        ...state,
        current: action.payload,
        snippets: state.snippets.map((snippet) => {
          if (snippet._id === action.payload._id) {
            return action.payload;
          } else {
            return snippet;
          }
        }),
      };
    case DELETE_SNIPPET:
      return {
        ...state,
        snippets: state.snippets.filter((snippet) => {
          if (snippet._id !== action.payload) {
            return snippet;
          } else {
            return null;
          }
        }),
        filteredList: state.filteredList.filter((snippet) => {
          if (snippet._id !== action.payload) {
            return snippet;
          } else {
            return null;
          }
        }),
      };
    case FILTER_SNIPPETS:
      return {
        ...state,
        filteredList: state.snippets.filter((snippet) => {
          let re = new RegExp(`${action.payload.trim()}`, "gi");
          if (
            re.test(snippet.title) ||
            re.test(snippet.notes) ||
            re.test(snippet.code.value) ||
            re.test(snippet.authorName) ||
            re.test(snippet.language)
          ) {
            return snippet;
          } else {
            return null;
          }
        }),
        searchValue: action.payload,
        loadingList: false,
      };
    default:
      return state;
  }
};
