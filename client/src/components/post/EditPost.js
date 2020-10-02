import React, { Fragment, useState, useContext } from "react";
import { UnControlled as CodeMirror } from "react-codemirror2";
import ListContext from "../../context/list/listContext";
import PrivateListContext from "../../context/privateList/privateListContext";
import { useHistory } from "react-router-dom";
import BodyAlertContext from "../../context/bodyAlert/bodyAlertContext";
import BodyAlert from "../layout/BodyAlert";
import BodyLoader from "../layout/BodyLoader";
import BodyLoaderContext from "../../context/bodyLoader/bodyLoaderContext";
import BodyBanner from "../layout/BodyBanner";
import BodyBannerContext from "../../context/bodyBanner/bodyBannerContext";

require("codemirror/lib/codemirror.css");

const EditPost = () => {
  const listContext = useContext(ListContext);
  const {
    current,
    updateSnippet,
    deleteSnippet,
    filterSnippets,
    searchValue,
  } = listContext;

  const bodyLoaderContext = useContext(BodyLoaderContext);
  const { showBodyLoader, hideBodyLoader } = bodyLoaderContext;

  const privateListContext = useContext(PrivateListContext);
  const { updatePrivateSnippet, deletePrivateSnippet } = privateListContext;

  const bodyBannerContext = useContext(BodyBannerContext);
  const { showBanner, hideBanner } = bodyBannerContext;

  const bodyAlertContext = useContext(BodyAlertContext);
  const { showAlert, hideAlert } = bodyAlertContext;

  const history = useHistory();

  const [state , setState] = useState({
    id: current._id,
    title: current.title,
    notes: current.notes,
    code: current.code,
    authorId: current.authorId,
    authorName: current.authorName,
    likes: current.likes,
    isPrivate: current.isPrivate,
    dateUpdated: current.dateUpdated,
    language: current.language,
    currentCursorPositon: null,
  });

  if (current._id !== null) {
    const {
      title,
      notes,
      code,
      authorId,
      authorName,
      likes,
      isPrivate,
      deleteConfirm,
      id,
      language,
    } = state;

    const originalCode = `${current.code.value}`;

    const onSubmit = (e) => {
      e.preventDefault();
      if (title !== "" && code !== "") {
        let d = new Date();
        let dd = d.getDate();
        let mm = d.getMonth() + 1;
        let yyyy = d.getFullYear();

        const today = `${mm}-${dd}-${yyyy}`;

        const updatedSnippet = {
          title,
          notes,
          code,
          authorId,
          authorName,
          likes,
          isPrivate,
          dateUpdated: today,
          language,
        };

        console.log(updatedSnippet)

        showBodyLoader();

        const token = localStorage.getItem("snippet-auth");

        fetch(`/snippets/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
          body: JSON.stringify(updatedSnippet),
        })
          .then((res) => res.json())
          .then((snippet) => {
            showBanner("Updates saved.");
            setTimeout(() => {
              hideBanner();
            }, 3000);
            hideBodyLoader();
            updateSnippet(snippet.data);
            updatePrivateSnippet(snippet.data);
            filterSnippets(searchValue);
            return history.push("/privateView");
          })
          .catch((err) => {
            hideBodyLoader();
            showAlert("Connection to server lost. Snippet not updated.");
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
      setState({ ...state, [e.target.name]: e.target.value });
    };

    const onCodeChange = (input) => {
      setState({
        ...state,
        code: input,
      });
      console.log(input)
    };

    const onDelete = (e) => {
      e.preventDefault();
      setState({ ...state, deleteConfirm: true });
    };

    const confirmDelete = (e) => {
      const token = localStorage.getItem("snippet-auth");
      e.preventDefault();
      showBodyLoader();
      fetch(`/snippets/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
        //body: JSON.stringify(updatedSnippet),
      })
        .then((res) => res.json())
        .then((snippet) => {
          showBanner("Snippet Deleted.");
          hideBodyLoader();
          setTimeout(() => {
            hideBanner();
            deleteSnippet(id);
            deletePrivateSnippet(id);
            return history.push("/userHome");
          }, 3000);
        })
        .catch((err) => {
          hideBodyLoader();
          showAlert("Connection to server lost. Snippet not deleted.");
          console.error(err.message);
          setState({ ...state, deleteConfirm: false });
          setTimeout(() => {
            hideAlert();
          }, 3000);
        });
    };

    const cancelDelete = (e) => {
      e.preventDefault();
      setState({ ...state, deleteConfirm: false });
    };

    const isPrivateSwitched = () => {
      if (document.getElementById("isPrivate").checked) {
        setState({ ...state, isPrivate: true });
      } else {
        setState({ ...state, isPrivate: false });
      }
    };

    return (
      <Fragment>
        <BodyAlert />
        <form id='new-post-frm' onSubmit={onSubmit}>
          <div className='form-group'>
            <input
              name='title'
              type='text'
              className='form-control square-border body-text-12 my-3'
              value={title}
              id='inputDefault'
              onChange={onChange}
            />
          </div>
          <input
            name='language'
            type='text'
            className='form-control square-border body-text-12 my-3'
            value={language}
            id='inputDefault'
            placeholder='Language'
            onChange={onChange}
          />
          <CodeMirror
            value= {originalCode}
            options={{
              mode: "python",
              theme: "base16-dark",
              lineNumbers: true,
            }}
            onChange={(editor, data, value) => {
              onCodeChange({ value });
            }}
          />
          <div className='form-group'>
            <textarea
              onChange={onChange}
              name='notes'
              className='form-control square-border body-text-12 my-3'
              id='exampleTextarea'
              rows='3'
              value={notes}
            ></textarea>
          </div>
          <div className='block'>
            <label className='switch' name='isPrivate-switch'>
              <input
                type='checkbox'
                name='isPrivate'
                id='isPrivate'
                onChange={isPrivateSwitched}
                checked={isPrivate}
              ></input>
              <span className='slider round'></span>
            </label>
            <label htmlFor='isPrivate-switch' className='body-text-12'>
              <i className='fa fa-lock  dark-color-icon'></i>
              Make Private (Will not be visible to other users)
            </label>
          </div>
          <button
            type='submit'
            className='btn btn-dark dark-color btn-inline square-border body-text-12'
          >
            Submit
          </button>
          {!deleteConfirm && (
            <Fragment>
              <button
                onClick={onDelete}
                className='btn btn-dark dark-color btn-inline ml-3 square-border body-text-12'
              >
                Delete
              </button>
              <BodyLoader />
            </Fragment>
          )}
          {deleteConfirm && (
            <Fragment>
              <div className='card w-75 mt-3 square-border'>
                <div className='card-body'>
                  <h5 className='card-title'>Confirm Delete</h5>
                  <p className='card-text body-text-12'>
                    Are you sure you want to delete this snippet?
                  </p>
                  <button
                    onClick={confirmDelete}
                    className='btn btn-dark dark-color square-border body-text-12 mt-1 mr-2'
                  >
                    Yes
                  </button>
                  <button
                    onClick={cancelDelete}
                    className='btn btn-dark dark-color square-border body-text-12  mt-1'
                  >
                    Cancel
                  </button>
                </div>
              </div>
              <BodyLoader />
            </Fragment>
          )}
        </form>
        <BodyBanner />
      </Fragment>
    );
  } else {
    return <Fragment>{history.push("/")}</Fragment>;
  }
};

export default EditPost;
