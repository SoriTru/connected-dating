import React, { Component } from "react";

import styles from "./TopNav.module.css";
import logo from "../../images/cnd_plain_logo.png";
import { Link, withRouter } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/auth";

class TopNav extends Component {
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
    let location = this.props.location.pathname.replaceAll("/home", "");
    let title = location.charAt(1).toUpperCase() + location.slice(2);

    return (
      <div className={styles.container}>
        <Link to="/home">
          <img src={logo} alt="logo" className={styles.logo} />
        </Link>
        <div className={styles.title}>{title}</div>
        <button onClick={this.logOut} className={styles.logout}>
          Log out
        </button>
      </div>
    );
  }
}

export default withRouter(TopNav);
