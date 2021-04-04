import React, { Component } from "react";
import firebase from "firebase/app";
import "firebase/firestore";

import {
  addUserToQueue,
  listenToQueue,
  removeUserFromQueue,
} from "./FirebaseModule";
import VideoChatContainer from "../VideoChat/VideoChatContainer";

class Roulette extends Component {
  constructor(props) {
    super(props);

    this.state = {
      matchTitle: "Awaiting match...",
      matchedUser: null,
      pendingConn: false,
    };
    this.firestore = firebase.firestore();
    this.decisionMillis = null;
  }

  componentDidMount = async () => {
    // add user to firebase queue
    await addUserToQueue(this.props.user.uid, this.firestore);

    // listen to queue changes and do matching
    this.unsubFromQueueListener = await listenToQueue(
      this.props.user.uid,
      this.firestore,
      this.handleQueueChange
    );
  };

  componentWillUnmount = async () => {
    // Stop listening for updates to prevent updating an unmounted component after
    // we remove ourselves from the queue
    await this.unsubFromQueueListener();
    // remove user from firebase queue
    await removeUserFromQueue(this.props.user.uid, this.firestore);
  };

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return (
      this.state.matchTitle !== nextState.matchTitle ||
      this.state.matchedUser !== nextState.matchedUser ||
      this.pendingConn !== nextState.pendingConn
    );
  }

  handleQueueChange = async (queueData) => {
    // if user is matched, do nothing
    if (this.state.matchedUser != null) {
      return;
    }

    // if user is not in queue, assume user is being matched
    if (!queueData.queue.includes(this.props.user.uid)) {
      this.setState({ pendingConn: true });
      return;
    }

    // if user is not at the top of the queue, do nothing
    if (queueData.queue[0] !== this.props.user.uid) {
      return;
    }

    const waitTime = 5 * 1000;
    if (this.decisionMillis == null) {
      console.log("reset decision millis (was null)");
      this.decisionMillis = new Date().getTime() + waitTime;
    }

    // if user is the only one in the queue, alert user and do nothing
    if (queueData.queue.length === 1) {
      this.setState({
        matchTitle: "You are the only user online!",
      });
      return;
    } else {
      this.setState({
        matchTitle: "Awaiting match...",
      });
    }

    if (this.cancelQueueInterval) {
      clearTimeout(this.cancelQueueInterval);
    }
    this.cancelQueueInterval = setTimeout(
      () => this.handleQueueChange(queueData),
      this.decisionMillis - new Date().getTime()
    );

    this.findMatch(queueData).then((match) => {
      const currentTime = new Date().getTime();
      if (currentTime > this.decisionMillis) {
        console.log("starting a call with: ", match);
        this.startCall(match);
        this.decisionMillis = null;
        clearTimeout(this.cancelQueueInterval);
      }
    });
  };

  findMatch = async (queueData) => {
    console.log("entering findMatch with ", queueData);
    // calculate best match from users in queue
    let potentialMatches = queueData.queue.slice(1);

    let currentUserData = queueData.user_data[this.props.user.uid];

    let bestMatch = potentialMatches[0];
    let highestPoints = 0;

    for (let i = 0; i < potentialMatches.length; i++) {
      // calculate match points
      let matchUserData = queueData.user_data[potentialMatches[i]];
      let points = await this.calculatePointTotal(
        currentUserData,
        matchUserData
      );

      // compare to highest points and update accordingly
      if (points > highestPoints) {
        bestMatch = potentialMatches[i];
        highestPoints = points;
      }
    }
    return bestMatch;
  };

  async startCall(bestMatch) {
    // match with user and start video call
    this.setState({ matchedUser: bestMatch });
    await this.startVideoCall(bestMatch);
  }

  calculatePointTotal = async (currentUserData, matchUserData) => {
    let points = 0;

    // more points added if closer to birth year, 5 max
    let birthYearDifference =
      matchUserData.birthdate - currentUserData.birthdate;
    if (birthYearDifference < 5) {
      points += 5 - birthYearDifference;
    }

    // 3 points for each coinciding interest
    const sharedInterests = currentUserData.interests.filter((interest) =>
      matchUserData.interests.includes(interest)
    );
    points += sharedInterests.length * 3;

    // 40 points for 'gender' and 'looking for' matching up
    if (
      currentUserData.looking_for === matchUserData.gender &&
      currentUserData.gender === matchUserData.looking_for
    ) {
      points += 40;
    }

    // extra points for being in the same zipcode
    if (currentUserData.zipcode === matchUserData.zipcode) {
      points += 20;
    } else {
      // add points based on distance -> closer distance = more points
      const ZIP_API_KEY = process.env.REACT_APP_ZIPCODE_API_KEY;
      const zip_response = await fetch(
        `https://api.zip-codes.com/ZipCodesAPI.svc/1.0/CalculateDistance/ByZip?fromzipcode=${currentUserData.zipcode}&tozipcode=${matchUserData.zipcode}&key=<${ZIP_API_KEY}`
      );
      const distanceData = await zip_response.json();

      // only get points for distance if within 150 miles
      if (distanceData.DistanceInMiles && distanceData.DistanceInMiles < 150) {
        // max points for distance: 15
        points += Math.floor((distanceData.DistanceInMiles / 150) * 15);
      }
    }

    // return calculated points
    return points;
  };

  startVideoCall = async (matchUid) => {
    // remove matched user from queue
    await removeUserFromQueue(matchUid, this.firestore);

    // remove current user from queue
    await removeUserFromQueue(this.props.user.uid, this.firestore);

    // start video call
    this.setState({
      matchedUser: matchUid,
    });
  };

  endVideoCall = async () => {
    this.setState({
      matchedUser: null,
      pendingConn: false,
    });

    await addUserToQueue(this.props.user.uid, this.firestore);
  };

  onConnectionMade = (otherUid) => {
    console.log(`VideoChatContainer made connection to ${otherUid}`);
    this.setState({ matchedUser: otherUid });
  };

  render() {
    if (this.state.matchedUser != null || this.state.pendingConn === true) {
      return (
        <VideoChatContainer
          user={this.props.user}
          otherUser={this.state.matchedUser}
          endVideoCall={this.endVideoCall}
          connectCallback={this.onConnectionMade}
        />
      );
    }

    return <div>{this.state.matchTitle}</div>;
  }
}

export default Roulette;
