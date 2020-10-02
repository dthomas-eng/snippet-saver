import React, { Fragment, useEffect, useContext } from "react";
import BodyLoader from "../layout/BodyLoader";
import BodyLoaderContext from "../../context/bodyLoader/bodyLoaderContext";
import UserContext from "../../context/user/userContext";
import { useHistory } from "react-router-dom";

const Logout = () => {
  const bodyLoaderContext = useContext(BodyLoaderContext);
  const { showBodyLoader, hideBodyLoader } = bodyLoaderContext;

  const userContext = useContext(UserContext);
  const { logOut } = userContext;

  const history = useHistory();

  const returnHome = () => {
    return history.push("/");
  };

  useEffect(() => {
    showBodyLoader();

    logOut();
    localStorage.removeItem("snippet-auth");

    setTimeout(() => {
      hideBodyLoader();
      returnHome();
      window.location.reload();
    }, 500);
    // eslint-disable-next-line
  }, []);

  return (
    <Fragment>
      <div className='jumbotron mt-3 mb-0 p-4 square-border bg-white'>
        <h1 className='logo-text'>Hasta La Vista!</h1>
        <p className='body-text-14 mt-4'>Returning to the home page...</p>
        <hr className='my-4'></hr>
      </div>
      <BodyLoader />
    </Fragment>
  );
};

export default Logout;
