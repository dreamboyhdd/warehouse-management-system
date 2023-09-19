import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { Provider } from "react-redux";

import "./index.css";
import { Routers } from "./Router";

import store from "./Redux/Store/index";

import { NotificationContainer } from 'react-notifications';
import { LoadingAlert } from './Common';
import 'react-notifications/lib/notifications.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Slide, Zoom, Flip, Bounce } from 'react-toastify';
ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route path="/" component={Routers} />
      </Switch>
    </BrowserRouter>
    <NotificationContainer />
    <LoadingAlert />
    <ToastContainer
      transition={Slide}
    />
  </Provider>
  ,
  document.getElementById('root')
);