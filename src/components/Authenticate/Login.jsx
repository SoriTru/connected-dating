import React, { Component } from "react";
import firebase from "firebase/app";
import "firebase/auth";

import styles from "./Authenticate.module.css";
import flower from "../../images/art/white_flower.png";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      input: {},
      errors: {},
    };
  }

  handleChange = (event) => {
    let input = this.state.input;
    input[event.target.name] = event.target.value;

    this.setState({ input });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    // check for valid email
    if (this.validate(event)) {
      // log user in
      firebase
        .auth()
        .signInWithEmailAndPassword(
          this.state.input.email,
          this.state.input.password
        )
        .catch((error) => {
          alert("Error logging in!\n" + error.message);
          console.warn(error.code);
        });
    }
  };

  validate(event) {
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

    // check that password was entered
    if (!input["password"] || input["password"] === "") {
      isValid = false;
      errors["password"] = "Required";
    }

    this.setState({ errors: errors });
    return isValid;
  }

  render() {
    return (
      <div className={styles.login_container}>
        <div className={styles.main}>
          <h1 style={{ color: "#fffffa" }}>Log In</h1>
          <form onSubmit={this.handleSubmit} noValidate>
            <div className={styles.form_group}>
              <label htmlFor="email">Email:</label>
              <br />
              <input
                type="email"
                name="email"
                // value={this.state.input.username}
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
                // value={this.state.input.password}
                onChange={this.handleChange}
                className={styles.form_input}
                placeholder="*********"
                id="password"
              />
              <div className={styles.text_danger}>
                {this.state.errors.password}
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
        <div className={styles.img_container}>
          <img alt={"flower"} src={flower} className={styles.graphic} />
        </div>
      </div>
    );
  }
}

export default Login;
