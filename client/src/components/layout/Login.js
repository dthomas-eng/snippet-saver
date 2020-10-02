import React, { Fragment, useState, useContext } from "react";
import BodyLoader from "../layout/BodyLoader";
import BodyLoaderContext from "../../context/bodyLoader/bodyLoaderContext";
import BodyAlertContext from "../../context/bodyAlert/bodyAlertContext";
import BodyAlert from "../layout/BodyAlert";
import BodyBanner from "../layout/BodyBanner";
import BodyBannerContext from "../../context/bodyBanner/bodyBannerContext";
import UserContext from "../../context/user/userContext";
import { useHistory } from "react-router-dom";

const Login = () => {
  const bodyLoaderContext = useContext(BodyLoaderContext);
  const { showBodyLoader, hideBodyLoader } = bodyLoaderContext;

  const bodyAlertContext = useContext(BodyAlertContext);
  const { showAlert, hideAlert } = bodyAlertContext;

  const bodyBannerContext = useContext(BodyBannerContext);
  const { showBanner, hideBanner } = bodyBannerContext;

  const userContext = useContext(UserContext);
  const { logIn } = userContext;

  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const { email, password } = user;

  const onSubmit = (e) => {
    e.preventDefault();

    if (email === "" || password === "") {
      showAlert("All fields are required.");
      setTimeout(() => {
        hideAlert();
      }, 3000);
      return 0;
    }

    const user = {
      email,
      password,
    };

    showBodyLoader();

    fetch("/auth", {
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
          localStorage.setItem("snippet-auth", res.authorization);
          showBanner("Login Success - redirecting to your home page.");
          logIn(res.data);
          setTimeout(() => {
            hideBanner();
            return history.push("/userHome");
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
        showAlert("Unable to contact server. Snippet was not added.");
        console.error(err.message);
        setTimeout(() => {
          hideAlert();
        }, 3000);
      });
  };

  const onChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const history = useHistory();

  const forgotPasswordLink = () => {
    return history.push("/forgotPassword");
  };

  return (
    <Fragment>
      <div className='jumbotron mt-3 mb-0 p-4 square-border bg-white'>
        <h1 className='logo-text'>Welcome back</h1>
        <p className='body-text-14 mt-4'>
          Login to create, edit, and view your snippets.
        </p>
        <p className='body-text-12 mt-4'>
          <strong>Email:</strong> test@snippetsaver.com
          <br></br>
          <strong>Password:</strong> sn1ppets
        </p>
        <hr className='my-4'></hr>
        <form id='login-frm' onSubmit={onSubmit}>
          <div className='input-group mb-3'>
            <input
              type='email'
              name='email'
              onChange={onChange}
              className='form-control'
              placeholder='Email'
            ></input>
          </div>
          <div className='input-group mb-1'>
            <input
              type='password'
              name='password'
              onChange={onChange}
              className='form-control'
              placeholder='Password'
            ></input>
          </div>

          <button
            type='submit'
            className='btn btn-block dark-color btn-dark square-border body-text-14 mt-3'
          >
            Submit
          </button>
        </form>
        <button
            className='forgot-password-button body-text-12 text-dark'
            onClick={forgotPasswordLink}
          >
            Forgot Password?
          </button>
      </div>
      <BodyLoader />
      <BodyBanner />
      <BodyAlert />
    </Fragment>
  );
};

export default Login;
