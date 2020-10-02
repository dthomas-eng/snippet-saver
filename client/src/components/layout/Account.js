import React, { Fragment, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import BodyLoader from "./BodyLoader";
import BodyLoaderContext from "../../context/bodyLoader/bodyLoaderContext";
import BodyAlertContext from "../../context/bodyAlert/bodyAlertContext";
import BodyAlert from "./BodyAlert";
import BodyBanner from "./BodyBanner";
import BodyBannerContext from "../../context/bodyBanner/bodyBannerContext";
import UserContext from "../../context/user/userContext";

const Account = () => {
  const bodyLoaderContext = useContext(BodyLoaderContext);
  const { showBodyLoader, hideBodyLoader } = bodyLoaderContext;

  const bodyAlertContext = useContext(BodyAlertContext);
  const { showAlert, hideAlert } = bodyAlertContext;

  const bodyBannerContext = useContext(BodyBannerContext);
  const { showBanner, hideBanner } = bodyBannerContext;

  const userContext = useContext(UserContext);
  const { logOut } = userContext;

  const [state, setState] = useState({
    email: "",
    deleteConfirm: false,
  });
  const { email, deleteConfirm } = state;

  const history = useHistory();

  const returnHome = () => {
    return history.push("/");
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (email === "") {
      showAlert("Email is required.");
      setTimeout(() => {
        hideAlert();
      }, 3000);
      return 0;
    }

    const user = {
      email,
    };

    showBodyLoader();

    fetch("/forgotPassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((res) => {
        hideBodyLoader();
        if (res.success === true) {
          showBanner(`Password reset link has been sent to ${email}`);
          setTimeout(() => {
            hideBanner();
            returnHome();
          }, 3000);
        } else if (res.success === false) {
          showAlert(res.error);
          setTimeout(() => {
            hideAlert();
          }, 3000);
        }
      })
      .catch((err) => {
        hideBodyLoader();
        showAlert("Unable to contact server. Password reset link not sent");
        console.error(err.message);
        setTimeout(() => {
          hideAlert();
        }, 3000);
      });
  };

  const onChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const onDelete = (e) => {
    e.preventDefault();
    setState({ ...state, deleteConfirm: true });
  };

  const confirmDelete = async (e) => {
    setState({ ...state, deleteConfirm: false });
    showBodyLoader();

    const token = localStorage.getItem("snippet-auth");
    e.preventDefault();
    fetch(`/users`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        hideBodyLoader();
        logOut();
        localStorage.removeItem("snippet-auth");
        showBanner("Account Deleted. Redirecting...");
        setTimeout(() => {
          hideBanner();
          returnHome();
        }, 3000);
      })
      .catch((err) => {
        hideBodyLoader();
        showAlert(
          "Unable to delete your account. Check your internet connection."
        );
        console.error(err.message);
        setTimeout(() => {
          hideAlert();
        }, 3000);
      });
  };

  const cancelDelete = (e) => {
    e.preventDefault();
    setState({ ...state, deleteConfirm: false });
  };

  return (
    <Fragment>
      <div className='jumbotron mt-3 mb-0 p-4 square-border bg-white'>
        <h1 className='logo-text'>Account Options</h1>
        <hr className='my-4'></hr>
        <h2 className='logo-text'>Change Password</h2>
        <p className='body-text-14 mt-4'>
          Enter your email and we'll send you a reset link.
        </p>
        <form id='forgot-password-frm' onSubmit={onSubmit}>
          <div className='input-group mb-3'>
            <input
              type='email'
              name='email'
              onChange={onChange}
              className='form-control'
              placeholder='Email'
            ></input>
          </div>
          <button
            type='submit'
            className='btn btn-block dark-color btn-dark square-border body-text-14 mt-3'
          >
            Submit
          </button>
        </form>
        <hr className='my-4'></hr>

        <h2 className='logo-text'>Delete Account</h2>
        <p className='body-text-14 mt-4'>
          Remove your user data and all of your snippets from our servers.
        </p>
        <button
          onClick={onDelete}
          className='btn btn-block dark-color btn-dark square-border body-text-14 mt-3'
        >
          Delete Account
        </button>
      </div>
      <BodyLoader />
      <BodyBanner />
      <BodyAlert />
      {deleteConfirm && (
        <div className='card w-75 mt-3 square-border'>
          <div className='card-body'>
            <h5 className='card-title'>Confirm Delete</h5>
            <p className='card-text body-text-12'>
              Are you sure you want to delete your account and all of your
              snippets? Account cannot be recovered.
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
      )}
    </Fragment>
  );
};

export default Account;
