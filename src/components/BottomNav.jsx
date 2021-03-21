import React, { Component } from "react";
import { Link } from "react-router-dom";

import styles from "../styles/BottomNav.module.css";

import dateIcon from "../images/nav_icons/cnd_nav_date.png";
import videoIcon from "../images/nav_icons/cnd_nav_video.png";
import homeIcon from "../images/nav_icons/cnd_nav_home.png";
import chatIcon from "../images/nav_icons/cnd_nav_chat.png";
import profileIcon from "../images/nav_icons/cnd_nav_profile.png";

class BottomNav extends Component {
  render() {
    return (
      <div className={styles.nav_container}>
        <Link to="/date" className={styles.nav_item}>
          <img src={dateIcon} className={styles.icon} alt="Date" />
        </Link>
        <Link to="/video" className={styles.nav_item}>
          <img src={videoIcon} className={styles.icon} alt="Video" />
        </Link>
        <Link to="/" className={styles.nav_item}>
          <img src={homeIcon} className={styles.icon} alt="Home" />
        </Link>
        <Link to="/chat" className={styles.nav_item}>
          <img src={chatIcon} className={styles.icon} alt="Chat" />
        </Link>
        <Link to="/profile" className={styles.nav_item}>
          <img src={profileIcon} className={styles.icon} alt="Profile" />
        </Link>
      </div>
    );
  }
}

export default BottomNav;
