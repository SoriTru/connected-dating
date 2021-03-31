export const addUserToQueue = async (uid, firestore) => {
  let matchData = await firestore
    .collection("match")
    .doc("north_america")
    .get();
  let userData = await firestore.collection("users").doc(uid).get();

  if (matchData.exists && userData.exists) {
    // get queue and user data
    let queue = matchData.queue;
    // append user id and user data
    queue.append(uid);

    // add user data
    await matchRef.update({});

    // update document with new queue
    // NOTE: I'm not sure how firebase will handle multiple updates at the same time,
    // so this could result in errors
    await matchRef.update({
      queue: queue,
    });
  }
};

export const listenToQueue = async (uid, matchRef) => {};
