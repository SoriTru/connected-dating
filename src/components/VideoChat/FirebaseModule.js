export const notifListen = async (uid, handleUpdate, notifsRef) => {
  // set up snapshot to listen for changes to connection things
  return await notifsRef.doc(uid).onSnapshot((snapshot) => {
    snapshot.exists && handleUpdate(snapshot.data(), uid);
  });
};

export const doOffer = async (toUid, offer, fromUid, notifsRef) => {
  await notifsRef
    .doc(toUid)
    .set({ type: "offer", from: fromUid, offer: JSON.stringify(offer) });
};

export const doAnswer = async (toUid, answer, fromUid, notifsRef) => {
  await notifsRef
    .doc(toUid)
    .set(
      { type: "answer", from: fromUid, answer: JSON.stringify(answer) },
      { merge: true }
    );
};

export const doCandidate = async (toUid, candidate, fromUid, notifsRef) => {
  // send the new candidate to the peer
  await notifsRef.doc(toUid).set({
    type: "candidate",
    from: fromUid,
    candidate: JSON.stringify(candidate),
  });
};

export const doEndCall = async (fromUid, toUid, notifsRef) => {
  if (toUid == null) {
    console.error(
      "Tried to doEndCall() with null toUid. Did a component get unmounted too early?"
    );
    return;
  }
  // alert other user that call is ending
  await notifsRef.doc(toUid).set({
    type: "terminate",
    from: fromUid,
  });
};

export const clearNotifs = async (uid, notifsRef) => {
  await notifsRef.doc(uid).delete();
};
