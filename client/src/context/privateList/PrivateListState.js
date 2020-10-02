import React, { useReducer, useEffect, useContext } from "react";
import privateListReducer from "./privateListReducer";
import PrivateListContext from "./privateListContext";
import ListAlertContext from "../listAlert/listAlertContext";
import ListLoaderContext from "../listLoader/listLoaderContext";
import UserContext from "../user/userContext";
import validateUser from "../../utils/validateUser";
import {
  NEW_SNIPPET,
  SET_CURRENT,
  UPDATE_SNIPPET,
  DELETE_SNIPPET,
  FILTER_SNIPPETS,
  LOAD_SNIPPETS,
} from "../../types";

const PrivateListState = (props) => {
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
    searchValue: "",
    loadingList: true,
  };
  const [state, dispatch] = useReducer(privateListReducer, initialState);

  const listAlertContext = useContext(ListAlertContext);
  const {
    showAlert: showListAlert,
    hideAlert: hideListAlert,
  } = listAlertContext;

  const listLoaderContext = useContext(ListLoaderContext);
  const { hideListLoader } = listLoaderContext;

  const userContext = useContext(UserContext);
  const { logIn, userId } = userContext;

  useEffect(() => {
    getPrivateSnippets();
    // eslint-disable-next-line
  }, [userId]);

  const getPrivateSnippets = async () => {
    let userIdFromDatabase = "";
    const userIsLoggedIn = async () => {
      const user = await validateUser();
      if (user !== false) {
        logIn(user);
        return user._id;
      }
    };

    userIdFromDatabase = await userIsLoggedIn();

    const token = localStorage.getItem("snippet-auth");
    fetch(`/snippets/${userIdFromDatabase}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
    })
      .then((res) => res.json())
      .then((snippets) => {
        snippets.error === "Databse is empty!"
          ? dispatch({ type: LOAD_SNIPPETS, payload: [] })
          : dispatch({ type: LOAD_SNIPPETS, payload: snippets.data });
        hideListLoader();
      })
      .catch((err) => {
        hideListLoader();
        dispatch({ type: LOAD_SNIPPETS, payload: [] });
        showListAlert(
          "Unable to get snippets. Check your internet connection."
        );
        console.error(err.message);
        setTimeout(() => {
          hideListAlert();
        }, 3000);
      });
  };

  const createNewPrivateSnippet = (snippetData) => {
    dispatch({ type: NEW_SNIPPET, payload: snippetData });
  };

  const setCurrent = (data) => {
    dispatch({ type: SET_CURRENT, payload: data });
  };

  const updatePrivateSnippet = (data) => {
    dispatch({ type: UPDATE_SNIPPET, payload: data });
  };

  const deletePrivateSnippet = (id) => {
    dispatch({ type: DELETE_SNIPPET, payload: id });
  };

  const filterSnippets = (data) => {
    dispatch({ type: FILTER_SNIPPETS, payload: data });
  };

  return (
    <PrivateListContext.Provider
      value={{
        snippets: state.snippets,
        current: state.current,
        filteredList: state.filteredList,
        searchValue: state.searchValue,
        loadingList: state.loadingList,
        createNewPrivateSnippet,
        setCurrent,
        updatePrivateSnippet,
        deletePrivateSnippet,
        filterSnippets,
        getPrivateSnippets,
      }}
    >
      {props.children}
    </PrivateListContext.Provider>
  );
};

export default PrivateListState;
