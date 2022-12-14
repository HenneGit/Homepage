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
        let image = document.getElementById("my-picture");
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
                <div className="picture-and-headline">
                    <div className="about-me-image" id="about-me-image">
                        <img id="thats-me" className="thats-me" src={thatsme}/>
                        <img id="my-picture" src={bewerbung}/>
                    </div>
                    <div className="headline-wrapper">
                    <p className="headline">About</p>
                    <p className="me">Me</p>
                    <p className="quote">"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                        labore"
                      </p>
                    </div>
                </div>
                <div className="about-me-content-wrapper">
                    <div className="about-me-content-self text-block box-shadow">
                        <h1>Hello again!</h1>
                        <p>Welcome to my page. In the box right next to this one you can read about who I am. Down below you can learn of what I did in my life before and what skills I possess.
                            If you are done with that, why not linger around and play a round of chess against Stockfish. Might be fun. If you have questions or want to contact me fell free to do so in the formular I created at the bottom of this page.
                            Anyways thanks for visiting and have a good day :)!
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

