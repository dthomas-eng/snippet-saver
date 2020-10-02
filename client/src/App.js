import React, { Fragment } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/layout/Navbar";
import Welcome from "./components/layout/Welcome";
import LoggedInWelcome from "./components/layout/LoggedInWelcome";
import UserHomeWelcome from "./components/layout/UserHomeWelcome";
import Register from "./components/layout/Register";
import Login from "./components/layout/Login";
import Logout from "./components/layout/Logout";
import ForgotPassword from "./components/layout/ForgotPassword";
import Account from "./components/layout/Account";
import ResetPassword from "./components/layout/ResetPassword";
import List from "./components/list/List";
import PrivateList from "./components/privateList/PrivateList";
import ListState from "./context/list/ListState";
import PrivateListState from "./context/privateList/PrivateListState";
import BodyAlertState from "./context/bodyAlert/BodyAlertState";
import BodyLoaderState from "./context/bodyLoader/BodyLoaderState";
import BodyBannerState from "./context/bodyBanner/BodyBannerState";
import ListAlertState from "./context/listAlert/ListAlertState";
import ListLoaderState from "./context/listLoader/ListLoaderState";
import UserState from "./context/user/UserState";
import CreatePost from "./components/post/CreatePost";
import ViewPost from "./components/post/ViewPost";
import EditPost from "./components/post/EditPost";

const App = () => {
  return (
    <UserState>
      <BodyBannerState>
        <BodyLoaderState>
          <ListLoaderState>
            <BodyAlertState>
              <ListAlertState>
                <ListState>
                  <PrivateListState>
                    <Router>
                      <Fragment>
                        <Switch>
                          <Route exact path='/'>
                            <Navbar />
                            <div className='container'>
                              <div className='row grid-15-gutter'>
                                <div className='col-md-8 order-md-2'>
                                  <Welcome />
                                </div>
                                <div className='col-md-4 order-md-1 mt-3'>
                                  <List searchPlaceholder='Search Public Snippets' />
                                </div>
                              </div>
                            </div>
                          </Route>
                          <Route exact path='/register'>
                            <Navbar />
                            <div className='container'>
                              <div className='row grid-15-gutter'>
                                <div className='col-md-2 order-md-1'></div>
                                <div className='col-md-8 order-md-2'>
                                  <Register />
                                </div>
                              </div>
                            </div>
                          </Route>
                          <Route exact path='/login'>
                            <Navbar />
                            <div className='container'>
                              <div className='row grid-15-gutter'>
                                <div className='col-md-2 order-md-1'></div>
                                <div className='col-md-8 order-md-2'>
                                  <Login />
                                </div>
                              </div>
                            </div>
                          </Route>
                          <Route exact path='/logout'>
                            <Navbar />
                            <div className='container'>
                              <div className='row grid-15-gutter'>
                                <div className='col-md-2 order-md-1'></div>
                                <div className='col-md-8 order-md-2'>
                                  <Logout />
                                </div>
                              </div>
                            </div>
                          </Route>
                          <Route exact path='/forgotPassword'>
                            <Navbar />
                            <div className='container'>
                              <div className='row grid-15-gutter'>
                                <div className='col-md-2 order-md-1'></div>
                                <div className='col-md-8 order-md-2'>
                                  <ForgotPassword />
                                </div>
                              </div>
                            </div>
                          </Route>
                          <Route exact path='/resetPassword/:token'>
                            <Navbar />
                            <div className='container'>
                              <div className='row grid-15-gutter'>
                                <div className='col-md-2 order-md-1'></div>
                                <div className='col-md-8 order-md-2'>
                                  <ResetPassword />
                                </div>
                              </div>
                            </div>
                          </Route>
                          <Route exact path='/account'>
                            <Navbar />
                            <div className='container'>
                              <div className='row grid-15-gutter'>
                                <div className='col-md-2 order-md-1'></div>
                                <div className='col-md-8 order-md-2'>
                                  <Account />
                                </div>
                              </div>
                            </div>
                          </Route>
                          <Route exact path='/loggedInHome'>
                            <Navbar />
                            <div className='container'>
                              <div className='row grid-15-gutter'>
                                <div className='col-md-8 order-md-2'>
                                  <LoggedInWelcome />
                                </div>
                                <div className='col-md-4 order-md-1 mt-3'>
                                  <List />
                                </div>
                              </div>
                            </div>
                          </Route>
                          <Route exact path='/userHome'>
                            <Navbar />
                            <div className='container'>
                              <div className='row grid-15-gutter'>
                                <div className='col-md-8 order-md-2'>
                                  <UserHomeWelcome />
                                </div>
                                <div className='col-md-4 order-md-1 mt-3'>
                                  <PrivateList searchPlaceholder='Search Your Snippets' />
                                </div>
                              </div>
                            </div>
                          </Route>
                          <Route exact path='/new'>
                            <Navbar />
                            <div className='container'>
                              <div className='row grid-15-gutter'>
                                <div className='col-md-8 order-md-2'>
                                  <CreatePost />
                                </div>
                                <div className='col-md-4 order-md-1 mt-3'>
                                  <PrivateList />
                                </div>
                              </div>
                            </div>
                          </Route>
                          <Route exact path='/view'>
                            <Navbar />
                            <div className='container'>
                              <div className='row grid-15-gutter'>
                                <div className='col-md-8 order-md-2 mb-3'>
                                  <ViewPost />
                                </div>
                                <div className='col-md-4 order-md-1 mt-3'>
                                  <div className='sticky'>
                                    <List searchPlaceholder='Search Public Snippets' />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Route>
                          <Route exact path='/privateView'>
                            <Navbar />
                            <div className='container'>
                              <div className='row grid-15-gutter'>
                                <div className='col-md-8 order-md-2 mb-3'>
                                  <ViewPost />
                                </div>
                                <div className='col-md-4 order-md-1 mt-3'>
                                  <div className='sticky'>
                                    <PrivateList searchPlaceholder='Search Your Snippets' />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Route>
                          <Route exact path='/edit'>
                            <Navbar />
                            <div className='container'>
                              <div className='row grid-15-gutter'>
                                <div className='col-md-8 order-md-2'>
                                  <EditPost />
                                </div>
                                <div className='col-md-4 order-md-1 mt-3'>
                                  <PrivateList />
                                </div>
                              </div>
                            </div>
                          </Route>
                        </Switch>
                      </Fragment>
                    </Router>
                  </PrivateListState>
                </ListState>
              </ListAlertState>
            </BodyAlertState>
          </ListLoaderState>
        </BodyLoaderState>
      </BodyBannerState>
    </UserState>
  );
};

export default App;
