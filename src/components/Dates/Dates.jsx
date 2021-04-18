import React, { Component } from "react";
import { QRCode } from "react-qr-svg";
import QrReader from "react-qr-reader";
import firebase from "firebase/app";
import "firebase/firestore";

import styles from "./Dates.module.css";

const uidRegex = /^[0-9a-zA-Z]{20,36}$/;

class Dates extends Component {
  constructor(props) {
    super(props);

    this.dummy = React.createRef();

    this.state = {
      isScanning: false,
      isLoading: true,
      statusText: "No QR code found.",
    };
  }

  openScanner = () => {
    this.setState({
      isScanning: true,
      isLoading: false,
      statusText: "No QR code found.",
    });
  };

  closeScanner = () => {
    this.setState({ isScanning: false, isLoading: false, dateUserID: null });
  };

  confirmDate = async (uid) => {
    if (!uid) return;
    const dateStatus = await firebase
      .firestore()
      .collection("dates")
      .doc(this.props.user.uid)
      .get()
      .then((snapshot) => {
        //console.log(snapshot.data());
        return snapshot.data()[uid];
      })
      .catch((err) => {
        console.error(err);
        return null;
      });
    if (dateStatus) {
      setTimeout(() => {
        this.setState({
          isScanning: true,
          isLoading: false,
          statusText: "No QR code found.",
        });
      }, 3000);
      return this.setState({
        isScanning: true,
        isLoading: true,
        statusText: "You have already confirmed a date with that user!",
      });
    }
    const finalMatches = await firebase
      .firestore()
      .collection("users")
      .doc(this.props.user.uid)
      .get()
      .then(doc => doc.data()?.finalMatch)
      .catch((err) => {
        console.error(err);
        return null;
      });
    const isMatched = finalMatches?.includes(uid)
    if (!isMatched) {
      setTimeout(() => {
        this.setState({
          isScanning: true,
          isLoading: false,
          statusText: "No QR code found.",
        });
      }, 3000);
      return this.setState({
        isScanning: true,
        isLoading: true,
        statusText:
          "Cannot confirm date with that user - you have not matched with them!",
      });
    }
    return firebase
      .firestore()
      .collection("dates")
      .doc(this.props.user.uid)
      .set({ [uid]: true }, { merge: true })
      .then((result) => {
        //console.log(result);
        setTimeout(() => {
          this.setState({
            isScanning: true,
            isLoading: false,
            statusText: "No QR code found.",
          });
        }, 3000);
        return this.setState({
          isScanning: true,
          isLoading: true,
          statusText: "Confirmed date!",
        });
      })
      .catch((err) => {
        console.error(err);
        setTimeout(() => {
          this.setState({
            isScanning: true,
            isLoading: false,
            statusText: "No QR code found.",
          });
        }, 3000);
        return this.setState({
          isScanning: true,
          isLoading: true,
          statusText: "Error confirming date.",
        });
      });
    // save date to db
  };

  handleError = (err) => {
    console.error(err);
  };

  handleScan = (data) => {
    if (this.state.isLoading) return;
    //console.log(data);
    if (uidRegex.test(data)) {
      this.setState({
        isScanning: true,
        isLoading: true,
        statusText: "Scanned! Confirming date...",
      });
      return this.confirmDate(data);
    } else if (data) {
      this.setState({
        isScanning: true,
        isLoading: false,
        statusText: "QR code found, but it wasn't for a Connected user.",
      });
    } else {
      this.setState({
        isScanning: true,
        isLoading: false,
        statusText: "No QR code found.",
      });
    }
  };

  render() {
    return this.state.isScanning ? (
      <div className={styles.scannerContainer}>
        <h3>Scanner</h3>
        <QrReader
          delay={500}
          onError={this.handleError}
          onScan={this.handleScan}
          style={{ width: "100%" }}
        />
        {this.state.isLoading ? (
          <div className={styles.qrOverlay}>
            <p className={styles.qrOverlayText}>{this.state.statusText}</p>
          </div>
        ) : (
          ""
        )}
        <p>{this.state.isLoading ? "Loading..." : this.state.statusText}</p>
        <button className={styles.scanButton} onClick={this.closeScanner}>
          Show My QR Code
        </button>
      </div>
    ) : (
      <div className={styles.selfQRContainer}>
        <p>
          Here is your personal QR code. Have someone special scan it to confirm
          your date :)
        </p>
        <QRCode
          bgColor="#FBFBFB"
          fgColor="#000000"
          level="Q"
          style={{ width: 256 }}
          value="big chungus"
        />
        <br></br>
        <button className={styles.scanButton} onClick={this.openScanner}>
          Scan QR Code
        </button>
      </div>
    );
  }
}

export default Dates;
