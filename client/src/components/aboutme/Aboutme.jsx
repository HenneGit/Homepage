import React, {Component} from 'react';
import './aboutme.css';
import './slider.css';
import './viewport.css';
import './experience.css';
import thatsme from '../../assets/thatsme.png'
import bewerbung from '../../assets/bewerbung_gross.jpg'
import {faGit} from "@fortawesome/free-brands-svg-icons";
import {faLinkedin} from "@fortawesome/free-brands-svg-icons";
import {faEnvelope} from "@fortawesome/free-solid-svg-icons";
import {faChevronLeft} from "@fortawesome/free-solid-svg-icons";
import {faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {initProjects} from "./js/project_slider";

export default class Cv extends Component {
    constructor(state) {
        super(state);
        this.state = {
            showExperience: false,
            showAboutMe: true,
            showProjectSlider: false
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
            window.requestAnimationFrame(() => {
                if (this.state.showProjectSlider) {
                    initProjects();
                }
            });
        }
    componentDidMount() {

        //set mouseover events on picture.
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

    renderExperience = () => {
        if (!this.state.showExperience) {
            return null;
        } else {
            return (
                <>
                    <div id="headline" className="content-headline menu-background-yellow">Experience</div>
                    <div id="content-box">
                        <div id="experience-container" className="experience-container">
                            <div id="work-div" className="experience-container-column">
                                <h2>Work</h2>
                                <div>
                                    <div className="experience-item">
                                        <h3>2013 - 2016</h3>
                                        <h4>Product Manager - Infernum Productions</h4>
                                        <p>Responsible for managing the games Brick-Force and Hazard Ops. Task with
                                            Concept
                                            Writing, Developer Communcation, maintaining ingame economy, ingame
                                            sales.</p>
                                    </div>
                                    <div className="experience-item">
                                        <h3>2018 - 2021</h3>
                                        <h4>Apprenticeship Software Developer- Proventis GmbH</h4>
                                        <p>Bugfixing, Development of webapp DemoTool</p>

                                    </div>
                                    <div className="experience-item">
                                        <h3>2021 - 2022</h3>
                                        <h4>Software Developer- Proventis GmbH</h4>
                                        <p></p>
                                    </div>
                                </div>
                            </div>
                            <div id="education-div" className="experience-container-column">
                                <h2>Education</h2>
                                <div>
                                    <div className="experience-item">
                                        <h3>2008</h3>
                                        <h4>Bachelor Media Science - Marburg University</h4>
                                        <p>Mediaamateurs and genius Delitants - The way to internet fame</p>
                                    </div>
                                    <div className="experience-item">
                                        <h3>2021</h3>
                                        <h4>Fachinformatik - OSZimt Berlin</h4>
                                        <p>Commentfunction for polymorph entities</p>
                                    </div>
                                </div>
                            </div>
                            <div></div>
                        </div>
                    </div>
                </>
            );
        }

    }
    renderProjectSlider = () => {
        if (!this.state.showProjectSlider) {
            return null;
        } else {
            return (
                (
                    <>
                        <div id="headline" className="content-headline menu-background-green">My Projects</div>
                        <div id="content-box">
                            <div id="slideshow-container" className="slideshow-container">
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
                        </div>
                    </>
                )
            );
        }

    }
    renderAboutMe = () => {
        if (!this.state.showAboutMe) {
            return null;
        } else {
            return (
                <>
                    <div id="headline" className="content-headline menu-background-lila">About me</div>
                    <div id="content-box">
                        <div className="about-me-text">
                            <h1>Welcome to my personal homepage</h1>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                                ut
                                labore et dolore magna aliqua. Suspendisse potenti nullam ac tortor vitae purus faucibus
                                ornare suspendisse. Imperdiet proin fermentum leo vel. Nunc scelerisque viverra mauris
                                in
                                aliquam. Enim eu turpis egestas pretium aenean pharetra. Nulla aliquet enim tortor at
                                auctor
                                urna nunc id. Viverra maecenas accumsan lacus vel facilisis volutpat est velit egestas.
                                Velit scelerisque in dictum non consectetur a erat nam. Ut aliquam purus sit amet luctus
                                venenatis lectus magna fringilla. Mattis aliquam faucibus purus in massa tempor nec
                                feugiat
                                nisl. Sit amet consectetur adipiscing elit ut aliquam purus sit amet. Tincidunt id
                                aliquet
                                risus feugiat. Posuere morbi leo urna molestie at elementum eu. Tempus urna et pharetra
                                pharetra massa massa ultricies mi quis. Adipiscing vitae proin sagittis nisl rhoncus
                                mattis
                                rhoncus.</p>
                        </div>
                    </div>
                </>
            )
        }
    }


    onAboutMeClick = () => {
        if (this.state.showAboutMe) {
            return;
        }
        this.setTransitionOut("menu-1", "menu-background-lila");
        this.setTransitionIn("menu-1", "menu-background-lila");
        setTimeout(() => {
            this.setState({showExperience: false});
            this.setState({showAboutMe: true});
            this.setState({showProjectSlider: false});
        }, 500);
    }

    onExperienceClick = () => {
        if (this.state.showExperience) {
            return;
        }
        this.setTransitionOut("menu-2", "menu-background-yellow");
        this.setTransitionIn("menu-2", "menu-background-yellow");
        setTimeout(() => {
            this.setState({showExperience: true});
            this.setState({showAboutMe: false});
            this.setState({showProjectSlider: false});
        }, 500);

    }

    onProjectsClick = () => {
        if (this.state.showProjectSlider) {
            return;
        }
        this.setTransitionOut("menu-3", "menu-background-green");
        this.setTransitionIn("menu-3", "menu-background-green");
        setTimeout(() => {
            this.setState({showExperience: false});
            this.setState({showAboutMe: false});
            this.setState({showProjectSlider: true});
        }, 500);

    }

    /**
     * set transition in classes.
     */
    setTransitionIn(menuId, backgroundClass) {
        let menuItem = document.getElementById(menuId)
        menuItem.classList.add(backgroundClass);
        setTimeout(() => {
            menuItem.classList.remove("link-effect");
            let contentBox = document.getElementById("about-me-content");
            contentBox.classList.remove("opacity-transition-out")
            contentBox.classList.add("opacity-transition-in");
        }, 500);

    }


    /**
     * set transition opacity out classes.
     */
    setTransitionOut(menuId, backgroundClass) {
        document.querySelectorAll(".menu-element").forEach(el => {
            el.classList.remove(...el.classList);
            el.classList.add("link-effect");
            el.classList.add("menu-element");
        })
        let contentBox = document.getElementById("about-me-content");
        let menuItem = document.getElementById(menuId)
        menuItem.classList.remove(backgroundClass);
        contentBox.classList.remove("opacity-transition-in")
        contentBox.classList.add("opacity-transition-out");
    }


    render() {


        return (
            <section className="about-me-container" id="about-me">
                <div className="about-me-content-wrapper">
                    <div className="headline-wrapper">
                        <p className="headline">About</p>
                        <p className="me">Me</p>
                    </div>
                    <div className="sidebar">
                        <div className="menu">
                            <p id="menu-1" className="link-effect menu-element menu-background-grey"
                               onClick={this.onAboutMeClick}>About
                                Me</p>
                            <p id="menu-2" className="link-effect menu-element menu-background-grey"
                               onClick={this.onExperienceClick}>Experience</p>
                            <p id="menu-3" className="link-effect menu-element menu-background-grey"
                               onClick={this.onProjectsClick}>My
                                Projects</p>
                        </div>
                        <div className="about-me-image" id="about-me-image">
                            <img id="thats-me" className="thats-me" src={thatsme}/>
                            <img id="my-picture" src={bewerbung}/>
                        </div>
                        <div className="icons">
                            <a href="https://github.com/HenneGit" id="git-icon" target="-_blank" className="icon">
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
                    <div onLoad={this.renderAboutMe} className="about-me-content opacity-transition-in" id="about-me-content">
                        {this.renderAboutMe()}
                        {this.renderProjectSlider()}
                        {this.renderExperience()}
                    </div>
                </div>
            </section>
        );
    }
}

