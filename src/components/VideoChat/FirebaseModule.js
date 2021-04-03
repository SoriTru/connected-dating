export const listen = async (uid, handleUpdate, notifsRef) => {
  // set up snapshot to listen for changes to connection things
  notifsRef.doc(uid).onSnapshot((snapshot) => {
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
  // alert other user that call is ending
  await notifsRef.doc(toUid).set({
    type: "terminate",
    from: fromUid,
  });
};
