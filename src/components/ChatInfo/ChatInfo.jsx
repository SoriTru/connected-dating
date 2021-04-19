import React, { Component } from "react";

import styles from "./ChatInfo.module.css";
import profileIcon from "../../images/nav_icons/image_temp.png";

class ChatInfo extends Component {
  render() {
    return (
      <div className={styles.container}>
        <img
          src={profileIcon}
          className={styles.profile_img}
          style={{ backgroundColor: this.props.backgroundColor }}
          alt={"profile"}
        />
        <p className={styles.name}>{this.props.userName}</p>
        <p className={styles.last_msg}>{this.props.lastMessage}</p>
      </div>
    );
  }
}

export default ChatInfo;
