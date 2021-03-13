import React, { Component } from "react";

import styles from "../styles/BottomNav.module.css";

class BottomNav extends Component {
  render() {
    return (
      <div className={styles.nav_container}>
        <div className={styles.nav_item}></div>
        <div className={styles.nav_item}></div>
        <div className={styles.nav_item}></div>
        <div className={styles.nav_item}></div>
        <div className={styles.nav_item}></div>
      </div>
    );
  }
}
