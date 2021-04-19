import React, { Component } from "react";

import styles from "./TopNav.module.css";
import settings from "../../images/nav_icons/settings.png";
import logout from "../../images/nav_icons/logout.png";
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
        <Link to="/signup">
          <img src={settings} alt="settings" className={styles.nav_button} />
        </Link>
        <div className={styles.title}>{title}</div>
        <img
          src={logout}
          alt="logout"
          className={styles.nav_button}
          onClick={this.logOut}
        />
      </div>
    );
  }
}

export default withRouter(TopNav);
