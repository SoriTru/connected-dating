import React, {Component} from "react";

import styles from "../styles/TopNav.module.css";
import backArrow from "../images/backarrow.png";
import {Link, withRouter} from "react-router-dom";
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
    const {location} = this.props;
    let leftButton;
    let centerText;
    let rightButton;

    if (this.props.path === "/home") {
      leftButton = <Link to="/home">Our Title</Link>;
      centerText = <div >{location.pathname} </div>;
      rightButton = (
        <button onClick={this.logOut} className={styles.right}>
          Log out
        </button>
      );
    } else {
      leftButton = (
        <Link to="/home">
          <img src={backArrow} alt="go back" className={styles.left} />
        </Link>
      );
      centerText = <h1 className={styles.center}>{this.props.title}</h1>;
      rightButton = (
        <button onClick={this.logOut} className={styles.right}>
          Log out
        </button>
      );
    }

    return (
      <div className={styles.container}>
        {leftButton}
        {centerText}
        {rightButton}
      </div>
    );
  }
}

export default withRouter(TopNav);
