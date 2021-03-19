import React, { Component } from "react";
import firebase from "firebase/app";
import "firebase/auth";

import commonStyles from "../styles/Common.module.css";

import BottomNav from "./BottomNav";

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
      <div className={commonStyles.container}>
        <div className={commonStyles.main}>
          <p>Home!</p>
          <button onClick={this.logOut}>Sign out</button>
        </div>
        <BottomNav page={"date"} />
      </div>
    );
  }
}

export default Home;
