import React, { Component } from "react";
import { Link } from "react-router-dom";

import styles from "../styles/BottomNav.module.css";

class BottomNav extends Component {
  render() {
    return (
      <div className={styles.nav_container}>
        <Link to="/date" className={styles.nav_item}>
          D
        </Link>
        <Link to="/roulette" className={styles.nav_item}>
          R
        </Link>
        <Link to="/" className={styles.nav_item}>
          H
        </Link>
        <Link to="/chat" className={styles.nav_item}>
          C
        </Link>
        <Link to="/profile" className={styles.nav_item}>
          P
        </Link>
      </div>
    );
  }
}

export default BottomNav;
