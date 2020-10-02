import React, { useContext, Fragment } from "react";
import ListAlertContext from "../../context/listAlert/listAlertContext";

const ListAlert = () => {
  const listAlertContext = useContext(ListAlertContext);
  const { showError, msg } = listAlertContext;

  let alertBody = <Fragment></Fragment>;
  if (showError) {
    alertBody = (
      <div className='mt-3'>
        <div
          className='alert alert-danger square-border body-text-12'
          style={{ width: "100%" }}
        >
          {msg}
        </div>
      </div>
    );
  }

  return alertBody;
};

export default ListAlert;
