import React, { useContext, Fragment } from "react";
import { Link } from "react-router-dom";
import UserContext from "../../context/user/userContext";

const Navbar = () => {
  const userContext = useContext(UserContext);
  const { loggedIn } = userContext;

  let loginClasses = "nav-item";
  let registerClasses = "nav-item";
  let loggedInHomeClasses = "nav-item";
  let userHomeClasses = "nav-item";
  let accountClasses = "nav-item";
  let logoutClasses = "nav-item";
  let exploreClasses = "nav-item";

  const setActive = () => {
    const path = window.location.pathname;
    switch (path) {
      case "/":
        exploreClasses = "nav-item active";
        break;
      case "/view":
        exploreClasses = "nav-item active";
        break;
      case "/login":
        loginClasses = "nav-item active";
        break;
      case "/register":
        registerClasses = "nav-item active";
        break;
      case "/loggedInHome":
        loggedInHomeClasses = "nav-item active";
        break;
      case "/userHome":
        userHomeClasses = "nav-item active";
        break;
      case "/edit":
        userHomeClasses = "nav-item active";
        break;
      case "/privateView":
        userHomeClasses = "nav-item active";
        break;
      case "/account":
        accountClasses = "nav-item active";
        break;
      case "/logout":
        logoutClasses = "nav-item active";
        break;
      default:
        break;
    }
  };

  setActive();

  const loggedOutOptions = (
    <Fragment>
      <li className={exploreClasses}>
        <Link to='/' className='nav-link body-text-14'>
          Explore{" "}
        </Link>
      </li>
      <li className={loginClasses}>
        <Link to='/login' className='nav-link body-text-14'>
          Login{" "}
        </Link>
      </li>
      <li className={registerClasses}>
        <Link to='/register' className='nav-link body-text-14'>
          Sign up{" "}
        </Link>
      </li>
    </Fragment>
  );

  const loggedInOptions = (
    <Fragment>
      <li className={loggedInHomeClasses}>
        <Link to='/loggedInHome' className='nav-link body-text-14 '>
          Explore
        </Link>
      </li>
      <li className={userHomeClasses}>
        <Link to='/userHome' className='nav-link body-text-14'>
          My Snippets{" "}
        </Link>
      </li>
      <li className={accountClasses}>
        <Link to='/account' className='nav-link body-text-14'>
          Account{" "}
        </Link>
      </li>
      <li className={logoutClasses}>
        <Link to='/logout' className='nav-link body-text-14 '>
          Logout
        </Link>
      </li>
    </Fragment>
  );

  return (
    <nav className='navbar navbar-expand-lg navbar-light bg-white sticky-top light-color'>
      <div className='container'>
        <Link
          to={loggedIn ? "/loggedInHome" : "/"}
          className='navbar-brand logo-text'
        >
          SNIPPET SAVER
        </Link>
        <button
          className='navbar-toggler'
          type='button'
          data-toggle='collapse'
          data-target='#navbarNav'
          aria-controls='navbarNav'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon'></span>
        </button>
        <div className='collapse navbar-collapse' id='navbarNav'>
          <ul className='navbar-nav ml-auto'>
            {loggedIn ? loggedInOptions : loggedOutOptions}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
