import React, { Component } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

import styles from "./Profile.module.css";
import profileImage from "../../images/nav_icons/cnd_nav_profile.png";

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
      showUploadBox: false,
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
      const newStatee = Object.assign(this.state, { toast: { text: "" } });
      this.setState(newStatee);
    }, 3000);
  };

  onFileChange = (event) => {
    const file = event.target.files[0];
    console.log(event, file);
    if (!file) return;
    const newState = Object.assign(this.state, { uploadSelection: file.name });
    this.setState(newState);
  };

  uploadPhoto = () => {
    const num = this.state.imageURLs.length + 1;
    const file = document.getElementById("profilePhotoUploader")?.files[0];
    console.log(file);
    if (!file) return;
    const locationRef = firebase
      .storage()
      .ref()
      .child(`/${this.props.user.uid}/${num}.png`);
    return locationRef
      .put(file)
      .then(async (res) => {
        //console.log(res, res.metadata?.name);
        const newState = Object.assign(this.state, {
          toast: { text: "Successfully uploaded", success: true },
          uploadSelection: "",
        });
        //newState.imageURLs.push(await res.getDownloadURL());
        this.setState(newState);
        await this.refreshImages(newState);
        this.resetUploadArea();
      })
      .catch((err) => {
        console.error(err);
        const newState = Object.assign(this.state, {
          toast: { text: "Failed to upload: " + err, success: false },
          uploadSelection: "",
        });
        this.setState(newState);
        this.resetUploadArea();
      });
  };

  toggleUploadBox = () => {
    const newState = Object.assign(this.state, {
      showUploadBox: !this.state.showUploadBox,
    });
    this.setState(newState);
  };

  refreshImages = (newState) => {
    newState.imageURLs = [];
    return firebase
      .storage()
      .ref()
      .child("/" + this.props.user.uid)
      .listAll()
      .then(async (res) => {
        console.log(res.items);

        for (const item of res.items) {
          const url = await item.getDownloadURL().catch((err) => {
            console.error(err);
            return null;
          });
          if (url) {
            newState.imageURLs.push(url);
          }
        }

        console.log(newState);
        this.setState(newState);
      })
      .catch((err) => {
        console.error(err);
        this.setState(newState);
      });
  };

  componentDidMount() {
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

    const image1 = imageURLs[0] || profileImage;
    const image2 = imageURLs[1] || profileImage;
    const image3 = imageURLs[2] || profileImage;
    const image4 = imageURLs[3] || profileImage;

    return (
      <div className={styles.profile_container}>
        <img src={profileImage} alt="profile" className={styles.profile_pic} />
        <p className={styles.name}>
          {userData.first_name} {userData.last_initial} <br />
          {userData.city}, {userData.state}
        </p>
        <p className={styles.basic}>
          {this.computeAge(userData.birthdate)} / {userData.gender} /{" "}
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
            <InterestList interests={userData.interests}></InterestList>
          </div>
        </div>
        <button
          className={styles.button}
          disabled={this.state.imageURLs.length >= 4 ? "" : null}
          onClick={this.toggleUploadBox}
        >
          {this.state.showUploadBox ? "Hide Uploader" : "Add Photos (max 4)"}
        </button>
        {this.state.showUploadBox ? (
          <div className={styles.button_container}>
            <div className={styles.upload_container}>
              {this.state.uploadSelection ? (
                <button
                  className={styles.upload_button}
                  onClick={this.uploadPhoto}
                >
                  Upload {this.state.uploadSelection}
                </button>
              ) : (
                <p>Select a photo to upload below:</p>
              )}
              <input
                type="file"
                accept="image/png"
                id="profilePhotoUploader"
                onChange={this.onFileChange}
              ></input>
            </div>
          </div>
        ) : (
          ""
        )}
        <section className={styles.toastSection}>
          <Toast
            text={this.state.toast?.text}
            success={this.state.toast?.success}
          ></Toast>
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
