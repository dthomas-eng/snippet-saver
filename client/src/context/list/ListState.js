import React, { useReducer, useEffect, useContext } from "react";
import listReducer from "./listReducer";
import ListContext from "./listContext";
import ListAlertContext from "../../context/listAlert/listAlertContext";
import ListLoaderContext from "../../context/listLoader/listLoaderContext";
import UserContext from "../../context/user/userContext";
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

const ListState = (props) => {
  const initialState = {
    snippets: [],
    current: {
      id: null,
      title: null,
      notes: null,
      code: null,
      language: null,
      authorId: null,
      authorName: null,
      dateUpdated: null,
      likes: null,
      private: false,
      deleteConfirm: false,
    },
    filteredList: [],
    likedOnlyList: [],
    searchValue: "",
    likedOnly: false,
    loadingList: true,
  };
  const [state, dispatch] = useReducer(listReducer, initialState);
  const { searchValue } = state;

  const listAlertContext = useContext(ListAlertContext);
  const {
    showAlert: showListAlert,
    hideAlert: hideListAlert,
  } = listAlertContext;

  const listLoaderContext = useContext(ListLoaderContext);
  const { hideListLoader } = listLoaderContext;

  const userContext = useContext(UserContext);
  const { userId, userLikes } = userContext;

  useEffect(() => {
    getSnippets();
    // eslint-disable-next-line
  }, [userId]);

  useEffect(() => {
    filterLikedOnly(userLikes);
    filterSnippets(searchValue);
    // eslint-disable-next-line
  }, [userLikes]);

  const getSnippets = () => {
    fetch("/snippets")
      .then((res) => res.json())
      .then((snippets) => {
        dispatch({ type: LOAD_SNIPPETS, payload: snippets.data });
        hideListLoader();
      })
      .catch((err) => {
        hideListLoader();
        showListAlert(
          "Unable to get snippets. Check your internet connection."
        );
        console.error(err.message);
        setTimeout(() => {
          hideListAlert();
        }, 3000);
      });
  };

  const createNewSnippet = (snippetData) => {
    dispatch({ type: NEW_SNIPPET, payload: snippetData });
    getSnippets();
  };

  const setCurrent = (data) => {
    dispatch({ type: SET_CURRENT, payload: data });
  };

  const updateSnippet = (data) => {
    dispatch({ type: UPDATE_SNIPPET, payload: data });
    getSnippets();
  };

  const deleteSnippet = (id) => {
    dispatch({ type: DELETE_SNIPPET, payload: id });
  };

  const filterSnippets = (data) => {
    dispatch({ type: FILTER_SNIPPETS, payload: data });
  };

  const filterLikedOnly = (data) => {
    dispatch({ type: FILTER_LIKED_ONLY, payload: data });
  };

  const likedOnlyToggle = () => {
    dispatch({ type: LIKED_ONLY_TOGGLE });
  };

  return (
    <ListContext.Provider
      value={{
        snippets: state.snippets,
        current: state.current,
        filteredList: state.filteredList,
        likedOnlyList: state.likedOnlyList,
        searchValue: state.searchValue,
        likedOnly: state.likedOnly,
        loadingList: state.loadingList,
        createNewSnippet,
        setCurrent,
        updateSnippet,
        deleteSnippet,
        filterSnippets,
        filterLikedOnly,
        likedOnlyToggle,
        getSnippets,
      }}
    >
      {props.children}
    </ListContext.Provider>
  );
};

export default ListState;
