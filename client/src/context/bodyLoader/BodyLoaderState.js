import React, { useReducer } from "react";
import bodyLoaderReducer from "./bodyLoaderReducer";
import BodyLoaderContext from "./bodyLoaderContext";
import { SHOW_BODY_LOADER, HIDE_BODY_LOADER } from "../../types";

const BodyLoaderState = (props) => {
  const initialState = {
    showIt: false,
  };
  const [state, dispatch] = useReducer(bodyLoaderReducer, initialState);

  const showBodyLoader = () => {
    dispatch({ type: SHOW_BODY_LOADER });
  };

  const hideBodyLoader = () => {
    dispatch({ type: HIDE_BODY_LOADER });
  };

  return (
    <BodyLoaderContext.Provider
      value={{
        showIt: state.showIt,
        showBodyLoader,
        hideBodyLoader,
      }}
    >
      {props.children}
    </BodyLoaderContext.Provider>
  );
};

export default BodyLoaderState;
