import React, {Component} from 'react';
import './aboutMe.css';
import thatsme from '../../assets/thatsme.png'
import bewerbung from '../../assets/bewerbung_gross.jpg'
import {faGit} from "@fortawesome/free-brands-svg-icons";
import {faLinkedin} from "@fortawesome/free-brands-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default class Cv extends Component {
    constructor() {
        super();
    }


    componentDidMount() {
        let image = document.getElementById("about-me-image");
        image.addEventListener("mouseover", (event) => {
            event.preventDefault();
            let thatsMeImage = document.getElementById("thats-me");
            thatsMeImage.classList.remove("thats-me");
            thatsMeImage.classList.add("thats-me-transition");
        });
        image.addEventListener("mouseleave", (event) => {
            event.preventDefault();
            let thatsMeImage = document.getElementById("thats-me");
            thatsMeImage.classList.add("thats-me");
            thatsMeImage.classList.remove("thats-me-transition");
        });

    }

    render() {
        return (
            <div className="about-me-container" id="aboutMe">
                <div className="headline">About me</div>
                <div className="about-me-content-wrapper">
                    <div className="about-me-content-self text-block box-shadow">
                        <h1>Hallo</h1>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                            labore
                            et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                            nisi
                            ut
                            aliquip ex ea commodo consequat.</p>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                            labore
                            et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                            nisi
                            ut
                            aliquip ex ea commodo consequat.
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                            labore
                            et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                            nisi
                            ut
                            aliquip ex ea commodo consequat.

                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                            labore
                            et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                            nisi
                            ut
                            aliquip ex ea commodo consequat.
                        </p>
                    </div>
                    <div className="about-me-content-other text-block box-shadow">
                        <h1>I like turtles</h1>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                            labore
                            et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                            nisi
                            ut
                            aliquip ex ea commodo consequat.</p>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                            labore
                            et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                            nisi
                            ut
                            aliquip ex ea commodo consequat.
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                            labore
                            et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                            nisi
                            ut
                            aliquip ex ea commodo consequat.

                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                            labore
                            et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                            nisi
                            ut
                            aliquip ex ea commodo consequat.
                        </p>
                    </div>
                    <div className="about-me-image box-shadow" id="about-me-image">
                        <img id="thats-me" className="thats-me" src={thatsme}/>
                        <img id="my-picture" src={bewerbung}/>
                    </div>
                </div>
                <div className="icons">
                    <a href="https://github.com/HenneGit" target="-_blank" className="icon">
                        <FontAwesomeIcon icon={faGit}/>
                    </a>
                    <a href="https://www.linkedin.com/in/henning-ahrens-52a183b1" target="-_blank" className="icon">
                        <FontAwesomeIcon icon={faLinkedin}/>
                    </a>
                </div>

            </div>
        );
    }
}

