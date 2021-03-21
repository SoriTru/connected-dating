import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import styles from "../styles/Home.module.css";

import BottomNav from "./BottomNav";
import TopNav from "./TopNav";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = { path: window.location.pathname, title: "Home" };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log(window.location.pathname);
  }

  render() {
    return (
      <div className={styles.container}>
        <TopNav path={this.state.path} title={this.state.title} />
        <div className={styles.main}>
          <Switch>
            <Route exact path="/home">
              Home
            </Route>
            <Route exact path="/home/dates">
              Dates
            </Route>
            <Route exact path="/home/video">
              Video
            </Route>
            <Route exact path="/home/chat">
              Chat
            </Route>
            <Route exact path="/home/profile">
              Profile
            </Route>
          </Switch>
        </div>

        <BottomNav />
      </div>
    );
  }
}

export default Home;
