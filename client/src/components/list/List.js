import React, { useContext, useEffect, useState, Fragment } from "react";
import ListContext from "../../context/list/listContext";
import ListItem from "./ListItem";
import ListAlert from "../layout/ListAlert";
import ListAlertContext from "../../context/listAlert/listAlertContext";
import ListLoader from "../layout/ListLoader";
import ListLoaderContext from "../../context/listLoader/listLoaderContext";
import UserContext from "../../context/user/userContext";

const List = () => {
  const listAlertContext = useContext(ListAlertContext);
  const { showAlert, hideAlert, showError } = listAlertContext;

  const listLoaderContext = useContext(ListLoaderContext);
  const { showListLoader, hideListLoader, showIt } = listLoaderContext;

  const userContext = useContext(UserContext);
  const { loggedIn, userLikes } = userContext;

  const listContext = useContext(ListContext);
  const {
    snippets,
    filteredList,
    likedOnlyList,
    searchValue,
    filterSnippets,
    loadingList,
    likedOnly,
    likedOnlyToggle,
    filterLikedOnly,
  } = listContext;

  const [state, setState] = useState({
    likedSwitched: likedOnly,
  });
  const { likedSwitched } = state;

  const onSearch = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
    filterSnippets(e.target.value);
  };

  snippets.sort((a, b) => (a.likes > b.likes ? -1 : 1));

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

  if (searchValue === "" && likedSwitched === false) {
    col = snippets.map((snippet) => (
      <ListItem snippet={snippet} key={snippet._id} />
    ));
  } else if (searchValue === "" && likedSwitched === true) {
    col = likedOnlyList.map((snippet) => (
      <ListItem snippet={snippet} key={snippet._id} />
    ));
  } else if (searchValue !== "" && likedSwitched === false) {
    col = filteredList.map((snippet) => (
      <ListItem snippet={snippet} key={snippet._id} />
    ));
  } else if (searchValue !== "" && likedSwitched === true) {
    col = filteredList.map((snippet) => (
      <ListItem snippet={snippet} key={snippet._id} />
    ));
  }

  const isLikedSwitched = () => {
    if (document.getElementById("likedOnly").checked) {
      setState({ ...state, likedSwitched: true });
      likedOnlyToggle();
      filterLikedOnly(userLikes);
      filterSnippets(searchValue);
    } else {
      setState({ ...state, likedSwitched: false });
      likedOnlyToggle();
      filterSnippets(searchValue);
    }
  };

  return (
    <Fragment>
      <form className='form-group'>
        <input
          className='form-control square-border my-0'
          name='searchValue'
          type='text'
          placeholder='Search Public Snippets'
          value={searchValue}
          onChange={onSearch}
        />
      </form>
      {loggedIn && (
        <Fragment>
          {" "}
          <label
            className='switch my-0 like-switch-position'
            name='liked-only-switch'
          >
            <input
              type='checkbox'
              name='likedOnly'
              id='likedOnly'
              onChange={isLikedSwitched}
              checked={likedSwitched}
            ></input>
            <span className='slider round'></span>
          </label>
          <label
            htmlFor='liked-only-switch'
            className='body-text-12 like-switch-label-position'
          >
            Favorites Only
          </label>
        </Fragment>
      )}
      <ListLoader />
      <ListAlert />
      {!showError && !showIt && <div className='scrollable-list'>{col}</div>}
    </Fragment>
  );
};

export default List;
