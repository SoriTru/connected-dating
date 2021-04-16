import React, { Component } from "react";
import styles from "./VideoChat.module.css";
import { initiateLocalStream } from "./RTCModule";

export default class VideoChat extends Component {
  setLocalStream = (videoRef) => {
    if (!videoRef || videoRef.srcObject) {
      // no need to update if there's not a ref yet, or if there's already a local stream
      return;
    }
    initiateLocalStream().then((stream) => {
      videoRef.srcObject = stream;
      this.props.updateLocalStream(stream);
    });
  };

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.buttons}>
          {this.props.connectedUser ? (
            <div>
              {this.props.isCallStarted ? (
                <div />
              ) : (
                <button onClick={async () => await this.props.startCall()}>
                  start call
                </button>
              )}

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
            ref={this.setLocalStream}
            muted
            autoPlay
            playsInline
            className={styles.video}
          />
        </div>
        <div>
          <button onClick={async () => await this.props.matchWithUser()}>
            Match!
          </button>{" "}
        </div>
      </div>
    );
  }
}
