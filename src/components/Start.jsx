import React, { Component } from "react";
import { Link } from "react-router-dom";

import commonStyles from "../styles/Common.module.css";
import styles from "../styles/Start.module.css";

import logo from "../images/cnd_plain_logo.png";

class Start extends Component {
  render() {
    return (
      <div className={commonStyles.container}>
        <div className={commonStyles.main}>
          {/* logo */}
          <img
            alt="remove me and put a logo here"
            src={logo}
            className={styles.logo_image}
          />

          <Link to="/signup" className={styles.button}>
            Sign Up
          </Link>
          <Link to="/login" className={styles.button}>
            Log In
          </Link>
        </div>
        <div className={styles.footer}>
          <Link to="/about" className={styles.link}>
            About
          </Link>
          <Link to="/terms" className={styles.link}>
            Terms
          </Link>
        </div>
      </div>
    );
  }
}

export default Start;
