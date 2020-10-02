import React, { useContext, Fragment } from "react";
import BodyAlertContext from "../../context/bodyAlert/bodyAlertContext";

const BodyAlert = () => {
  const bodyAlertContext = useContext(BodyAlertContext);
  const { showError, msg } = bodyAlertContext;

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

export default BodyAlert;
