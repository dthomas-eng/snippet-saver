import React, { useReducer } from "react";
import UserContext from "./userContext";
import userReducer from "./userReducer";
import { LOG_IN, LOG_OUT, ADD_LIKE, REMOVE_LIKE } from "../../types";

const UserState = (props) => {
  const initialState = {
    loggedIn: false,
    email: "",
    name: "",
    userId: "",
    userLikes: "",
  };
  const [state, dispatch] = useReducer(userReducer, initialState);

  const logIn = (user) => {
    dispatch({ type: LOG_IN, payload: user });
  };

  const logOut = () => {
    dispatch({ type: LOG_OUT });
  };

  const addLike = (snippetId) => {
    dispatch({ type: ADD_LIKE, payload: snippetId });
  };

  const removeLike = (snippetId) => {
    dispatch({ type: REMOVE_LIKE, payload: snippetId });
  };

  return (
    <UserContext.Provider
      value={{
        loggedIn: state.loggedIn,
        email: state.email,
        name: state.name,
        userId: state.userId,
        userLikes: state.userLikes,
        logIn,
        logOut,
        addLike,
        removeLike,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserState;
