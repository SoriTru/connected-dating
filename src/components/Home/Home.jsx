import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import styles from "./Home.module.css";

import BottomNav from "../BottomNav/BottomNav";
import TopNav from "../TopNav/TopNav";
import Profile from "../Profile/Profile";
import Chat from "../Chat/Chat";
import VideoChatContainer from "../VideoChat/VideoChatContainer";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      path: window.location.pathname,
      title: "Home",
      isShowingVideo: false,
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log(window.location.pathname);
  }

  render() {
    return (
      <div className={styles.container}>
        <TopNav path={this.state.path} title={this.state.title} />
        <div className={styles.main}>
          <Switch>
            <Route exact path="/home">
              Home
            </Route>
            <Route exact path="/home/dates">
              Dates
            </Route>
            <Route exact path="/home/video">
              <VideoChatContainer user={this.props.user} />
            </Route>
            <Route exact path="/home/chat">
              <Chat user={this.props.user} />
            </Route>
            <Route exact path="/home/profile">
              <Profile />
            </Route>
          </Switch>
        </div>

        <BottomNav isShowingVideo={this.state.isShowingVideo} />
      </div>
    );
  }
}

export default Home;
