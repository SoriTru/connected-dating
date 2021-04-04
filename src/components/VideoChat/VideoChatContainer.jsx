import React, { Component } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import "webrtc-adapter";

import VideoChat from "./VideoChat";
import {
  createOffer,
  initiateConnection,
  initiateLocalStream,
  listenToConnectionEvents,
  sendAnswer,
  beginCall,
  addCandidate,
} from "./RTCModule";

import {
  clearNotifs,
  doAnswer,
  doCandidate,
  doEndCall,
  doOffer,
  notifListen,
} from "./FirebaseModule";

class VideoChatContainer extends Component {
  notifsRef = firebase.firestore().collection("notifs");

  constructor(props) {
    super(props);

    this.state = {
      localStream: null,
      localConnection: null,
    };

    this.remoteVideoRef = React.createRef();
  }

  componentDidMount = async () => {
    // create the local connection
    const localConnection = await initiateConnection();
    this.setState({
      localConnection: localConnection,
    });

    this.unsubFromNotifs = await notifListen(
      this.props.user.uid,
      this.handleUpdate,
      this.notifsRef
    );
  };

  componentWillUnmount = async () => {
    // alert other user of end call
    const otherUser = this.props.otherUser;
    if (otherUser != null && otherUser !== "") {
      // we are actually connected (not just pending), so we should try to disconnect
      await doEndCall(this.props.user.uid, otherUser, this.notifsRef);
    }

    // remove audio and video stream
    this.state.localStream &&
      this.state.localStream.getTracks().forEach(function (track) {
        track.stop();
      });

    // close rtc connection
    await this.state.localConnection.close();

    this.unsubFromNotifs();

    // delete any leftover notifications
    await clearNotifs(this.props.user.uid, this.notifsRef);
  };

  shouldComponentUpdate(nextProps, nextState) {
    // only time to re-render is if we add or drop a remote connection
    return this.props.otherUser !== nextProps.otherUser;
  }

  initiateCall = async () => {
    const fromUid = this.props.user.uid;
    const toUid = this.props.otherUser;
    // listen to the events first
    listenToConnectionEvents(
      this.state.localConnection,
      fromUid,
      toUid,
      this.remoteVideoRef,
      this.notifsRef,
      doCandidate
    );

    // create a new offer
    await createOffer(
      this.state.localConnection,
      this.state.localStream,
      toUid,
      doOffer,
      this.notifsRef,
      fromUid
    );
  };

  setLocalVideoRef = async (ref) => {
    if (!ref) {
      return;
    }

    // if the local media stream hasn't been initiated yet, do so and store it
    // for subsequent video chats on this roulette
    const localStream = this.state.localStream
      ? this.state.localStream
      : await initiateLocalStream();
    if (!this.state.localStream) {
      this.setState({ localStream: localStream });
    }

    // pass this media stream back to the <video> element
    ref.srcObject = this.state.localStream;
  };

  setRemoteVideoRef = (ref) => {
    this.remoteVideoRef = ref;
  };

  handleUpdate = (notif, fromUid) => {
    if (notif) {
      switch (notif.type) {
        case "offer":
          // let Roulette know we are connected, and to whom. This makes props propagate correctly
          this.props.connectCallback(notif.from);
          // listen to the connection events
          listenToConnectionEvents(
            this.state.localConnection,
            fromUid,
            notif.from,
            this.remoteVideoRef,
            this.notifsRef,
            doCandidate
          );

          // send answer
          sendAnswer(
            this.state.localConnection,
            this.state.localStream,
            notif,
            this.notifsRef,
            doAnswer,
            fromUid
          );
          break;
        case "answer":
          //start the call
          beginCall(this.state.localConnection, notif);
          break;
        case "candidate":
          // add candidate to our connection
          addCandidate(this.state.localConnection, notif);
          break;
        case "terminate":
          this.props.endVideoCall();
          break;
        default:
          // nothing happens here
          break;
      }
    }
  };

  render() {
    return (
      <VideoChat
        startCall={this.initiateCall}
        setLocalVideoRef={this.setLocalVideoRef}
        setRemoteVideoRef={this.setRemoteVideoRef}
        connectedUser={this.props.otherUser}
        user={this.props.user}
        endCall={this.props.endVideoCall}
      />
    );
  }
}

export default VideoChatContainer;
