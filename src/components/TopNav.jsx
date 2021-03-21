import React, { Component } from "react";

import styles from "../styles/TopNav.module.css";

import backArrow from "../images/backarrow.png";

class TopNav extends Component {
  render() {
    return (
      <div>
        <img src={backArrow} alt="back" className={styles.back_arrow} />
      </div>
    );
  }
}

export default TopNav;
