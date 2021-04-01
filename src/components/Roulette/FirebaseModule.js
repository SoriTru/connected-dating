export const addUserToQueue = async (uid, firestore, fieldValue) => {
  // get user data
  let userData = await firestore.collection("users").doc(uid).get();

  if (userData.exists) {
    // add user data to firebase match colelction
    let matchUpdate = { queue: fieldValue.arrayUnion(uid) };
    matchUpdate[`user_data.${uid}`] = userData.data().userData;

    await firestore
      .collection("match")
      .doc("north_america")
      .update(matchUpdate);

    // NOTE: I'm not sure how firebase will handle multiple updates at the same time,
    // so this could result in errors
  } else {
    console.warn("Unable to add user to queue!");
  }
};

export const listenToQueue = async (uid, matchRef) => {};
