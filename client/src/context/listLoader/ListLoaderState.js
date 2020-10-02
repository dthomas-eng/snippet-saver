import React, { useReducer } from "react";
import listLoaderReducer from "./listLoaderReducer";
import ListLoaderContext from "./listLoaderContext";
import { SHOW_LIST_LOADER, HIDE_LIST_LOADER } from "../../types";

const ListLoaderState = (props) => {
  const initialState = {
    showIt: true,
  };

  const [state, dispatch] = useReducer(listLoaderReducer, initialState);

  const showListLoader = () => {
    dispatch({ type: SHOW_LIST_LOADER });
  };

  const hideListLoader = () => {
    dispatch({ type: HIDE_LIST_LOADER });
  };

  return (
    <ListLoaderContext.Provider
      value={{
        showIt: state.showIt,
        showListLoader,
        hideListLoader,
      }}
    >
      {props.children}
    </ListLoaderContext.Provider>
  );
};

export default ListLoaderState;
