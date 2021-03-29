import React, { Component } from "react";
import firebase from "firebase/app";
import "firebase/firestore";

import styles from "./Chat.module.css";
import ChatInfo from "../ChatInfo/ChatInfo";
import profileImage from "../../images/nav_icons/cnd_nav_profile.png";

class Chat extends Component {
  constructor(props) {
    super(props);

    this.dummy = React.createRef();

    this.state = {
      isOverview: true,
      chatIds: [],
      chatBoxes: [],
      chat: "",
      formValue: "",
    };
  }

  componentDidMount() {
    const firestore = firebase.firestore();
    const userDataRef = firestore.collection("users").doc("defaultID");
    userDataRef.onSnapshot((doc) => {
      let data = doc.data();
      if (data && data.chats) {
        this.setState({ chatIds: data.chats, chatBoxes: [] });
        this.populateOverviewWithChats();
      }
    });
  }

  handleChange = (event) => {
    this.setState({
      formValue: event.target.value,
    });
  };

  populateOverviewWithChats = () => {
    this.state.chatIds.forEach((chatId) => {
      firebase
        .firestore()
        .collection("chats")
        .doc(chatId)
        .get()
        .then((doc) => {
          if (doc.exists) {
            let data = doc.data();
            // get other userid
            let userData =
              data.user1.uid === this.props.user.uid ? data.user2 : data.user1;

            let chatBoxes = this.state.chatBoxes;

            chatBoxes.push(
              <div key={chatId} onClick={() => this.displayChat(chatId)}>
                <ChatInfo
                  backgroundColor={userData.color}
                  userName={userData.name}
                  lastMessage={data.lastMessage}
                />
              </div>
            );

            this.setState({ chatBoxes: chatBoxes });
          } else {
            console.log("Missing chat: " + chatId);
          }
        });
    });
  };

  displayChat = (chatId) => {
    this.setState({ currentChatId: chatId });

    const messagesRef = firebase
      .firestore()
      .collection("chats")
      .doc(chatId)
      .collection("messages");

    const query = messagesRef.orderBy("createdAt").limit(25);
    query.onSnapshot((snapshot) => {
      let messages = [];
      snapshot.docs.forEach((doc) => {
        let messageData = doc.data();
        messageData.id = doc.id;

        messages.push(messageData);
      });

      let content = (
        <div className={styles.message_container}>
          <div className={styles.main}>
            {messages &&
              messages.map((msg) => {
                const { text, uid, color } = msg;

                const messageClass =
                  uid === this.props.user.uid ? styles.sent : styles.received;

                return (
                  <div
                    key={msg.id}
                    className={`${styles.message} ${messageClass}`}
                  >
                    <img
                      alt={"profile icon"}
                      src={profileImage}
                      className={styles.profile_image}
                      style={{ backgroundColor: color }}
                    />
                    <p className={styles.message_text}>{text}</p>
                  </div>
                );
              })}
            <span ref={this.dummy} />
          </div>
        </div>
      );

      this.setState({ chat: content, isOverview: false });
    });
  };

  sendMessage = async (event) => {
    event.preventDefault();

    const messagesRef = firebase
      .firestore()
      .collection("chats")
      .doc(this.state.currentChatId)
      .collection("messages");

    if (this.state.formValue.length > 0) {
      await messagesRef.add({
        text: this.state.formValue,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid: this.props.user.uid,
        color: "red",
        // TODO: change color to firebase photoURL, and set that accordingly
      });

      this.dummy.current.scrollIntoView({ behavior: "smooth" });
      this.setState({ formValue: "" });
    }
  };

  render() {
    if (this.state.isOverview) {
      return <div className={styles.chat_box}>{this.state.chatBoxes}</div>;
    }

    // return a specific chat
    return (
      <div className={styles.chat_box}>
        {this.state.chat}
        <form onSubmit={this.sendMessage} className={styles.text_form}>
          <input
            className={styles.form_input}
            value={this.state.formValue}
            onChange={this.handleChange}
            placeholder={"say something nice"}
          />
          <button className={styles.form_submit} type={"submit"}>
            🕊️
          </button>
        </form>
      </div>
    );
  }
}

export default Chat;
