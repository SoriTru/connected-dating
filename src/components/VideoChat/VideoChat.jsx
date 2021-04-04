import React, { Component } from "react";
import styles from "./VideoChat.module.css";

export default class VideoChat extends Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.buttons}>
          {this.props.connectedUser ? (
            <div>
              <button onClick={async () => await this.props.startCall()}>
                start call
              </button>
              <button onClick={async () => await this.props.endCall()}>
                end call
              </button>
            </div>
          ) : (
            <div />
          )}
        </div>
        <div className={styles.remotevideo}>
          <video
            ref={this.props.setRemoteVideoRef}
            autoPlay
            playsInline
            className={styles.video}
          />
        </div>
        <div className={styles.localvideo}>
          <video
            ref={this.props.setLocalVideoRef}
            muted
            autoPlay
            playsInline
            className={styles.video}
          />
        </div>
      </div>
    );
  }
}
