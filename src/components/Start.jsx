import React, { Component } from 'react';

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

                    {/* sign up */}
                    <button className={styles.button}>Sign Up</button>

                    {/* log in */}
                    <button className={styles.button}>Log In</button>


                </div>
                <div className={styles.footer}>
                    {/* TODO: set up footer details*/}
                    <img src={footer_image} className={styles.footer_image}/>
                </div>
            </div>
        )
    }
}

export default Start;