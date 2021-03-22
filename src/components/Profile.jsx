import React, { Component } from "react";

import styles from "../styles/Profile.module.css";
import profileImage from "../images/nav_icons/cnd_nav_profile.png";

class Profile extends Component {
  render() {
    return (
      <div className={styles.profile_container}>
        <img src={profileImage} alt="profile" className={styles.profile_pic} />
        <p className={styles.name}>
          Name <br />
          Town, ST
        </p>
        <p className={styles.basic}>Age / G / O</p>
      </div>
    );
  }
}

export default Profile;
