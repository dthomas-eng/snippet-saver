import React, { Fragment, useContext, useState, useEffect } from "react";
import { UnControlled as CodeMirror } from "react-codemirror2";
import { useHistory } from "react-router-dom";
import ListContext from "../../context/list/listContext";
import PrivateListContext from "../../context/privateList/privateListContext";
import BodyBanner from "../layout/BodyBanner";
import UserContext from "../../context/user/userContext";
import updateUserLikes from "../../utils/updateUserLikes";
import updateSnippetLikes from "../../utils/updateSnippetLikes.js";

require("codemirror/theme/snippet-saver.css");
require("codemirror/lib/codemirror.css");

const ViewPost = () => {
  const listContext = useContext(ListContext);
  const { current, updateSnippet } = listContext;
  const {
    _id,
    title,
    code,
    language,
    likes,
    notes,
    authorName,
    authorId,
    dateUpdated,
    isPrivate,
  } = current;

  const privateListContext = useContext(PrivateListContext);
  const { getPrivateSnippets } = privateListContext;

  const userContext = useContext(UserContext);
  const { loggedIn, userId, userLikes, addLike, removeLike } = userContext;

  const [state, setState] = useState({
    likeIconClass: "badge badge-light",
    currentLikes: likes,
  });

  const { likeIconClass, currentLikes } = state;

  const setLikeIcon = (setTo) => {
    let cl = "fa fa-star-o  dark-color-icon";
    let nl = likes;
    if (setTo === "filled") {
      nl += 1;
      cl = "fa fa-star  dark-color-icon";
    } else if (setTo === "empty") {
      nl -= 1;
      cl = "fa fa-star-o  dark-color-icon";
    } else if (userLikes.includes(_id)) {
      cl = "fa fa-star  dark-color-icon";
    }
    setState({ ...state, likeIconClass: cl, currentLikes: nl });
  };

  useEffect(() => {
    setLikeIcon();
    // eslint-disable-next-line
  }, [current._id, userContext]);

  const like = async () => {
    document.getElementById("like-icon").classList.contains("fa-star-o")
      ? setLikeIcon("filled")
      : setLikeIcon("empty");

    const updateLikes = async (updatedUserLikes, increment) => {
      try {
        await updateUserLikes(updatedUserLikes);
        const newLocalLikes = await updateSnippetLikes(_id, likes + increment);
        updateSnippet(newLocalLikes);
      } catch (err) {
        console.log(err);
      }
    };

    if (!userLikes.includes(_id)) {
      let localUserLikes = [...userLikes, _id];
      await updateLikes(localUserLikes, 1);
      addLike(_id);
    } else {
      let localUserLikes = userLikes.filter((snippetId) => {
        if (snippetId !== _id) {
          return snippetId;
        } else {
          return null;
        }
      });
      await updateLikes(localUserLikes, -1);
      removeLike(_id);
    }
    getPrivateSnippets();
  };

  let ownSnippet = false;

  if (userId === authorId) {
    ownSnippet = true;
  }

  const privateOrPublic = () => {
    let ret = "Public";
    isPrivate &&
      (ret = (
        <Fragment>
          <i className='fa fa-lock  dark-color-icon'></i>
          {"  "}Private
        </Fragment>
      ));
    return ret;
  };

  const history = useHistory();

  if (current.id === null) {
    return <Fragment>{history.push("/")}</Fragment>;
  }

  const date = new Date(dateUpdated);

  const displayDate =
    date.getMonth() + 1 + "-" + date.getDate() + "-" + date.getFullYear();

  const onUpdate = () => {
    return history.push("/edit");
  };

  const loggedInView = (
    <Fragment>
      <div className='jumbotron mt-3 mb-0 p-4 square-border bg-white'>
        <h1 className='title-text'>{title}</h1>
        <div className='code-container mt-3'>
          <CodeMirror
            value={code.value}
            options={{
              theme: "snippet-saver",
              viewportMargin: Infinity,
              lineNumbers: true,
              lineWrapping: true,
              readOnly: true,
            }}
            autoCursor
            autoScroll
          />
        </div>
        <br></br>
        <div className='row grid-15-gutter'>
          <div className='col-sm-12 grid-15-gutter'>
            <button
              className='badge-clickable light-color float-right body-text-12'
              onClick={like}
            >
              <i className={likeIconClass} id='like-icon'></i>
              <span className='badge badge-light badge-centered'>
                {currentLikes}
              </span>
            </button>
            <span className='badge-background light-color float-right body-text-12 mr-3 badge-background'>
              {language}
            </span>
            <p className='my-0 body-text-12'>
              <strong>Author: </strong>
              {authorName}{" "}
            </p>
            <p className='my-0 body-text-12'>
              <strong>Created: </strong>
              {displayDate}{" "}
            </p>
          </div>
        </div>
        <hr></hr>
        <p className='body-text-12 mt-3'>{notes}</p>
      </div>
      <BodyBanner />
    </Fragment>
  );

  const loggedInViewOwnSnippet = (
    <Fragment>
      <div className='jumbotron mt-3 mb-0 p-4 square-border bg-white'>
        <span
          className='fa fa-pencil hover-pointer mt-2 float-right '
          onClick={onUpdate}
        ></span>

        <h1 className='title-text'>{title}</h1>
        <div className='code-container mt-3'>
          <CodeMirror
            value={code.value}
            options={{
              theme: "snippet-saver",
              viewportMargin: Infinity,
              lineNumbers: true,
              lineWrapping: true,
              readOnly: true,
            }}
            autoCursor
            autoScroll
          />
        </div>
        <br></br>
        <div className='row grid-15-gutter'>
          <div className='col-sm-12 grid-15-gutter'>
            {!isPrivate && (
              <button
                className='badge-clickable light-color float-right body-text-12'
                onClick={like}
              >
                <i className={likeIconClass} id='like-icon'></i>
                <span className='badge badge-light badge-centered'>
                  {currentLikes}
                </span>
              </button>
            )}
            <span className='badge-background light-color float-right body-text-12 mr-3 badge-background'>
              {language}
            </span>
            <p className='my-0 body-text-12'>
              <strong>Author: </strong>
              You
            </p>
            <p className='my-0 body-text-12'>
              <strong>Created: </strong>
              {displayDate}{" "}
            </p>
            <p className='my-0 body-text-12'>
              <strong>{privateOrPublic()}</strong>
            </p>
          </div>
        </div>
        <hr></hr>
        <p className='body-text-12 mt-3'>{notes}</p>
      </div>
      <BodyBanner />
    </Fragment>
  );

  const loggedOutView = (
    <Fragment>
      {" "}
      <div className='jumbotron mt-3 mb-0 p-4 square-border bg-white'>
        <h1 className='title-text'>{title}</h1>
        <div className='code-container mt-3'>
          <CodeMirror
            value={code.value}
            options={{
              theme: "snippet-saver",
              viewportMargin: Infinity,
              lineNumbers: true,
              lineWrapping: true,
              readOnly: true,
            }}
            autoCursor
            autoScroll
          />
        </div>
        <br></br>
        <div className='row grid-15-gutter'>
          <div className='col-sm-12 grid-15-gutter'>
            <span class='badge-background light-color float-right body-text-12'>
              <i className='fa fa-star  dark-color-icon' id='like-icon'></i>{" "}
              <span class='badge badge-light'>{likes}</span>
            </span>
            <span className='badge-background light-color float-right body-text-12 mr-3 badge-background'>
              {language}
            </span>
            <p className='my-0 body-text-12'>
              <strong>Author: </strong>
              {authorName}{" "}
            </p>
            <p className='my-0 body-text-12'>
              <strong>Created: </strong>
              {displayDate}{" "}
            </p>
          </div>
        </div>
        <hr></hr>
        <p className='body-text-12 mt-3'>{notes}</p>
      </div>
      <BodyBanner />
    </Fragment>
  );

  if (!loggedIn) {
    return loggedOutView;
  } else if (ownSnippet) {
    return loggedInViewOwnSnippet;
  } else {
    return loggedInView;
  }
};

export default ViewPost;
