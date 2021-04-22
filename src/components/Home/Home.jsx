import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import styles from "./Home.module.css";
import decoratingCherub from "../../images/art/decorating_cherub.png";

import BottomNav from "../BottomNav/BottomNav";
import TopNav from "../TopNav/TopNav";
import Profile from "../Profile/Profile";
import Chat from "../Chat/Chat";
import Roulette from "../Roulette/Roulette";
import Dates from "../Dates/Dates";

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
              <div className={styles.home_content}>
                <img
                  src={decoratingCherub}
                  alt={"decorating cherub"}
                  className={styles.graphic}
                />
                <h1 className={styles.home_title}>Welcome to</h1>
                <br />
                <h1 className={styles.home_title}>Connected Dating!</h1>
              </div>
            </Route>
            <Route exact path="/home/dates">
              <Dates user={this.props.user} />
            </Route>
            <Route exact path="/home/roulette">
              <Roulette user={this.props.user} />
            </Route>
            <Route exact path="/home/chat">
              <Chat user={this.props.user} />
            </Route>
            <Route exact path="/home/profile">
              <Profile user={this.props.user} />
            </Route>
          </Switch>
        </div>

        <BottomNav isShowingVideo={this.state.isShowingVideo} />
      </div>
    );
  }
}

export default Home;
