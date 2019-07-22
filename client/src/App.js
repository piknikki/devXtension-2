import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Routes from './components/routing/Routes';

// Redux imports
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";

import './App.css';


// if there's a token in storage, set it in the auth token so that it can be used any time
if (localStorage.token) {
    setAuthToken(localStorage.token);
}

const  App = () => {
    // adding empty array keeps this hook from looping constantly, assures it only runs once.
    //    behaves likes componentDidMount -- tells react that the effect doesn't depend on any values from props or state
    useEffect(() => {
        store.dispatch(loadUser())
    }, []);

    return (
        <Provider store={store}>
          <Router>
            <Fragment>
              <Navbar />
              <Switch>
                  <Route exact path='/' component={Landing} />
                  <Routes comonent={Routes} />

              </Switch>


            </Fragment>
          </Router>
        </Provider>
)};


export default App;
