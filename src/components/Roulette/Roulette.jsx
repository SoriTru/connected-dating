import React, { Component } from "react";
import firebase from "firebase/app";
import "firebase/firestore";

import { addUserToQueue } from "./FirebaseModule";

class Roulette extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firestore: firebase.firestore(),
      firestoreFieldValue: firebase.firestore.FieldValue,
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
  };

  render() {
    return <div></div>;
  }
}

export default Roulette;
