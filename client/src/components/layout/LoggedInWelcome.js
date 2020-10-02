import React, { Fragment } from "react";
import useReturnHomeIfNotLoggedIn from "../../utils/useReturnHomeIfNotLoggedIn";

const LoggedInWelcome = () => {
  useReturnHomeIfNotLoggedIn();

  return (
    <Fragment>
      <div className='jumbotron mt-3 mb-0 p-4 square-border bg-white'>
        <h1 className='logo-text'>Explore.</h1>
        <p className='body-text-14 mt-4'>
          Here you can view, search, and like snippets created by other users.
          You'll notice that when you create a public snippet, it shows up here
          too.
        </p>
      </div>
    </Fragment>
  );
};

export default LoggedInWelcome;
