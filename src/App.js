import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import styles from "./App.module.css";

import Start from "./components/Start/Start";
import Login from "./components/Authenticate/Login";
import Signup from "./components/Authenticate/Signup";
import Home from "./components/Home/Home";
import firebase from "firebase/app";
import "firebase/auth";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
    };
  }

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged((userAuth) => {
      this.setState({ user: userAuth });
    });
  };

  render() {
    return (
      <Router>
        <div className={styles.app_container}>
          <Switch>
            <Route exact path="/">
              {this.state.user ? <Redirect to="/home" /> : <Start />}
            </Route>
            <Route exact path="/login">
              {this.state.user ? <Redirect to="/home" /> : <Login />}
            </Route>
            <Route exact path="/signup">
              {this.state.user ? <Signup user={this.state.user} /> : <Signup />}
            </Route>
            <Route path="/home">
              {this.state.user ? (
                <Home user={this.state.user} />
              ) : (
                <Redirect to="/" />
              )}
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
