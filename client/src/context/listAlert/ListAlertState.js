import React, { useReducer } from "react";
import ListAlertContext from "./listAlertContext";
import listAlertReducer from "./listAlertReducer";
import { SHOW_ALERT, HIDE_ALERT } from "../../types";

const ListAlertState = (props) => {
  const initialState = {
    showError: false,
    msg: "this is the error message",
  };

  const [state, dispatch] = useReducer(listAlertReducer, initialState);

  const showAlert = (msg) => {
    dispatch({ type: SHOW_ALERT, payload: msg });
  };

  const hideAlert = () => {
    dispatch({ type: HIDE_ALERT });
  };

  return (
    <ListAlertContext.Provider
      value={{
        showError: state.showError,
        msg: state.msg,
        showAlert,
        hideAlert,
      }}
    >
      {props.children}
    </ListAlertContext.Provider>
  );
};

export default ListAlertState;
