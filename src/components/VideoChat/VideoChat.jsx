import React, { Component } from "react";

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
              click me to start call
            </button>
          ) : (
            <div></div>
          )}

          <video ref={this.props.setLocalVideoRef} muted autoPlay playsInline />
        </div>
        <div>
          <video ref={this.props.setRemoteVideoRef} autoPlay playsInline />
        </div>
      </div>
    );
  }
}
