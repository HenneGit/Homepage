import React from 'react';
import './aboutMe.css';
import bewerbung from '../../assets/bewerbung_gross.jpg'
import {faGit} from "@fortawesome/free-brands-svg-icons";
import {faLinkedin} from "@fortawesome/free-brands-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

function AboutMe() {
    return (
        <div className="about-me-container" id="aboutMe">
            <div className="headline">About me</div>
            <div className="about-me-content">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat.</p>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat.
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat.

                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat.
                </p>
            </div>
            <div className="icons">
                <a href="https://github.com/HenneGit" target="-_blank" className="icon">
                    <FontAwesomeIcon icon={faGit}/>
                </a>
                <a href="https://www.linkedin.com/in/henning-ahrens-52a183b1" target="-_blank" className="icon">
                    <FontAwesomeIcon icon={faLinkedin} />
                </a>
            </div>
            <div className="about-me-image">
                <img src={bewerbung}/>
            </div>
        </div>
    );
}

export default AboutMe