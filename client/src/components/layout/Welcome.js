import React, { Fragment, useContext } from "react";
import { useHistory } from "react-router-dom";
import validateUser from "../../utils/validateUser";
import UserContext from "../../context/user/userContext";

const Welcome = () => {
  const userContext = useContext(UserContext);
  const { logIn } = userContext;

  const userIsLoggedIn = async () => {
    const user = await validateUser();
    if (user !== false) {
      logIn(user);
      loggedIn();
    }
  };
  userIsLoggedIn();

  const history = useHistory();

  const loggedIn = () => {
    return history.push("/loggedInHome");
  };

  const registerButton = () => {
    return history.push("/register");
  };

  const loginButton = () => {
    return history.push("/login");
  };

  return (
    <Fragment>
      <div className='jumbotron mt-3 mb-0 p-4 square-border bg-white'>
        <h1 className='logo-text'>Welcome.</h1>
        <p className='body-text-14 mt-4'>
          Snippet Saver is a tool for saving and sharing code snippets - never
          forget where you saved that snippet again!
        </p>
        <hr className='my-4'></hr>
        <p className='body-text-14'>
          Sign up or login to create, edit, and share your own snippets.
        </p>
        <button
          className='btn btn-dark dark-color square-border body-text-12'
          onClick={registerButton}
        >
          Sign Up
        </button>

        <button
          className='btn btn-dark dark-color square-border body-text-12 ml-3'
          onClick={loginButton}
        >
          Login
        </button>
      </div>
    </Fragment>
  );
};

export default Welcome;
