import React, { Component } from "react";
import styles from "./VideoChat.module.css";

export default class VideoChat extends Component {
  render() {
    return (
      <div>
        <div>
          {this.props.connectedUser ? (
            <button
              onClick={async () =>
                await this.props.startCall(
                  this.props.user.uid,
                  this.props.connectedUser
                )
              }
            >
              {" "}
              click me to start call
            </button>
          ) : (
            <div></div>
          )}

          <label>{this.props.user.uid}</label>
          <video ref={this.props.setLocalVideoRef} autoPlay playsInline />
        </div>
        <div>
          <label>{this.props.connectedUser}</label>
          <video ref={this.props.setRemoteVideoRef} autoPlay playsInline />
        </div>
      </div>
    );
  }
}
