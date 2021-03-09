import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import styles from "./styles/App.module.css";

import Start from "./components/Start";
import Login from "./components/Login";

class App extends Component {
  render() {
    return (
      <Router>
        <div className={styles.app_container}>
          <Switch>
            <Route exact path="/" component={Start} />
            <Route exact path="/login" component={Login} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
