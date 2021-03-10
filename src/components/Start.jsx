import React, { Component } from 'react';
import {Link} from "react-router-dom";

import styles from '../styles/Start.module.css'

import logo from "../images/filler-logo.jpeg";
import footer_image from "../images/filler1.jpeg";

class Start extends Component {
    render() {
        return (
            <div className={styles.container}>
                <div className={styles.main}>
                    {/* logo */}
                    <img src={logo} className={styles.logo_image}/>

                    <Link to="/signup" className={styles.button}>Sign Up</Link>
                    <Link to="/login" className={styles.button}>Log In</Link>


                </div>
                <div className={styles.footer}>
                    <Link to="/about" className={styles.link}>About</Link>
                    <Link to="/terms" className={styles.link}>Terms</Link>
                </div>
            </div>
        )
    }
}

export default Start;