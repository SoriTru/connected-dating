import React, { Component } from "react";
import firebase from "firebase/app";
import "firebase/auth";

import styles from "../styles/Signup.module.css";

class Signup extends Component {
  constructor() {
    super();

    this.state = {
      input: {},
      errors: {},
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    let input = this.state.input;
    input[event.target.name] = event.target.value;

    this.setState({
      input,
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    // check for valid email/password
    if (this.validate(event)) {
      // register user
      firebase
        .auth()
        .createUserWithEmailAndPassword(
          this.state.input.email,
          this.state.input.password
        )
        .then(() => {
          // clear state
          this.setState({
            input: { email: "", password: "", confirm_password: "" },
          });
          // send user on to home page
          this.props.history.push("/home");
        });
    }
  }

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

    this.setState({
      errors: errors,
    });

    return isValid;
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.main}>
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
            <div className={styles.form_group}>
              <label htmlFor="confirm_password">Confirm password:</label>
              <br />
              <input
                type="password"
                name="confirm_password"
                // value={this.state.input.password}
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
