import React, { Fragment, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import BodyLoader from "../layout/BodyLoader";
import BodyLoaderContext from "../../context/bodyLoader/bodyLoaderContext";
import BodyAlertContext from "../../context/bodyAlert/bodyAlertContext";
import BodyAlert from "../layout/BodyAlert";
import BodyBanner from "../layout/BodyBanner";
import BodyBannerContext from "../../context/bodyBanner/bodyBannerContext";
import UserContext from "../../context/user/userContext";

const Register = () => {
  const bodyLoaderContext = useContext(BodyLoaderContext);
  const { showBodyLoader, hideBodyLoader } = bodyLoaderContext;

  const bodyAlertContext = useContext(BodyAlertContext);
  const { showAlert, hideAlert } = bodyAlertContext;

  const bodyBannerContext = useContext(BodyBannerContext);
  const { showBanner, hideBanner } = bodyBannerContext;

  const userContext = useContext(UserContext);
  const { logIn } = userContext;

  const [user, setUser] = useState({
    name: "",
    email: "",
    password1: "",
    password2: "",
  });
  const { name, email, password1, password2 } = user;

  const history = useHistory();

  const returnHome = () => {
    return history.push("/userHome");
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (password1 !== password2) {
      showAlert("Passwords don't match.");
      setTimeout(() => {
        hideAlert();
      }, 3000);
      return 0;
    }

    if (name === "" || email === "" || password1 === "" || password2 === "") {
      showAlert("All fields are required.");
      setTimeout(() => {
        hideAlert();
      }, 3000);
      return 0;
    }

    const password = password1;

    const newUser = {
      name,
      email,
      password,
    };

    showBodyLoader();

    fetch("/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    })
      .then((res) => res.json())
      .then((res) => {
        hideBodyLoader();
        if (res.success === true) {
          localStorage.setItem("snippet-auth", res.authorization);
          logIn(res.data);
          showBanner("Registration Success - redirecting to your home page.");
          setTimeout(() => {
            hideBanner();
            returnHome();
          }, 1000);
        } else if (res.success === false) {
          showAlert("Registration Failed: " + res.error);
          setTimeout(() => {
            hideAlert();
          }, 3000);
        }
      })
      .catch((err) => {
        hideBodyLoader();
        showAlert("Unable to contact server. User was not added.");
        console.error(err);
        setTimeout(() => {
          hideAlert();
        }, 3000);
      });
  };

  const onChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <Fragment>
      <div className='jumbotron mt-3 mb-0 p-4 square-border bg-white'>
        <h1 className='logo-text'>Register a new account</h1>
        <p className='body-text-14 mt-4'>
          Complete the registration form to begin creating snippets.
        </p>
        <hr className='my-4'></hr>

        <form id='register-frm' onSubmit={onSubmit}>
          <div className='input-group mb-3'>
            <input
              type='text'
              name='name'
              value={name}
              onChange={onChange}
              className='form-control'
              placeholder='Username'
            ></input>
          </div>
          <div className='input-group mb-3'>
            <input
              type='email'
              name='email'
              value={email}
              onChange={onChange}
              className='form-control'
              placeholder='Email'
            ></input>
          </div>
          <div className='input-group mb-3'>
            <input
              type='password'
              name='password1'
              value={password1}
              onChange={onChange}
              className='form-control'
              placeholder='Password'
            ></input>
          </div>
          <div className='input-group mb-3'>
            <input
              type='password'
              name='password2'
              value={password2}
              onChange={onChange}
              className='form-control'
              placeholder='Password (again)'
            ></input>
          </div>
          <button
            type='submit'
            className='btn btn-block dark-color btn-dark square-border body-text-14'
          >
            Register
          </button>
        </form>
      </div>
      <BodyLoader />
      <BodyAlert />
      <BodyBanner />
    </Fragment>
  );
};

export default Register;
