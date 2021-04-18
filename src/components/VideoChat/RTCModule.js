export const createOffer = async (
  connection,
  localStream,
  toUid,
  doOffer,
  firebaseRef,
  fromUid
) => {
  try {
    if (!connection.localDescription) {
      for (const track of localStream.getTracks()) {
        connection.addTrack(track, localStream);
      }
    }

    const offer = await connection.createOffer();
    await connection.setLocalDescription(offer);

    doOffer(toUid, offer, fromUid, firebaseRef);
  } catch (exception) {
    console.error(exception);
  }
};

export const initiateLocalStream = () => {
  try {
    return navigator.mediaDevices.getUserMedia({
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
      iceServers: [
        { url: ["stun:stun.1.google.com:19302"] },
        { url: "stun:stun.l.google.com:19302" },
        { url: "stun:stun1.l.google.com:19302" },
        { url: "stun:stun2.l.google.com:19302" },
        { url: "stun:stun3.l.google.com:19302" },
        { url: "stun:stun4.l.google.com:19302" },
        {
          url: "turn:numb.viagenie.ca",
          credential: process.env.REACT_APP_TURN_SERVER_PW,
          username: process.env.REACT_APP_TURN_SERVER_USERNAME,
        },
      ],
    };

    return new RTCPeerConnection(configuration);
  } catch (exception) {
    console.error(exception);
  }
};

export const listenToConnectionEvents = (
  connection,
  fromUid,
  toUid,
  remoteVideoRef,
  firebaseRef,
  doCandidate
) => {
  // listen for ice candidates
  connection.onicecandidate = function (event) {
    if (event.candidate) {
      doCandidate(toUid, event.candidate, fromUid, firebaseRef);
    }
  };
  // when a remote user adds stream to the peer connection, we display it
  connection.ontrack = function (event) {
    if (remoteVideoRef && remoteVideoRef.srcObject !== event.streams[0]) {
      remoteVideoRef.srcObject = event.streams[0];
    }
  };
};

export const sendAnswer = async (
  connection,
  localStream,
  notif,
  firebaseRef,
  doAnswer,
  fromUid
) => {
  try {
    // add the localstream to the connection
    if (!connection.localDescription) {
      for (const track of localStream.getTracks()) {
        connection.addTrack(track, localStream);
      }
    }

    // set the remote and local descriptions and create an answer
    const offer = JSON.parse(notif.offer);
    connection.setRemoteDescription(offer);

    // create an answer to an offer
    const answer = await connection.createAnswer();
    connection.setLocalDescription(answer);

    // send answer to the other peer
    doAnswer(notif.from, answer, fromUid, firebaseRef);
  } catch (exception) {
    console.error(exception);
  }
};

export const beginCall = (connection, notif) => {
  // it should be called when we
  // received an answer from other peer to start the call
  // and set remote the description
  const answer = JSON.parse(notif.answer);
  connection.setRemoteDescription(answer);
};

export const addCandidate = (connection, notif) => {
  // apply the new received candidate to the connection
  if (connection.localDescription) {
    const candidate = JSON.parse(notif.candidate);
    connection.addIceCandidate(new RTCIceCandidate(candidate));
  }
};
