import React, { useReducer } from "react";
import BodyBannerContext from "./bodyBannerContext";
import bodyBannerReducer from "./bodyBannerReducer";
import { SHOW_BANNER, HIDE_BANNER } from "../../types";

const BodyBannerState = (props) => {
  const initialState = {
    shown: false,
    msg: "This is the success message.",
  };
  const [state, dispatch] = useReducer(bodyBannerReducer, initialState);

  const showBanner = (msg) => {
    dispatch({ type: SHOW_BANNER, payload: msg });
  };

  const hideBanner = () => {
    dispatch({ type: HIDE_BANNER });
  };

  return (
    <BodyBannerContext.Provider
      value={{
        shown: state.shown,
        msg: state.msg,
        showBanner,
        hideBanner,
      }}
    >
      {props.children}
    </BodyBannerContext.Provider>
  );
};

export default BodyBannerState;
