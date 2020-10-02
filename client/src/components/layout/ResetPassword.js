import React, { Fragment, useState, useContext } from "react";
import BodyLoader from "../layout/BodyLoader";
import BodyLoaderContext from "../../context/bodyLoader/bodyLoaderContext";
import BodyAlertContext from "../../context/bodyAlert/bodyAlertContext";
import BodyAlert from "../layout/BodyAlert";
import BodyBanner from "../layout/BodyBanner";
import BodyBannerContext from "../../context/bodyBanner/bodyBannerContext";

const ResetPassword = () => {
  const bodyLoaderContext = useContext(BodyLoaderContext);
  const { showBodyLoader, hideBodyLoader } = bodyLoaderContext;

  const bodyAlertContext = useContext(BodyAlertContext);
  const { showAlert, hideAlert } = bodyAlertContext;

  const bodyBannerContext = useContext(BodyBannerContext);
  const { showBanner, hideBanner } = bodyBannerContext;

  const [passwords, setPassword] = useState({
    password1: "",
    password2: "",
  });
  const { password1, password2 } = passwords;

  const onSubmit = (e) => {
    e.preventDefault();

    if (password1 !== password2) {
      showAlert("Passwords do not match.");
      setTimeout(() => {
        hideAlert();
      }, 3000);
      return 0;
    }

    if (password1 === "" || password2 === "") {
      showAlert("All fields are required.");
      setTimeout(() => {
        hideAlert();
      }, 3000);
      return 0;
    }

    const token = window.location.pathname.replace("/resetPassword/", "");

    const resetRequest = {
      password: password1,
      token,
    };

    showBodyLoader();

    fetch(`/resetPassword`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resetRequest),
    })
      .then((res) => res.json())
      .then((res) => {
        hideBodyLoader();
        if (res.success === true) {
          showBanner(
            `Password has been reset - redirecting to your home page.`
          );
          setTimeout(() => {
            hideBanner();
          }, 2000);
        } else if (res.success === false) {
          showAlert(res.error);
          setTimeout(() => {
            hideAlert();
          }, 3000);
        }
      })
      .catch((err) => {
        hideBodyLoader();
        showAlert("Unable to contact server. Password not updated");
        console.error(err.message);
        setTimeout(() => {
          hideAlert();
        }, 3000);
      });
  };

  const onChange = (e) => {
    setPassword({ ...passwords, [e.target.name]: e.target.value });
  };

  return (
    <Fragment>
      <div className='jumbotron mt-3 mb-0 p-4 square-border bg-white'>
        <h1 className='logo-text'>Reset Password</h1>
        <p className='body-text-14 mt-4'>Enter a new password below.</p>
        <hr className='my-4'></hr>
        <form id='reset-password-frm' onSubmit={onSubmit}>
          <div className='input-group mb-3'>
            <input
              type='password'
              name='password1'
              value={password1}
              onChange={onChange}
              className='form-control'
              placeholder='New Password'
            ></input>
          </div>
          <div className='input-group mb-3'>
            <input
              type='password'
              name='password2'
              onChange={onChange}
              className='form-control'
              placeholder='New Password (again)'
            ></input>
          </div>
          <button
            type='submit'
            className='btn btn-block btn-dark dark-color square-border body-text-14 mt-3'
          >
            Submit
          </button>
        </form>
      </div>
      <BodyLoader />
      <BodyBanner />
      <BodyAlert />
    </Fragment>
  );
};

export default ResetPassword;
