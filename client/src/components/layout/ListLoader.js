import React, { Fragment, useContext } from "react";
import Loader from "./Loader.gif";
import ListLoaderContext from "../../context/listLoader/listLoaderContext";

const ListLoader = () => {
  const listLoaderContext = useContext(ListLoaderContext);
  const { showIt } = listLoaderContext;

  return showIt ? (
    <Fragment>
      <img
        src={Loader}
        alt='loading...'
        style={{ width: "100px", margin: "auto", display: "block" }}
      />
    </Fragment>
  ) : (
    <Fragment></Fragment>
  );
};

export default ListLoader;
