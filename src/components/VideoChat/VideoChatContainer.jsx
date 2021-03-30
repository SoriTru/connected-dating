import React, { Component } from "react";
import firebase from "firebase/app";
import "firebase/firestore";

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

import { doAnswer, doCandidate, doOffer, listen } from "./FirebaseModule";

class VideoChatContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      localStream: null,
      localConnection: null,
      connectedUser: "",
      firebaseRef: firebase.firestore().collection("notifs"),
    };

    this.localVideoRef = React.createRef();
    this.remoteVideoRef = React.createRef();
  }
  componentDidMount = async () => {
    // get local video stream
    const localStream = await initiateLocalStream();
    this.localVideoRef.srcObject = localStream;

    // create the local connection
    const localConnection = await initiateConnection();
    this.setState({
      localStream: localStream,
      localConnection: localConnection,
    });
  };

  shouldComponentUpdate(nextProps, nextState) {
    // prevent rerenders if not necessary
    if (this.state.localStream !== nextState.localStream) {
      return false;
    }

    if (this.state.localConnection !== nextState.localConnection) {
      return false;
    }

    return true;
  }

  initiateCall = async (fromUid, toUid) => {
    // listen to the events first
    listenToConnectionEvents(
      this.state.localConnection,
      fromUid,
      toUid,
      this.remoteVideoRef,
      this.state.firebaseRef,
      doCandidate
    );

    // create a new offer
    await createOffer(
      this.state.localConnection,
      this.state.localStream,
      toUid,
      doOffer,
      this.state.firebaseRef,
      fromUid
    );
  };

  listen = async () => {
    await listen(
      this.props.user.uid,
      this.handleUpdate,
      this.state.firebaseRef
    );
  };

  setLocalVideoRef = (ref) => {
    this.localVideoRef = ref;
  };

  setRemoteVideoRef = (ref) => {
    this.remoteVideoRef = ref;
  };

  handleUpdate = (notif, fromUid) => {
    console.log(notif);
    if (notif) {
      switch (notif.type) {
        case "offer":
          this.setState({
            connectedUser: notif.from,
          });
          // listen to the connection events
          listenToConnectionEvents(
            this.state.localConnection,
            fromUid,
            notif.from,
            this.remoteVideoRef,
            this.state.firebaseRef,
            doCandidate
          );

          // send answer
          sendAnswer(
            this.state.localConnection,
            this.state.localStream,
            notif,
            this.state.firebaseRef,
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
        listen={this.listen}
        setLocalVideoRef={this.setLocalVideoRef}
        setRemoteVideoRef={this.setRemoteVideoRef}
        connectedUser={this.state.connectedUser}
        user={this.props.user}
      />
    );
  }
}

export default VideoChatContainer;
