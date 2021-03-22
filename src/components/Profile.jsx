import React, { Component } from "react";

import styles from "../styles/Profile.module.css";
import profileImage from "../images/nav_icons/cnd_nav_profile.png";

class Profile extends Component {
  render() {
    return (
      <div className={styles.profile_container}>
        <img src={profileImage} alt="profile" className={styles.profile_pic} />
        <p className={styles.name}>
          Name <br />
          Town, ST
        </p>
        <p className={styles.basic}>Age / G / O</p>
        <section className={styles.carousel} aria-label="Gallery">
          <ol className={styles.carousel_viewport}>
            <li
              id="carousel_slide1"
              tabIndex={0}
              className={styles.carousel_slide}
            >
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
      </div>
    );
  }
}

export default Profile;
