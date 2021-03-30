import React, { Component } from "react";
import styles from "./VideoChat.module.css";

export default class VideoChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      userToCall: "",
    };
  }

  onLoginClicked = async () => {
    await this.props.listen();
    this.setState({
      isLoggedIn: true,
    });
  };

  onStartCallClicked = () => {
    this.props.startCall(this.props.user.uid, this.state.userToCall);
  };

  renderVideos = () => {
    return (
      <div
        className={
          "temp" /*classnames('videos', { active: this.state.isLoggedIn })*/
        }
      >
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

  renderForms = () => {
    return this.state.isLoggedIn ? (
      <div key="a" className="form">
        <label>Call to</label>
        <input
          value={this.state.userToCall}
          type="text"
          onChange={(e) => this.setState({ userToCall: e.target.value })}
        />
        <button
          className={styles.button}
          onClick={this.onStartCallClicked}
          id="call-btn"
        >
          Call
        </button>
      </div>
    ) : (
      <div key="b" className="form">
        <label>Type a name</label>
        <input type="text" />

        <button
          className={styles.button}
          onClick={this.onLoginClicked}
          id="login-btn"
        >
          Login
        </button>
      </div>
    );
  };

  render() {
    return (
      <section id="container">
        {this.props.connectedUser ? null : this.renderForms()}

        {this.renderVideos()}
      </section>
    );
  }
}
