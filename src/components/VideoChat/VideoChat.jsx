import React, { Component } from "react";
import styles from "./VideoChat.module.css";

export default class VideoChat extends Component {
  componentDidMount = async () => {
    if (this.props.matchedUser) {
      await this.props.startCall(this.props.user.uid, this.props.matchedUser);
    }
  };

  renderVideos = () => {
    return (
      <div>
        <div>
          <label>{this.props.user.uid}</label>

          <video ref={this.props.setLocalVideoRef} autoPlay playsInline />
        </div>
        <div>
          <label>{this.props.connectedUser}</label>
          <video ref={this.props.setRemoteVideoRef} autoPlay playsInline />
        </div>
      </div>
    );
  };

  render() {
    return <section id="container">{this.renderVideos()}</section>;
  }
}
