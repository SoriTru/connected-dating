import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import styles from "./Authenticate.module.css";
import cupid from "../../images/art/confetti_cupid.png";

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      input: {},
      errors: {},
      profileIsSaved: false,
      isUpdating: false,
    };
  }

  componentDidMount = async () => {
    if (!this.props.user) {
      return;
    }

    let userData = await firebase
      .firestore()
      .collection("users")
      .doc(this.props.user.uid)
      .get();

    if (userData.exists) {
      let input = this.state.input;
      let formElements = [
        "first_name",
        "last_initial",
        "zipcode",
        "interests",
        "color",
        "birthdate",
        "gender",
        "looking_for",
      ];

      for (const element of formElements) {
        input[element] = userData.data().userData[element]
          ? userData.data().userData[element]
          : "";
      }

      this.setState({ input, isUpdating: true });
    } else {
      console.log("Doesn't exist");
    }
  };

  handleChange = (event) => {
    let input = this.state.input;
    input[event.target.name] = event.target.value;

    this.setState({ input });
  };

  handleSignup = (event) => {
    event.preventDefault();

    // check for valid email/password
    if (this.validateEmailPassword(event)) {
      // register user
      firebase
        .auth()
        .createUserWithEmailAndPassword(
          this.state.input.email,
          this.state.input.password
        )
        .catch((error) => {
          // TODO: process error and alert user
          console.warn(error.code);
          alert(error.message);
        });
    }
  };

  validateEmailPassword = (event) => {
    let input = this.state.input;
    let errors = {};
    let isValid = true;

    // check email for validity
    if (!input["email"] || input["email"] === "") {
      isValid = false;
      errors["email"] = "Required";
    } else if (event.target[0].validity.typeMismatch) {
      // use HTML5 error check for email field
      isValid = false;
      errors["email"] = "Please enter a valid email address";
    }

    // check password for validity
    if (!input["password"] || input["password"] === "") {
      isValid = false;
      errors["password"] = "Required";
    } else if (input["password"].length < 6) {
      isValid = false;
      errors["password"] = "Password must be at least 6 characters";
    } else if (input["password"] !== input["confirm_password"]) {
      isValid = false;
      errors["confirm_password"] = "Passwords must match!";
    }

    this.setState({ errors: errors });

    return isValid;
  };

  handleProfileSubmit = async (event) => {
    event.preventDefault();

    // check that the form was filled out correctly
    if (this.validateProfile() && this.props.user) {
      // submit the form here (include firebase username)

      // get city and state from zipcode
      const ZIP_API_KEY = process.env.REACT_APP_ZIPCODE_API_KEY;
      const zip_response = await fetch(
        `https://api.zip-codes.com/ZipCodesAPI.svc/1.0/QuickGetZipCodeDetails/${this.state.input.zipcode}?key=${ZIP_API_KEY}`
      );
      const data = await zip_response.json();

      let userCity = data.City;
      let userState = data.State;

      // set default color to black if user didn't set their color
      let userColor = this.state.input.color
        ? this.state.input.color
        : "#000000";

      // parse interests from comma separated string
      let userInterests = this.state.input.interests.split(",");

      // post data to Firebase
      let userData = {
        first_name: this.state.input.first_name,
        last_initial: this.state.input.last_initial,
        zipcode: this.state.input.zipcode,
        interests: userInterests,
        birthdate: this.state.input.birthdate,
        gender: this.state.input.gender,
        looking_for: this.state.input.looking_for,
        color: userColor,
        state: userState,
        city: userCity,
      };

      await firebase
        .firestore()
        .collection("users")
        .doc(this.props.user.uid)
        .set(
          {
            userData: userData,
          },
          { merge: true }
        );

      this.setState({ profileIsSaved: true });
    }
  };

  validateProfile = () => {
    let input = this.state.input;
    let errors = {};
    let isValid = true;

    // check that required forms are filled out
    let required_forms = [
      "first_name",
      "last_initial",
      "birthdate",
      "gender",
      "looking_for",
      "interests",
    ];
    for (const form of required_forms) {
      if (!input[form] || input[form] === "") {
        isValid = false;
        errors[form] = "Required";
      }
    }

    // check that zipcode is valid
    if (!input["zipcode"] || !input["zipcode"].match(/^[0-9]{5}$/)) {
      isValid = false;
      errors["zipcode"] = "Enter a 5 digit zipcode";
    }

    // check that user is at least 18
    let currentDate = new Date();
    let is18 =
      currentDate.getFullYear() - parseInt(input["birthdate"].slice(0, 5)) < 18;
    if (input["birthdate"] && is18) {
      isValid = false;
      errors["birthdate"] = "Must be at least 18 years of age!";
    }
    this.setState({ errors: errors });
    return isValid;
  };

  render() {
    if (this.state.profileIsSaved) {
      return <Redirect to="/home" />;
    }
    if (this.props.user) {
      return (
        <div className={styles.login_container}>
          <div className={styles.main}>
            <div className={styles.profile_options}>
              <h2 className={styles.option_title}>
                {this.state.isUpdating
                  ? "Update Your Info"
                  : "Set Up Your Account"}
              </h2>
              <div className={styles.setup_items}>
                <label htmlFor="first_name" className={styles.setup_label}>
                  First Name:
                </label>
                <input
                  type="text"
                  name="first_name"
                  onChange={this.handleChange}
                  className={styles.setup_input}
                  value={this.state.input.first_name || ""}
                />
              </div>
              <div className={styles.text_danger}>
                {this.state.errors.first_name}
              </div>

              <div className={styles.setup_items}>
                <label htmlFor="last_initial" className={styles.setup_label}>
                  Last Initial:
                </label>
                <input
                  type="text"
                  name="last_initial"
                  onChange={this.handleChange}
                  maxLength="1"
                  className={styles.setup_input}
                  value={this.state.input.last_initial || ""}
                />
              </div>
              <div className={styles.text_danger}>
                {this.state.errors.last_initial}
              </div>

              <div className={styles.setup_items}>
                <label htmlFor="zipcode" className={styles.setup_label}>
                  Zipcode:
                </label>
                <input
                  name="zipcode"
                  onChange={this.handleChange}
                  type="text"
                  pattern="[0-9]{5}"
                  placeholder="Five digit zip code"
                  className={styles.setup_input}
                  value={this.state.input.zipcode || ""}
                />
              </div>
              <div className={styles.text_danger}>
                {this.state.errors.zipcode}
              </div>

              <div>
                <label htmlFor="interests">What are your interests?</label>
                <br />
                <p className={styles.setup_desc}>(separate by commas)</p>
                <textarea
                  rows="4"
                  cols="30"
                  name="interests"
                  onChange={this.handleChange}
                  placeholder="kites, SpongeBob, surfing, rocks"
                  className={styles.setup_text_area}
                  value={this.state.input.interests || ""}
                />
              </div>

              <div className={styles.setup_items}>
                <label htmlFor="color" className={styles.setup_label}>
                  Pick a color:
                </label>
                <input
                  type="color"
                  name="color"
                  onChange={this.handleChange}
                  className={styles.setup_color}
                  value={this.state.input.color || ""}
                />
              </div>

              <div className={styles.setup_items}>
                <label htmlFor="birthdate" className={styles.setup_label}>
                  Birthday:
                </label>
                <input
                  type="date"
                  name="birthdate"
                  onChange={this.handleChange}
                  className={styles.setup_input}
                  style={{ width: "60%" }}
                  value={this.state.input.birthdate || ""}
                />
              </div>
              <div className={styles.text_danger}>
                {this.state.errors.birthdate}
              </div>

              <div className={styles.setup_items}>
                <label htmlFor="gender" className={styles.setup_label}>
                  You are
                </label>
                <input
                  type="text"
                  onChange={this.handleChange}
                  name="gender"
                  className={styles.setup_input}
                  value={this.state.input.gender || ""}
                />
              </div>
              <div className={styles.text_danger}>
                {this.state.errors.gender}
              </div>

              <div className={styles.setup_items}>
                <label htmlFor="looking_for" className={styles.setup_label}>
                  looking for
                </label>
                <input
                  type="text"
                  onChange={this.handleChange}
                  name="looking_for"
                  className={styles.setup_input}
                  value={this.state.input.looking_for || ""}
                />
              </div>
              <div className={styles.text_danger}>
                {this.state.errors.looking_for}
              </div>

              <div className={styles.centered_content}>
                <br />
                <button
                  onClick={this.handleProfileSubmit}
                  className={styles.form_submit}
                >
                  {this.state.isUpdating ? "Update" : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.signup_container}>
        <div className={styles.img_container}>
          <img alt={"cupid"} src={cupid} className={styles.graphic} />
        </div>
        <div className={styles.main}>
          <h1 style={{ color: "#fffffa", margin: 0 }}>Sign Up</h1>
          <form onSubmit={this.handleSignup} noValidate>
            <div className={styles.form_group}>
              <label htmlFor="email">Email:</label>
              <br />
              <input
                type="email"
                name="email"
                onChange={this.handleChange}
                className={styles.form_input}
                id="email"
              />
              <div className={styles.text_danger}>
                {this.state.errors.email}
              </div>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="password">Password:</label>
              <br />
              <input
                type="password"
                name="password"
                onChange={this.handleChange}
                className={styles.form_input}
                placeholder={"Must be at least 7 characters"}
                id="password"
              />
              <div className={styles.text_danger}>
                {this.state.errors.password}
              </div>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="confirm_password">Confirm password:</label>
              <br />
              <input
                type="password"
                name="confirm_password"
                onChange={this.handleChange}
                className={styles.form_input}
                id="confirm_password"
              />
              <div className={styles.text_danger}>
                {this.state.errors.confirm_password}
              </div>
            </div>

            <div className={styles.centered_content}>
              <input
                type="submit"
                value="Submit"
                className={styles.form_submit}
              />
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Signup;
