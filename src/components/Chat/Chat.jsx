import React, { Component } from "react";
import firebase from "firebase/app";
import "firebase/firestore";

import styles from "./Chat.module.css";
import ChatInfo from "../ChatInfo/ChatInfo";
import profileImage from "../../images/nav_icons/image_temp.png";
import hands from "../../images/art/hands.png";

class Chat extends Component {
  constructor(props) {
    super(props);

    this.dummy = React.createRef();

    this.state = {
      isOverview: true,
      chatDataArray: [],
      chatBoxes: [],
      chat: "",
      formValue: "",
      messageData: [],
      otherUser: null,
    };
  }

  componentDidMount() {
    // get chat ids from user's data
    this.unsubFromChatListener = firebase
      .firestore()
      .collection("users")
      .doc(this.props.user.uid)
      .onSnapshot((doc) => {
        let data = doc.data();
        this.color = data.userData.color;
        if (data && data.chats) {
          this.populateOverviewWithChats(data.chats);
        }
      });
  }

  componentWillUnmount() {
    this.unsubFromChatListener();
  }

  handleChange = (event) => {
    this.setState({
      formValue: event.target.value,
    });
  };

  populateOverviewWithChats = (chatIds) => {
    // clear state of chats so that duplicates aren't written
    this.setState({ chatDataArray: [] });
    chatIds.forEach((chatId) => {
      firebase
        .firestore()
        .collection("chats")
        .doc(chatId)
        .get()
        .then((doc) => {
          if (doc.exists) {
            let chatDataArray = this.state.chatDataArray;
            let data = doc.data();
            // add chat id field before pushing to array
            data.id = chatId;
            chatDataArray.push(data);
            // update state with current chat data
            this.setState({ chatDataArray: chatDataArray });
          } else {
            console.log("Missing chat: " + chatId);
          }
        });
    });
  };

  renderChatOverview = () => {
    let chatDataArray = this.state.chatDataArray;

    return (
      <div>
        {chatDataArray &&
          chatDataArray.map((chat) => {
            let userData =
              chat.user1.uid === this.props.user.uid ? chat.user2 : chat.user1;

            return (
              <div
                key={chat.id}
                onClick={() => {
                  this.getMessageData(chat.id);
                  let otherUser =
                    chat.user1.uid !== this.props.user.uid
                      ? chat.user1.uid
                      : chat.user2.uid;
                  this.setState({ isOverview: false, otherUser: otherUser });
                }}
              >
                <ChatInfo
                  backgroundColor={userData.color}
                  userName={userData.name}
                  lastMessage={chat.lastMessage}
                />
              </div>
            );
          })}
      </div>
    );
  };

  getMessageData = (chatId) => {
    // set state so sendMessage function works
    this.setState({ currentChatId: chatId });

    // get message data from firebase
    // Snapshot updates on new data added
    firebase
      .firestore()
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .orderBy("createdAt")
      .limit(25)
      .onSnapshot((snapshot) => {
        let messages = [];
        snapshot.docs.forEach((doc) => {
          let messageData = doc.data();
          messageData.id = doc.id;

          messages.push(messageData);
        });

        this.setState({ messageData: messages });
      });
  };

  renderMessages = () => {
    let messages = this.state.messageData;

    return (
      <div className={styles.message_container}>
        {messages &&
          messages.map((msg) => {
            const { text, uid, color } = msg;

            const messageClass =
              uid === this.props.user.uid ? styles.sent : styles.received;

            return (
              <div key={msg.id} className={`${styles.message} ${messageClass}`}>
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
    );
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
        color: this.color,
      });

      // set last message
      await firebase
        .firestore()
        .collection("chats")
        .doc(this.state.currentChatId)
        .update({ lastMessage: this.state.formValue });

      this.dummy.current.scrollIntoView({ behavior: "smooth" });
      this.setState({ formValue: "" });
    }
  };

  matchWithUser = async () => {
    if (!this.state.otherUser) {
      return;
    }

    await firebase
      .firestore()
      .collection("users")
      .doc(this.state.otherUser)
      .update({
        finalMatch: firebase.firestore.FieldValue.arrayUnion(
          this.props.user.uid
        ),
      });

    alert(
      "Match request sent! Once the other party confirms, the QR functionality will work for your final match."
    );
  };

  render() {
    if (this.state.isOverview) {
      return (
        <div className={styles.overview_container}>
          <div className={styles.chat_overview}>
            {this.renderChatOverview()}
          </div>
          <img
            src={hands}
            alt={"hands holding heart"}
            className={styles.graphic}
          />
        </div>
      );
    }

    // return a specific chat
    return (
      <div className={styles.chat_box}>
        <div className={styles.button_area}>
          <button
            onClick={() => {
              this.setState({ isOverview: true, otherUser: null });
            }}
          >
            Go Back
          </button>
          <button onClick={this.matchWithUser}>Match!</button>
        </div>
        <div className={styles.overflow_container}>
          {this.state.messageData && this.renderMessages()}
        </div>
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
