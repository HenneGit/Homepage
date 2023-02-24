import React, {Component} from 'react';
import './aboutMe.css';
import './slider.css';
import thatsme from '../../assets/thatsme.png'
import bewerbung from '../../assets/bewerbung_gross.jpg'
import {faGit} from "@fortawesome/free-brands-svg-icons";
import {faLinkedin} from "@fortawesome/free-brands-svg-icons";
import {faEnvelope} from "@fortawesome/free-solid-svg-icons";
import {faChevronLeft} from "@fortawesome/free-solid-svg-icons";
import {faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {textObject} from "./js/about_me_text.js";
import {projects, renderProject} from "./js/projects"

export default class Cv extends Component {
    constructor() {
        super();
    }


    componentDidMount() {

        let slideCounter = 0;
        let numberOfSlides = 0;
        setTexts();
        initProjects();

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



        function initSlide() {
            let currentSlide = document.getElementById("slide-" + slideCounter);
            document.querySelectorAll(".slide").forEach(el => {
                el.classList.add("slide");
                if (el !== currentSlide) {
                    el.classList.add("not-there");
                } else {
                    el.classList.add("there");
                }
            });
        }

        function initProjects() {
            let projectCounter = 0;
            for (let project in projects) {
                let dot = document.createElement("div");
                dot.id = "dot-" + projectCounter;
                dot.classList.add("dot");
                document.getElementById("dot-container").appendChild(dot);
                let slide = document.createElement("div");
                let projectContainer = renderProject(projects[project]);
                slide.id = "slide-" + projectCounter;
                slide.classList.add("slide");
                slide.appendChild(projectContainer);
                document.getElementById("slide-container").appendChild(slide);
                projectCounter++;
            }
            numberOfSlides = projectCounter -1;
            initSlide();
            setUpDots();
        }


        function setUpDots() {
            document.getElementById("dot-0").classList.add("dot-active");
            document.getElementById("slider-arrow-right").addEventListener('click', () => {
                if (slideCounter === numberOfSlides) {
                    slideCounter = 0;
                } else {
                    slideCounter++;
                }
                let lastSlide = slideCounter === 0 ? numberOfSlides : slideCounter - 1;
                setDotActive(lastSlide);
                slide(lastSlide, "slide-right")
            });

            document.getElementById("slider-arrow-left").addEventListener('click', () => {
                if (slideCounter === 0) {
                    slideCounter = numberOfSlides;
                } else {
                    slideCounter--;
                }
                let lastSlide = slideCounter === numberOfSlides ? 0 : slideCounter + 1;
                setDotActive(lastSlide);
                slide(lastSlide, "slide-left");
            });
            document.querySelectorAll(".dot").forEach(el => {
                el.addEventListener("click", () => {
                    let id = el.id;
                    let currentSlide = slideCounter;
                    slideCounter = parseInt(id.substring(4, 5));
                    if (currentSlide < slideCounter) {
                        slide(currentSlide, "slide-right");
                    } else {
                        slide(currentSlide, "slide-left");
                    }
                    setDotActive(currentSlide);
                });
            })
        }

        function slide(lastSlideNr, slideDirection) {
            let activeSlide = document.getElementById("slide-" + slideCounter);
            let lastSlide = document.getElementById("slide-" + lastSlideNr);
            document.querySelectorAll(".slide").forEach(el => {
                el.classList.remove(...el.classList);
                el.classList.add("slide");
                if (el !== activeSlide && el !== lastSlide) {
                    el.classList.add("not-there");
                } else {
                    el.classList.add("there");
                }
            });

            if (slideDirection.includes("right")) {
                activeSlide.classList.add("start-right");
            } else {
                activeSlide.classList.add("start-left");
            }
            //give time to render elements before adding animation.
            setTimeout(() => {
                activeSlide.classList.add(slideDirection);
                lastSlide.classList.add(slideDirection);
            }, 1);


        }

        function setDotActive(lastDot) {
            let activeDot = document.getElementById("dot-" + slideCounter);
            let previousActiveDot = document.getElementById("dot-" + lastDot);
            previousActiveDot.classList.remove("dot-active");
            activeDot.classList.add("dot-active");
        }


        function setTexts() {
            let counter = 1;
            for (let id in textObject) {
                let object = textObject[id];
                let {headline} = object;
                let {text} = object;
                let {color} = object;
                let headlineDiv = document.getElementById("headline");
                let textDiv = document.getElementById("text-content");
                let menu = document.getElementById("menu-" + counter);
                document.getElementById("menu-" + counter).addEventListener("click", () => {
                    document.querySelectorAll(".menu-element").forEach(el => {
                        el.classList.toggle("background-transition");
                        el.classList.toggle("opacity-transition-in");
                        el.classList.add("link-effect");
                        el.style.background = "#2e2e30";
                    });

                    headlineDiv.style.background = color;
                    headlineDiv.classList.add("background-transition");
                    menu.classList.add("background-transition");
                    menu.style.background = color;

                    menu.classList.add("opacity-transition-out");
                    menu.classList.remove("opacity-transition-in");

                    headlineDiv.classList.add("opacity-transition-out");
                    headlineDiv.classList.remove("opacity-transition-in");

                    textDiv.classList.add("opacity-transition-out");
                    textDiv.classList.remove("opacity-transition-in");
                    headlineDiv.innerText = headline;
                    if (id === "about-me2") {
                        console.log("dies")
                        document.getElementById("slideshow-container").classList.remove("hidden");
                    } else {
                        console.log("das")
                        document.getElementById("slideshow-container").classList.add("hidden");
                    }
                    let timout = setTimeout(() => {
                        textDiv.innerText = text;
                        headlineDiv.classList.remove("opacity-transition-out");
                        textDiv.classList.remove("opacity-transition-out");
                        menu.classList.remove("opacity-transition-out");
                        menu.classList.remove("link-effect")
                        menu.classList.add("opacity-transition-in");
                        headlineDiv.classList.add("opacity-transition-in");
                        textDiv.classList.add("opacity-transition-in");
                        clearTimeout(timout);
                    }, 20);
                });
                if (id === "about-me") {
                    headlineDiv.innerText = headline;
                    menu.style.background = color;
                    headlineDiv.style.background = color;
                    document.getElementById("text-content").innerText = text;
                }

                counter++;
            }
            counter = 1;
        };
    }

    render() {
        const ProjectSlider = () => (
            <>
                <div id="slideshow-container" className="slideshow-container hidden">
                    <div className="slider-arrow" id="slider-arrow-left">
                        <FontAwesomeIcon icon={faChevronLeft}/>
                    </div>
                    <div className="slide-container" id="slide-container"></div>
                    <div className="slider-arrow" id="slider-arrow-right">
                        <FontAwesomeIcon icon={faChevronRight}/>
                    </div>
                    <div className="dots" id="dot-container">
                    </div>
                </div>
            </>
        )


        return (
            <section className="about-me-container" id="aboutMe">
                <div className="about-me-content-wrapper">
                    <div className="headline-wrapper">
                        <p className="headline">About</p>
                        <p className="me">Me</p>
                    </div>
                    <div className="sidebar">
                        <div className="menu">
                            <p id="menu-1" className="link-effect menu-element">About Me</p>
                            <p id="menu-2" className="link-effect menu-element">What do I do</p>
                            <p id="menu-3" className="link-effect menu-element">This website</p>
                        </div>
                        <div className="about-me-image" id="about-me-image">
                            <img id="thats-me" className="thats-me" src={thatsme}/>
                            <img id="my-picture" src={bewerbung}/>
                        </div>
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
                    <div className="about-me-content">
                        <div id="headline" className="content-headline"></div>
                        <div id="content" >
                            <div id="text-content" className="text-block"></div>
                            <ProjectSlider/>
                        </div>

                    </div>
                </div>
            </section>
        );
    }
}

