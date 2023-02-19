import React, {Component} from 'react';
import './aboutMe.css';
import thatsme from '../../assets/thatsme.png'
import bewerbung from '../../assets/bewerbung_gross.jpg'
import {faGit} from "@fortawesome/free-brands-svg-icons";
import {faLinkedin} from "@fortawesome/free-brands-svg-icons";
import {faEnvelope} from "@fortawesome/free-solid-svg-icons";
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

        fetchText();


        async function fetchText() {
            let textObject = await fetch("http://localhost:3000/about-me-text.json",).then(resp => resp.json());

            for (let id in textObject) {
                let object = textObject[id];
                let {headline} = object;
                let {text} = object;
                let {color} = object;
                let headlineDiv = document.getElementById("headline");
                let textDiv = document.getElementById("text");
                document.getElementById(id).addEventListener("click", () => {
                    headlineDiv.style.background = color;
                    headlineDiv.classList.add("background-transition");
                    let menu = document.querySelector(".menu");
                    menu.classList.add("background-transition");
                    menu.style.background = color;
                    textDiv.classList.remove("opacity-transition-in");
                    textDiv.classList.add("opacity-transition-out");
                    document.querySelectorAll(".menu-element").forEach(el => el.classList.remove("highlight"));
                    document.getElementById(id).classList.add("highlight");
                    let timout = setTimeout(() => {
                        headlineDiv.innerText = headline;
                        textDiv.innerText = text;
                        textDiv.classList.remove("opacity-transition-out");
                        textDiv.classList.add("opacity-transition-in");
                        clearTimeout(timout);
                    }, 300);
                });
                if (id === "about-me") {
                    headlineDiv.innerText = headline;
                    document.getElementById("text").innerText = text;
                    document.getElementById(id).classList.add("highlight");

                }
            }
        }
    }

    render() {
        return (
            <div className="about-me-container" id="aboutMe">
                <div className="about-me-content-wrapper">
                    <div className="headline-wrapper">
                        <p className="headline">About</p>
                        <p className="me">Me</p>
                    </div>
                    <div className="picture">
                        <div className="menu">
                            <p id="about-me" className="link-effect menu-element">About Me</p>
                            <p id="about-me2" className="link-effect menu-element">What do I do</p>
                            <p id="about-me3" className="link-effect menu-element">This website</p>
                        </div>
                        <div className="about-me-image" id="about-me-image">
                            <img id="thats-me" className="thats-me" src={thatsme}/>
                            <img id="my-picture" src={bewerbung}/>
                        </div>
                    </div>
                    <div className="about-me-content">
                        <div id="headline" className="content-headline"></div>
                        <div id="text" className="text-block"></div>
                        <div className="icons">
                            <a href="https://github.com/HenneGit" target="-_blank" className="icon">
                                <FontAwesomeIcon icon={faGit}/>
                            </a>
                            <a href="https://www.linkedin.com/in/henning-ahrens-52a183b1" target="-_blank"
                               className="icon">
                                <FontAwesomeIcon icon={faLinkedin}/>
                            </a>
                            <a href="#contact" className="icon">
                                <FontAwesomeIcon icon={faEnvelope}/>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

