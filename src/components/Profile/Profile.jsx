import React, { Component } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

import styles from "./Profile.module.css";
import fillerImage from "../../images/nav_icons/image_temp.png";

const yearMillis = 365.25 * 24 * 60 * 60 * 1000;

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userData: {},
      placeholderData: {
        first_name: "(Name)",
        last_initial: "",
        zipcode: "00000",
        interests: ["(Interests)"],
        birthdate: "00-00-0000",
        gender: "(Gender)",
        looking_for: "(Looking for)",
        color: "000000",
        state: "(State)",
        city: "(City)",
      },
      profileIsLoaded: false,
      uploadSelection: null,
      displayModal: false,
      imageURLs: [],
      toast: {
        text: "",
        success: false,
      },
    };
  }

  computeAge(dateString) {
    //const [day, month, year] = dateString.split('-');
    const birthDate = Date.parse(dateString); //Date.parse(`${year}-${month}-${day}`);
    const diff = Date.now() - birthDate;
    //console.log(day, month, year, dateString, birthDate, diff);
    return Math.floor(diff / yearMillis);
  }

  resetUploadArea = () => {
    document.getElementById("profilePhotoUploader").value = null;
    setTimeout(() => {
      this.setState({ toast: { text: "" } });
    }, 1500);
  };

  onFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const newState = Object.assign(this.state, { uploadSelection: file.name });
    this.setState(newState);
  };

  uploadPhoto = () => {
    const num = this.state.imageURLs.length + 1;
    const file = document.getElementById("profilePhotoUploader")?.files[0];
    if (!file) {
      return;
    }

    const locationRef = firebase
      .storage()
      .ref()
      .child(`/${this.props.user.uid}/${num}.png`);
    return locationRef
      .put(file)
      .then(async (res) => {
        this.setState({
          toast: { text: "Successfully uploaded", success: true },
          uploadSelection: "",
          displayModal: false,
        });
        await this.refreshImages();
        this.resetUploadArea();
      })
      .catch((err) => {
        console.error(err);
        this.setState({
          toast: { text: "Failed to upload: " + err, success: false },
          uploadSelection: "",
        });
        this.resetUploadArea();
      });
  };

  refreshImages = () => {
    let imageURLs = [];
    return firebase
      .storage()
      .ref()
      .child("/" + this.props.user.uid)
      .listAll()
      .then(async (res) => {
        for (const item of res.items) {
          const url = await item.getDownloadURL().catch((err) => {
            console.error(err);
            return null;
          });
          if (url) {
            imageURLs.push(url);
          }
        }

        this.setState({ imageURLs: imageURLs });
      })
      .catch((err) => {
        console.error(err);
        this.setState({ imageURLs: imageURLs });
      });
  };

  componentDidMount() {
    // close modal if user clicks off
    this.uploadModal = document.getElementById("uploaderModal");
    window.onclick = (event) => {
      if (event.target === this.uploadModal) {
        this.setState({ displayModal: "none" });
      }
    };

    return firebase
      .firestore()
      .collection("users")
      .doc(this.props.user.uid)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          //this.state.profileIsLoaded = false;
          return null;
        }
        const { userData } = doc.data();
        if (!userData) return null;

        const newState = Object.assign(this.state, {
          userData,
          profileIsLoaded: true,
        });

        return this.refreshImages(newState);
      })
      .catch((err) => {
        console.error(err);
        //this.state.profileIsLoaded = false;
      });
  }

  render() {
    const userData = this.state.profileIsLoaded
      ? this.state.userData
      : this.state.placeholderData;
    const imageURLs = this.state.imageURLs || [];

    const image1 = imageURLs[0] || fillerImage;
    const image2 = imageURLs[1] || fillerImage;
    const image3 = imageURLs[2] || fillerImage;
    const image4 = imageURLs[3] || fillerImage;

    return (
      <div className={styles.profile_container}>
        <p className={styles.name}>
          {userData.first_name} {userData.last_initial} <br />
          {userData.city}, {userData.state}
        </p>
        <p className={styles.basic}>
          {this.computeAge(userData.birthdate)} / {userData.gender} /{" "}
          {" looking for "}
          {userData.looking_for}
        </p>
        <section className={styles.carousel} aria-label="Gallery">
          <ol className={styles.carousel_viewport}>
            <li
              id="carousel_slide1"
              tabIndex={0}
              className={styles.carousel_slide}
            >
              <img
                src={image1}
                alt={"test"}
                className={styles.carousel_image}
              />
              <div className={styles.carousel_snapper}>
                <a href="#carousel_slide4" className={styles.carousel_prev}>
                  Go to last slide
                </a>
                <a href="#carousel_slide2" className={styles.carousel_next}>
                  Go to next slide
                </a>
              </div>
            </li>
            <li
              id="carousel_slide2"
              tabIndex={0}
              className={styles.carousel_slide}
            >
              <img
                src={image2}
                alt={"test"}
                className={styles.carousel_image}
              />
              <div className={styles.carousel_snapper}>
                <a href="#carousel_slide1" className={styles.carousel_prev}>
                  Go to last slide
                </a>
                <a href="#carousel_slide3" className={styles.carousel_next}>
                  Go to next slide
                </a>
              </div>
            </li>
            <li
              id="carousel_slide3"
              tabIndex={0}
              className={styles.carousel_slide}
            >
              <img
                src={image3}
                alt={"test"}
                className={styles.carousel_image}
              />
              <div className={styles.carousel_snapper}>
                <a href="#carousel_slide2" className={styles.carousel_prev}>
                  Go to last slide
                </a>
                <a href="#carousel_slide4" className={styles.carousel_next}>
                  Go to next slide
                </a>
              </div>
            </li>
            <li
              id="carousel_slide4"
              tabIndex={0}
              className={styles.carousel_slide}
            >
              <img
                src={image4}
                alt={"test"}
                className={styles.carousel_image}
              />
              <div className={styles.carousel_snapper}>
                <a href="#carousel_slide3" className={styles.carousel_prev}>
                  Go to last slide
                </a>
                <a href="#carousel_slide1" className={styles.carousel_next}>
                  Go to next slide
                </a>
              </div>
            </li>
          </ol>
          <aside className={styles.carousel_nav}>
            <ol className={styles.carousel_nav_list}>
              <li className={styles.carousel_nav_item}>
                <a
                  href="#carousel_slide1"
                  className={styles.carousel_nav_button}
                >
                  Go to slide 1
                </a>
              </li>
              <li className={styles.carousel_nav_item}>
                <a
                  href="#carousel_slide2"
                  className={styles.carousel_nav_button}
                >
                  Go to slide 2
                </a>
              </li>
              <li className={styles.carousel_nav_item}>
                <a
                  href="#carousel_slide3"
                  className={styles.carousel_nav_button}
                >
                  Go to slide 3
                </a>
              </li>
              <li className={styles.carousel_nav_item}>
                <a
                  href="#carousel_slide4"
                  className={styles.carousel_nav_button}
                >
                  Go to slide 4
                </a>
              </li>
            </ol>
          </aside>
        </section>

        <div className={styles.interests}>
          <h3 className={styles.interest_heading}>Interests</h3>
          <div className={styles.interest_scroll}>
            <InterestList interests={userData.interests} />
          </div>
        </div>

        <div className={styles.button_container}>
          <button
            className={styles.button}
            disabled={this.state.imageURLs.length >= 4}
            onClick={() => {
              this.setState({ displayModal: "flex" });
            }}
            style={{
              display:
                this.state.imageURLs.length >= 4 ? "none" : "inline-block",
            }}
          >
            Add Photos
          </button>
        </div>

        <div
          id={"uploaderModal"}
          className={styles.modal}
          style={{ display: this.state.displayModal }}
        >
          <div className={styles.modalContent}>
            {this.state.uploadSelection ? (
              <button className={styles.button} onClick={this.uploadPhoto}>
                Upload {this.state.uploadSelection}
              </button>
            ) : (
              <p>Select a photo to upload</p>
            )}
            <label
              htmlFor={"profilePhotoUploader"}
              className={styles.button}
              style={{
                display: this.state.uploadSelection ? "none" : "block",
                margin: "auto",
              }}
            >
              Upload File
            </label>
            <input
              type="file"
              accept="image/png"
              id="profilePhotoUploader"
              onChange={this.onFileChange}
            />
          </div>
        </div>

        <section className={styles.toastSection}>
          <Toast
            text={this.state.toast?.text}
            success={this.state.toast?.success}
          />
        </section>
      </div>
    );
  }
}

class InterestList extends Component {
  render() {
    //console.log(this.props.interests);
    if (!this.props.interests.length)
      return <li key="placeholder">(Interests)</li>;
    return this.props.interests.map((int) => <li key={int}>{int}</li>);
  }
}

class Toast extends Component {
  render() {
    if (!this.props.text) return "";
    return (
      <div className={styles.toast}>
        <div
          className={
            this.props.success
              ? styles.toastTextSuccess
              : styles.toastTextFailure
          }
        >
          {this.props.text}
        </div>
      </div>
    );
  }
}

export default Profile;
