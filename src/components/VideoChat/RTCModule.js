export const createOffer = async (
  connection,
  localStream,
  toUid,
  doOffer,
  firebaseRef,
  fromUid
) => {
  try {
    connection.addStream(localStream);

    const offer = await connection.createOffer();
    await connection.setLocalDescription(offer);

    doOffer(toUid, offer, fromUid, firebaseRef);
  } catch (exception) {
    console.error(exception);
  }
};

export const initiateLocalStream = async () => {
  try {
    return await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
  } catch (exception) {
    console.error(exception);
  }
};

export const initiateConnection = async () => {
  try {
    // create a connection
    // using Google public stun server
    const configuration = {
      iceServers: [{ urls: "stun:stun2.1.google.com:19302" }],
    };

    return new RTCPeerConnection(configuration);
  } catch (exception) {
    console.error(exception);
  }
};

export const listenToConnectionEvents = (
  conn,
  fromUid,
  toUid,
  remoteVideoRef,
  firebaseRef,
  doCandidate
) => {
  // listen for ice candidates
  conn.onicecandidate = function (event) {
    if (event.candidate) {
      doCandidate(toUid, event.candidate, fromUid, firebaseRef);
    }
  };
  // when a remote user adds stream to the peer connection, we display it
  conn.ontrack = function (event) {
    if (remoteVideoRef.srcObject !== event.streams[0]) {
      remoteVideoRef.srcObject = event.streams[0];
    }
  };
};

export const sendAnswer = async (
  conn,
  localStream,
  notif,
  firebaseRef,
  doAnswer,
  fromUid
) => {
  try {
    // add the localstream to the connection
    conn.addStream(localStream);

    // set the remote and local descriptions and create an answer
    const offer = JSON.parse(notif.offer);
    conn.setRemoteDescription(offer);

    // create an answer to an offer
    const answer = await conn.createAnswer();
    conn.setLocalDescription(answer);

    // send answer to the other peer
    doAnswer(notif.from, answer, fromUid, firebaseRef);
  } catch (exception) {
    console.error(exception);
  }
};

export const beginCall = (conn, notif) => {
  // it should be called when we
  // received an answer from other peer to start the call
  // and set remote the description
  const answer = JSON.parse(notif.answer);
  conn.setRemoteDescription(answer);
};

export const addCandidate = (conn, notif) => {
  // apply the new received candidate to the connection
  const candidate = JSON.parse(notif.candidate);
  conn.addIceCandidate(new RTCIceCandidate(candidate));
};
