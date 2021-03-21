import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import firebase from "firebase/app";
import "firebase/auth";

import styles from "../styles/Home.module.css";

import BottomNav from "./BottomNav";
import TopNav from "./TopNav";

class Home extends Component {
  logOut = () => {
    firebase
      .auth()
      .signOut()
      .then(function () {
        // success
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  render() {
    return (
      <div className={styles.container}>
        <TopNav />
        <div className={styles.main}>
          <Switch>
            <Route exact path="/home">
              <p>Home!</p>
              <button onClick={this.logOut}>Sign out</button>
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
            <Route path="/home/profile">Profile</Route>
          </Switch>
        </div>

        <BottomNav />
      </div>
    );
  }
}

export default Home;
