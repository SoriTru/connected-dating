import React, { Component } from "react";
import { Link } from "react-router-dom";

import styles from "./Start.module.css";

import logo from "../../images/cnd_plain_logo.png";
import cupid from "../../images/cupid.png";

class Start extends Component {
  chooseLink = (isTeam) => {
    let choice = Math.floor(Math.random() + 0.5);

    if (isTeam) {
      window.location.href =
        choice === 0
          ? "https://kathleen.connected-dating.com/#team"
          : "https://aya.connected-dating.com/#testimonials";
    } else {
      window.location.href =
        choice === 0
          ? "https://kathleen.connected-dating.com/"
          : "https://aya.connected-dating.com/";
    }
  };

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <img alt="logo" src={logo} className={styles.logo_image} />
          <h1 className={styles.title}>Get Connected</h1>
        </div>
        <div className={styles.main}>
          <img alt="cupid" src={cupid} className={styles.cupid} />
          <Link to="/signup" className={styles.button}>
            Sign Up
          </Link>
          <Link to="/login" className={styles.button}>
            Log In
          </Link>
        </div>
        <div className={styles.footer}>
          <p onClick={() => this.chooseLink(false)} className={styles.link}>
            About
          </p>
          <p
            onClick={() => {
              this.chooseLink(true);
            }}
            className={styles.link}
          >
            Our Team
          </p>
        </div>
      </div>
    );
  }
}

export default Start;
