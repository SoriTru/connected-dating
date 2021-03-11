import React, { Component } from "react";
import firebase from "firebase/app";
import "firebase/auth";

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
      <div>
        <p>Home!</p>
        <button onClick={this.logOut}>Sign out</button>
      </div>
    );
  }
}

export default Home;
