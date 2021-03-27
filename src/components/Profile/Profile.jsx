import React, { Component } from "react";

import styles from "./Profile.module.css";
import profileImage from "../../images/nav_icons/cnd_nav_profile.png";

class Profile extends Component {
  render() {
    let image1 = profileImage;
    let image2 = profileImage;
    let image3 = profileImage;
    let image4 = profileImage;
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
            <p>Interest 1</p>
            <p>Interest 2</p>
            <p>Interest 3</p>
            <p>Interest 4</p>
            <p>Interest 5</p>
            <p>Interest 6</p>
          </div>
        </div>
        <div className={styles.button_container}>
          <button className={styles.button}>Add Photos (max 4)</button>
        </div>
      </div>
    );
  }
}

export default Profile;
