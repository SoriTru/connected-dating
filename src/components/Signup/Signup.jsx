import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/auth";

import styles from "./Signup.module.css";

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      input: {},
      errors: {},
      profileIsSaved: false,
    };
  }

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
        `https://api.zip-codes.com/ZipCodesAPI.svc/1.0/QuickGetZipCodeDetails/${this.state.zipcode}?key=${ZIP_API_KEY}`
      );
      const data = await zip_response.json();

      let userCity = data.City;
      let userState = data.State;

      // set default color to black if user didn't set their color
      let userColor = this.state.color ? this.state.color : "#000000";

      // parse interests from comma separated string
      let userInterests = this.state.input.interests.split(",");

      // submit form
      let userObject = {
        firebase_uuid: this.props.user.uid,
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

      const server_response = await fetch("/user", {
        method: "POST",
        body: JSON.stringify(userObject),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (server_response.status === 200) {
        this.setState({ profileIsSaved: true });
      } else {
        // TODO: account for specific errors here
        alert("Error in communicating with server!");
        console.log(server_response);
      }
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

    this.setState({ errors: errors });
    return isValid;
  };

  render() {
    if (this.state.profileIsSaved) {
      return <Redirect to="/home" />;
    }
    if (this.props.user) {
      return (
        <div className={styles.container}>
          <div className={styles.main}>
            <div className={styles.profile_options}>
              <h3 className={styles.option_title}>Set up your account</h3>
              <div>
                <label htmlFor="first_name">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  onChange={this.handleChange}
                  placeholder={"Enter your first name"}
                />
                <div className={styles.text_danger}>
                  {this.state.errors.first_name}
                </div>
              </div>

              <div>
                <label htmlFor="last_initial">Last Initial</label>
                <input
                  type="text"
                  name="last_initial"
                  onChange={this.handleChange}
                  placeholder="I"
                  maxLength="1"
                />
                <div className={styles.text_danger}>
                  {this.state.errors.last_initial}
                </div>
              </div>

              <div>
                <label htmlFor="zipcode">Zipcode</label>
                <input
                  name="zipcode"
                  onChange={this.handleChange}
                  type="text"
                  pattern="[0-9]{5}"
                  placeholder="Five digit zip code"
                />
                <div className={styles.text_danger}>
                  {this.state.errors.zipcode}
                </div>
              </div>

              <div>
                <label htmlFor="interests">
                  What are your interests? <br /> (separate by commas)
                </label>
                <br />
                <textarea
                  rows="4"
                  cols="30"
                  name="interests"
                  onChange={this.handleChange}
                  placeholder="kites, SpongeBob, surfing, rocks"
                />
              </div>

              <div>
                <label htmlFor="color">Pick a color</label>
                <input type="color" name="color" onChange={this.handleChange} />
              </div>

              <div>
                <label htmlFor="birthdate">Birthday</label>
                <input
                  type="date"
                  name="birthdate"
                  onChange={this.handleChange}
                />
                <div className={styles.text_danger}>
                  {this.state.errors.birthdate}
                </div>
              </div>

              <div>
                <label htmlFor="gender">You are</label>
                <input type="text" onChange={this.handleChange} name="gender" />
                <div className={styles.text_danger}>
                  {this.state.errors.gender}
                </div>
                <label htmlFor="looking_for">looking for</label>
                <input
                  type="text"
                  onChange={this.handleChange}
                  name="looking_for"
                />
                <div className={styles.text_danger}>
                  {this.state.errors.looking_for}
                </div>
              </div>

              <div className={styles.centered_content}>
                <button onClick={this.handleProfileSubmit}>Submit</button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.container}>
        <div className={styles.main}>
          <form onSubmit={this.handleSignup} noValidate>
            <div className={styles.form_group}>
              <label htmlFor="email">Email:</label>
              <br />
              <input
                type="email"
                name="email"
                onChange={this.handleChange}
                className={styles.form_input}
                placeholder="Enter your email"
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
                placeholder="*********"
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
                placeholder="*********"
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
