import React, { Fragment, useContext } from "react";
import UserContext from "../../context/user/userContext";
import useReturnHomeIfNotLoggedIn from "../../utils/useReturnHomeIfNotLoggedIn";

const UserHomeWelcome = () => {
  const userContext = useContext(UserContext);
  const { name } = userContext;

  useReturnHomeIfNotLoggedIn();

  return (
    <Fragment>
      <div className='jumbotron mt-3 mb-0 p-4 square-border bg-white'>
        <h1 className='logo-text'>Hello, {name}!</h1>
        <p className='body-text-14 mt-4'>
          This is your personal snippet collection - click 'Create Snippet' to
          publish a new snippet or select one from the list to view or edit.
        </p>
      </div>
    </Fragment>
  );
};

export default UserHomeWelcome;
