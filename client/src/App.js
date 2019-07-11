import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';

// Redux imports
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from "./actions/auth";

import './App.css';
import setAuthToken from "./utils/setAuthToken";

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
                <Route exact path='/' component={Landing} />
                <section className="container">
                    <Alert />
                  <Switch>
                    <Route exact path='/register' component={Register} />
                    <Route exact path='/login' component={Login} />
                  </Switch>
                </section>

            </Fragment>
          </Router>
        </Provider>
)};


export default App;
