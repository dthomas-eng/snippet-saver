import React, { Fragment, useState, useContext } from "react";
import { UnControlled as CodeMirror } from "react-codemirror2";
import ListContext from "../../context/list/listContext";
import PrivateListContext from "../../context/privateList/privateListContext";
import BodyAlertContext from "../../context/bodyAlert/bodyAlertContext";
import { useHistory } from "react-router-dom";
import BodyAlert from "../layout/BodyAlert";
import BodyLoader from "../layout/BodyLoader";
import BodyLoaderContext from "../../context/bodyLoader/bodyLoaderContext";
import BodyBanner from "../layout/BodyBanner";
import BodyBannerContext from "../../context/bodyBanner/bodyBannerContext";
import validateUser from "../../utils/validateUser";
import UserContext from "../../context/user/userContext";

const CreatePost = () => {
  const listContext = useContext(ListContext);
  const { createNewSnippet } = listContext;

  const privateListContext = useContext(PrivateListContext);
  const { createNewPrivateSnippet, setCurrent } = privateListContext;

  const bodyAlertContext = useContext(BodyAlertContext);
  const { showAlert, hideAlert } = bodyAlertContext;

  const bodyLoaderContext = useContext(BodyLoaderContext);
  const { showBodyLoader, hideBodyLoader } = bodyLoaderContext;

  const bodyBannerContext = useContext(BodyBannerContext);
  const { showBanner, hideBanner } = bodyBannerContext;

  const userContext = useContext(UserContext);
  const { loggedIn } = userContext;

  const history = useHistory();

  const returnHome = () => {
    return history.push("/");
  };

  !loggedIn && returnHome();

  const [snippet, setSnippet] = useState({
    title: "",
    notes: "",
    code: "",
    authorId: "",
    authorName: "",
    likes: "",
    isPrivate: false,
    dateUpdated: "",
    language: "",
  });

  const { title, notes, author, code, language, isPrivate } = snippet;

  const onSubmit = async (e) => {
    e.preventDefault();

    if (title !== "" && code !== "" && author !== "") {
      let d = new Date();
      let dd = d.getDate();
      let mm = d.getMonth() + 1;
      let yyyy = d.getFullYear();

      const today = `${mm}-${dd}-${yyyy}`;

      let uId = "";
      const userIsLoggedIn = async () => {
        const user = await validateUser();
        if (user !== false) {
          return user;
        }
      };

      uId = await userIsLoggedIn();

      let user = {
        id: uId._id,
        name: uId.name,
      };

      const newSnippet = {
        title,
        notes,
        code,
        authorId: user.userId,
        authorName: user.name,
        likes: 0,
        isPrivate,
        dateUpdated: today,
        language,
      };

      showBodyLoader();

      const token = localStorage.getItem("snippet-auth");
      fetch("/snippets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
        body: JSON.stringify(newSnippet),
      })
        .then((res) => res.json())
        .then((snippet) => {
          createNewPrivateSnippet(snippet.data);
          createNewSnippet(snippet.data);
          hideBodyLoader();
          showBanner("New snippet added.");
          setCurrent(snippet);
          setTimeout(() => {
            hideBanner();
            return history.push("/privateView");
          }, 3000);
        })
        .catch((err) => {
          hideBodyLoader();
          showAlert("Unable to contact server. Snippet was not added.");
          console.error(err.message);
          setTimeout(() => {
            hideAlert();
          }, 3000);
        });
    } else {
      showAlert("Title, Author, and Code fields must not be empty.");

      setTimeout(() => {
        hideAlert();
      }, 3000);
    }
  };

  const onChange = (e) => {
    setSnippet({ ...snippet, [e.target.name]: e.target.value });
  };

  const onCodeChange = (input) => {
    setSnippet({ ...snippet, code: input });
  };

  const isPrivateSwitched = () => {
    if (document.getElementById("isPrivate").checked) {
      setSnippet({ ...snippet, isPrivate: true });
    } else {
      setSnippet({ ...snippet, isPrivate: false });
    }
  };

  return (
    <Fragment>
      <div>
        <BodyAlert />
        <form id='new-post-frm' onSubmit={onSubmit}>
          <input
            name='title'
            type='text'
            className='form-control square-border body-text-12 my-3'
            value={title}
            id='inputDefault'
            placeholder='Title'
            onChange={onChange}
          />
          <input
            name='language'
            type='text'
            className='form-control square-border body-text-12 my-3'
            value={language}
            id='inputDefault'
            placeholder='Language'
            onChange={onChange}
          />
          <div className='code-container'>
            <CodeMirror
              value='Code'
              options={{
                mode: "python",
                theme: "base16-dark",
                lineNumbers: true,
              }}
              onChange={(editor, data, value) => {
                onCodeChange({ value });
              }}
            />
          </div>
          <div className='form-group'>
            <textarea
              onChange={onChange}
              name='notes'
              className='form-control square-border body-text-12 my-3'
              id='exampleTextarea'
              rows='3'
              value={notes}
              placeholder='Notes'
            ></textarea>
          </div>

          <label className='switch' name='isPrivate-switch'>
            <input
              type='checkbox'
              name='isPrivate'
              id='isPrivate'
              onClick={isPrivateSwitched}
            ></input>
            <span className='slider round'></span>
          </label>
          <label htmlFor='isPrivate-switch' className='body-text-12'>
            <i className='fa fa-lock  dark-color-icon'></i>
            Make Private (Will not be visible to other users)
          </label>
          <button
            type='submit'
            className='btn btn-dark dark-color btn-block mt-0 square-border body-text-12'
          >
            Submit
          </button>
        </form>
      </div>
      <BodyLoader />
      <BodyBanner />
    </Fragment>
  );
};

export default CreatePost;
