import firebase from "firebase/app";
const fieldValue = firebase.firestore.FieldValue;

export const addUserToQueue = async (uid, firestore) => {
  // remove user from listening to notifs
  await firestore.collection("notifs").doc(uid).delete();

  // get user data
  let userData = await firestore.collection("users").doc(uid).get();

  if (userData.exists) {
    // add user data to firebase match collection
    let queueUpdate = { queue: fieldValue.arrayUnion(uid) };
    queueUpdate[`user_data.${uid}`] = userData.data().userData;

    await firestore
      .collection("match")
      .doc("north_america")
      .update(queueUpdate);
  } else {
    console.warn("Unable to add user to queue!");
    alert("Must set up profile first! Please navigate to /signup");
  }
};

export const listenToQueue = async (uid, firestore, handleQueueChange) => {
  // listen to changes in the queue
  return await firestore
    .collection("match")
    .doc("north_america")
    .onSnapshot((snapshot) => {
      snapshot.exists && handleQueueChange(snapshot.data());
    });
};

export const removeUserFromQueue = async (uid, firestore) => {
  let queueUpdate = { queue: fieldValue.arrayRemove(uid) };
  queueUpdate[`user_data.${uid}`] = fieldValue.delete();

  await firestore.collection("match").doc("north_america").update(queueUpdate);
};

export const initiateChat = async (uid, otherUser, firestore) => {
  // get data for both users
  let user1 = await firestore.collection("users").doc(uid).get();
  let user2 = await firestore.collection("users").doc(otherUser).get();

  if (user1.exists && user2.exists) {
    // set chat data
    let chatData = {
      lastMessage: "Chat initiated",
      user1: {
        color: user1.data().userData.color,
        name: user1.data().userData.first_name,
        uid: uid,
      },
      user2: {
        color: user2.data().userData.color,
        name: user2.data().userData.first_name,
        uid: otherUser,
      },
    };

    // create new chat entry, using concatenation of userids for id
    let chatId = uid < otherUser ? uid + otherUser : otherUser + uid;
    await firestore.collection("chats").doc(chatId).set(chatData);

    // update chat id for both users
    let chatUpdate = { chats: fieldValue.arrayUnion(chatId) };
    await firestore.collection("users").doc(uid).update(chatUpdate);
    await firestore.collection("users").doc(otherUser).update(chatUpdate);
  }
};
