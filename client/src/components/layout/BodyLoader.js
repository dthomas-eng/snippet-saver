import React, { Fragment, useContext } from "react";
import bodyLoader from "./bodyLoader.gif";
import BodyLoaderContext from "../../context/bodyLoader/bodyLoaderContext";

const BodyLoader = () => {
  const bodyLoaderContext = useContext(BodyLoaderContext);
  const { showIt } = bodyLoaderContext;

  return showIt ? (
    <Fragment>
      <img
        className='mt-4'
        src={bodyLoader}
        alt='loading...'
        style={{
          width: "150px",
          margin: "auto",
          display: "block",
        }}
      />
    </Fragment>
  ) : (
    <Fragment></Fragment>
  );
};

export default BodyLoader;
