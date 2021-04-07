import React, { Component } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import styles from "./Profile.module.css";
import profileImage from "../../images/nav_icons/cnd_nav_profile.png";

const yearMillis = 365.25 * 24 * 60 * 60 * 1000;

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userData: {},
      placeholderData: {
        first_name: '(Name)',
        last_initial: '',
        zipcode: '00000',
        interests: ['(Interests)'],
        birthdate: '00-00-0000',
        gender: '(Gender)',
        looking_for: '(Looking for)',
        color: '000000',
        state: '(State)',
        city: '(City)',
      },
      profileIsLoaded: false
    };
  }

  computeAge(dateString) {
    //const [day, month, year] = dateString.split('-');
    const birthDate = Date.parse(dateString); //Date.parse(`${year}-${month}-${day}`);
    const diff = Date.now() - birthDate;
    //console.log(day, month, year, dateString, birthDate, diff);
    return Math.floor(diff / yearMillis)
  }

  componentDidMount() {
    return firebase
        .firestore()
        .collection("users")
        .doc(this.props.user.uid)
        .get()
        .then(doc => {
          if (!doc.exists) {
            //this.state.profileIsLoaded = false;
            return null;
          }
          const { userData } = doc.data();
          const newState = Object.assign(this.state, { userData, profileIsLoaded: true });
          this.setState(newState);
          console.log(newState);
        })
        .catch(err => {
          console.error(err);
          //this.state.profileIsLoaded = false;
        })
  }

  render() {
    let image1 = profileImage;
    let image2 = profileImage;
    let image3 = profileImage;
    let image4 = profileImage;
    //if (!this.state.hasAttemptedLoad)
    //  this.fetchProfile();
    const userData = (this.state.profileIsLoaded ? this.state.userData : this.state.placeholderData);
    return (
      <div className={styles.profile_container}>
        <img src={profileImage} alt="profile" className={styles.profile_pic} />
        <p className={styles.name}>
          {userData.first_name} {userData.last_initial} <br />
          {userData.city}, {userData.state}
        </p>
        <p className={styles.basic}>{this.computeAge(userData.birthdate)} / {userData.gender} / {userData.looking_for}</p>
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
        <div className={styles.button_container}>
          <button className={styles.button}>Add Photos (max 4)</button>
        </div>
      </div>
    );
  }
}

class InterestList extends Component {
  render() {
    console.log(this.props.interests);
    if (!this.props.interests.length)
      return <li>(Interests)</li>
    return this.props.interests.map(int => <li>{int}</li>);
  }
}

export default Profile;
