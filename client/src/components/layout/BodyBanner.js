import React, { useContext, Fragment } from "react";
import BodyBannerContext from "../../context/bodyBanner/bodyBannerContext";

const BodyBanner = () => {
  const bodyBannerContext = useContext(BodyBannerContext);
  const { shown, msg } = bodyBannerContext;

  let Banner = <Fragment></Fragment>;
  if (shown) {
    Banner = (
      <div className='mt-3'>
        <div
          className='alert alert-success square-border body-text-12'
          style={{ width: "100%" }}
        >
          {msg}
        </div>
      </div>
    );
  }

  return Banner;
};

export default BodyBanner;
