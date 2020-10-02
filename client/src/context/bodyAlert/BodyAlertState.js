import React, { useReducer } from "react";
import BodyAlertContext from "./bodyAlertContext";
import bodyAlertReducer from "./bodyAlertReducer";
import { SHOW_ALERT, HIDE_ALERT } from "../../types";

const BodyAlertState = (props) => {
  const initialState = {
    showError: false,
    msg: "this is the error message",
  };
  const [state, dispatch] = useReducer(bodyAlertReducer, initialState);

  const showAlert = (msg) => {
    dispatch({ type: SHOW_ALERT, payload: msg });
  };

  const hideAlert = () => {
    dispatch({ type: HIDE_ALERT });
  };

  return (
    <BodyAlertContext.Provider
      value={{
        showError: state.showError,
        msg: state.msg,
        showAlert,
        hideAlert,
      }}
    >
      {props.children}
    </BodyAlertContext.Provider>
  );
};

export default BodyAlertState;
