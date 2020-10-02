import React, { useContext, useEffect, useState, Fragment } from "react";
import PrivateListContext from "../../context/privateList/privateListContext";
import PrivateListItem from "./PrivateListItem";
import ListAlert from "../layout/ListAlert";
import ListAlertContext from "../../context/listAlert/listAlertContext";
import ListLoader from "../layout/ListLoader";
import ListLoaderContext from "../../context/listLoader/listLoaderContext";
import { useHistory } from "react-router-dom";

const PrivateList = () => {
  const listAlertContext = useContext(ListAlertContext);
  const { showAlert, hideAlert, showError } = listAlertContext;

  const listContext = useContext(PrivateListContext);
  const {
    snippets,
    filteredList,
    searchValue,
    filterSnippets,
    loadingList,
  } = listContext;

  const listLoaderContext = useContext(ListLoaderContext);
  const { showListLoader, hideListLoader, showIt } = listLoaderContext;

  const [state, setState] = useState("");
  const onSearch = (e) => {
    setState(...state, e.target.value);
    filterSnippets(e.target.value);
  };

  useEffect(() => {
    if (snippets.length === 0 && loadingList === false) {
      showAlert("No snippets in this list!");
    } else if (snippets.length === 0 && loadingList === true) {
      showListLoader();
    } else if (filteredList.length === 0 && searchValue !== "") {
      showAlert("Nothing matches the search!");
    } else {
      hideAlert();
      hideListLoader();
    }
    // eslint-disable-next-line
  }, [searchValue, snippets]);

  let col = null;

  searchValue === ""
    ? (col = snippets.map((snippet) => (
        <PrivateListItem snippet={snippet} key={snippet._id} />
      )))
    : (col = filteredList.map((snippet) => (
        <PrivateListItem snippet={snippet} key={snippet._id} />
      )));

  const history = useHistory();

  const createButton = () => {
    return history.push("/new");
  };

  return (
    <Fragment>
      {window.location.pathname !== "/new" && (
        <Fragment>
          {" "}
          <button
            className='btn btn-dark btn-block dark-color square-border body-text-14 mr-3 mb-3'
            onClick={createButton}
          >
            Create Snippet
          </button>{" "}
        </Fragment>
      )}

      <form className='form-group'>
        <input
          className='form-control square-border my-0'
          type='text'
          placeholder='Search Your Snippets'
          value={searchValue}
          onChange={onSearch}
        />
      </form>
      <ListLoader />
      <ListAlert />
      {!showError && !showIt && (
        <div className='scrollable-list short-scrollable-list'>{col}</div>
      )}
    </Fragment>
  );
};

export default PrivateList;
