import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import styles from "./styles/App.module.css";

import Start from "./components/Start";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";

class App extends Component {
  render() {
    return (
      <Router>
        <div className={styles.app_container}>
          <Route exact path="/home" component={Home} />
          <Switch>
            <Route exact path="/" component={Start} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
