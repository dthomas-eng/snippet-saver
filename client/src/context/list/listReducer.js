import {
  NEW_SNIPPET,
  SET_CURRENT,
  UPDATE_SNIPPET,
  DELETE_SNIPPET,
  FILTER_SNIPPETS,
  LOAD_SNIPPETS,
  LIKED_ONLY_TOGGLE,
  FILTER_LIKED_ONLY,
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
      if (state.likedOnly) {
        return {
          ...state,
          filteredList: state.likedOnlyList.filter((snippet) => {
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
      } else {
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
      }
    case LIKED_ONLY_TOGGLE:
      if (state.likedOnly) {
        return {
          ...state,
          likedOnly: false,
        };
      } else {
        return {
          ...state,
          likedOnly: true,
        };
      }
    case FILTER_LIKED_ONLY:
      return {
        ...state,
        likedOnlyList: state.snippets.filter((snippet) => {
          if (action.payload.includes(snippet._id)) {
            return snippet;
          } else {
            return null;
          }
        }),
        loadingList: false,
      };
    default:
      return state;
  }
};
