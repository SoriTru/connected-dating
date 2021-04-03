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
      firestore: firebase.firestore(),
      firestoreFieldValue: firebase.firestore.FieldValue,
      isMatched: false,
      matchTitle: "Awaiting match...",
      matchedUser: null,
      unsubscribeFromSnapshot: null,
    };
  }
  componentDidMount = async () => {
    // add user to firebase queue
    await addUserToQueue(
      this.props.user.uid,
      this.state.firestore,
      this.state.firestoreFieldValue
    );

    // listen to queue changes and do matching
    this.state.unsubscribeFromSnapshot = await listenToQueue(
      this.props.user.uid,
      this.state.firestore,
      this.handleQueueChange
    );
  };

  componentWillUnmount = async () => {
    // remove user from firebase queue
    await removeUserFromQueue(
      this.props.user.uid,
      this.state.firestore,
      this.state.firestoreFieldValue
    );

    this.state.unsubscribeFromSnapshot();
  };

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    // prevent unnecessary rerenders
    if (this.state.firestore !== nextState.firestore) {
      return false;
    }
    return true;
  }

  handleQueueChange = async (queueData) => {
    // if user is matched, do nothing
    if (this.state.isMatched) {
      return;
    }

    // if user is not in queue, assume user is matched
    if (!queueData.queue.includes(this.props.user.uid)) {
      this.setState({ isMatched: true });
      return;
    }

    // if user is not at the top of the queue, do nothing
    if (queueData.queue[0] !== this.props.user.uid) {
      return;
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

    // match with user and start video call
    await this.startVideoCall(bestMatch);
  };

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
    // set state to matched so that handleQueue doesn't run again
    this.setState({
      isMatched: true,
    });

    // remove matched user from queue
    await removeUserFromQueue(
      matchUid,
      this.state.firestore,
      this.state.firestoreFieldValue
    );

    // remove current user from queue
    await removeUserFromQueue(
      this.props.user.uid,
      this.state.firestore,
      this.state.firestoreFieldValue
    );

    // start video call
    this.setState({
      isMatched: true,
      matchedUser: matchUid,
    });
  };

  endVideoCall = async () => {
    this.setState({
      isMatched: false,
    });

    await addUserToQueue(
      this.props.user.uid,
      this.state.firestore,
      this.state.firestoreFieldValue
    );
  };

  render() {
    return (
      <VideoChatContainer
        user={this.props.user}
        matched={this.state.isMatched}
        matchTitle={this.state.matchTitle}
        matchedUser={this.state.matchedUser}
        endVideoCall={this.endVideoCall}
      />
    );
  }
}

export default Roulette;
