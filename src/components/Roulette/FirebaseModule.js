import firebase from "firebase/app";
const fieldValue = firebase.firestore.FieldValue;

export const addUserToQueue = async (uid, firestore) => {
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

    // NOTE: I'm not sure how firebase will handle multiple updates at the same time,
    // so this could result in errors
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
