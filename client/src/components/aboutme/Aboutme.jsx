import React, {Component} from 'react';
import './css/aboutme.css';
import './css/slider.css';
import './css/experience.css';
import './css/viewport.css';
import bewerbung from '../../assets/bewerbung_hoch.jpg'
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


    }

    renderExperience = () => {
        if (!this.state.showExperience) {
            return null;
        } else {
            return (
                <>
                    <div id="headline" className="content-headline">Experience</div>

                    <div id="content-box">
                        <div id="experience-container" className="experience-container">
                            <div id="work-div" className="experience-container-column">
                                <h2>Work</h2>
                                <div>
                                    <div className="experience-item">
                                        <h3>2021 - 2022</h3>
                                        <h4>Software Developer- proventis GmbH</h4>
                                        <p>Backend Development of BlueAnt, Bugfixing. Java, JavaScript, CSS</p>
                                        <p></p>
                                    </div>
                                    <div className="experience-item">
                                        <h3>2018 - 2021</h3>
                                        <h4>Vocational training Software Developer- proventis GmbH</h4>
                                        <p>Bugfixing, Development of webapp DemoTool. Java, JavaScript, CSS</p>

                                    </div>
                                    <div className="experience-item">
                                        <h3>2013 - 2016</h3>
                                        <h4>Product Manager - Infernum Productions</h4>
                                        <p>Responsible for managing the games Brick-Force and Hazard Ops. Tasked with
                                            Concept
                                            Writing, Developer Communcation, maintaining ingame economy, ingame
                                            sales.</p>
                                    </div>


                                </div>
                            </div>
                            <div id="education-div" className="experience-container-column">
                                <h2>Education</h2>
                                <div>
                                    <div className="experience-item">
                                        <h3>2021</h3>
                                        <h4>Fachinformatik - OSZimt Berlin</h4>
                                        <p>Commentfunction for polymorph entities</p>
                                    </div>
                                    <div className="experience-item">
                                        <h3>2008</h3>
                                        <h4>Bachelor Media Science - Marburg University</h4>
                                        <p>Mediaamateurs and genius Delitants - The way to internet fame</p>
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
                        <div id="headline" className="content-headline">My Projects</div>
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
                    <div id="headline" className="content-headline">About me</div>
                    <div id="content-box">
                        <div className="about-me-text">
                            <h2>Welcome to my personal homepage</h2>
                            <p>Willkommen auf meiner persönlichen Webseite! Hier präsentiere ich meine neuesten Projekte
                                und Ideen, die ich in meiner Freizeit entwickle. Ein Übersiche findest du
                                unter <a className="link link-effect" onClick={this.onProjectsClick}>My Projects</a></p>
                            <p>
                                Das jüngste Projekt ist ein Schachspiel, das ich programmiert habe um mich in Javascript
                                einzuarbeiten.
                                Ziel war es alle Zuglogiken selbst zu implementieren und im letzen Schritt das Spiel
                                gegen die Open Source Schach Engine Stockfish als Computergegner möglich zu machen.
                                Falls dich der Code des Spiels interessiert, ist dieser auf <a target="_blank"
                                                                                               className="link link-effect"
                                                                                               href="https://github.com/HenneGit/Homepage/tree/main/client/src/components/chess">GitHub</a> einsehbar.
                                Ich freue mich über immer über Feedback und Vorschläge für Verbesserungen.
                            </p>
                            <p>Ich werde auch in Zukunft diese Seite nutzen um Ideen umzusetzen oder um neue
                                Technologien zu erlernen.
                                Wenn du Fragen oder Kommentare hast oder einfach nur Hallo sagen möchtest, schreib mir
                                doch eine Nachricht über das <a className="link link-effect"
                                                                href="#contact">Kontaktformular</a>. Ich würde mich sehr
                                freuen, von dir zu hören!
                            </p>
                            <p>
                                Schön, dass du vorbeigeschaut hast!
                            </p>
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
        this.setTransitionOut("menu-1", "menu-background-1");
        this.setTransitionIn("menu-1", "menu-background-1");
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
        this.setTransitionOut("menu-2", "menu-background-2");
        this.setTransitionIn("menu-2", "menu-background-2");
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
        this.setTransitionOut("menu-3", "menu-background-3");
        this.setTransitionIn("menu-3", "menu-background-3");
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
        console.log(menuItem);
        menuItem.classList.add(backgroundClass);
        menuItem.classList.add("menu-active");
        setTimeout(() => {
            let contentBox = document.getElementById("content-and-headline");
            contentBox.classList.remove("opacity-transition-out")
            contentBox.classList.add("opacity-transition-in");
            menuItem.classList.add(backgroundClass);
        }, 500);
        menuItem.classList.remove("link-effect");
    }


    /**
     * set transition opacity out classes.
     */
    setTransitionOut(menuId, backgroundClass) {
        document.querySelectorAll(".menu-element").forEach(el => {
            el.classList.remove(...el.classList);
            el.classList.add("link-effect");
            el.classList.add("menu-element");
        });
        let headlineBackground = document.getElementById("headline-background");
        headlineBackground.classList.remove(...headlineBackground.classList);
        headlineBackground.classList.add(backgroundClass);
        headlineBackground.classList.add("headline-background");

        setTimeout(() => {
            let contentBox = document.getElementById("content-and-headline");
            let menuItem = document.getElementById(menuId)
            menuItem.classList.remove(backgroundClass);
            contentBox.classList.remove("opacity-transition-in")
            contentBox.classList.add("opacity-transition-out");
        }, 20);

    }


    render() {
        return (
            <section className="about-me-section" id="about-me">
                <div className="about-me-content-wrapper">
                    <div className="headline-wrapper">
                        <p className="headline">About</p>
                        <p className="me">Me</p>
                    </div>
                    <div className="sidebar">
                        <div className="about-me-image" id="about-me-image">
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
                    <div onLoad={this.renderAboutMe} className="about-me-content"
                         id="about-me-content">
                        <div className="menu">
                            <p id="menu-1" className="link-effect menu-element menu-background-1 menu-active"
                               onClick={this.onAboutMeClick}>About
                                Me</p>
                            <p id="menu-2" className="link-effect menu-element menu-background-grey"
                               onClick={this.onExperienceClick}>Experience</p>
                            <p id="menu-3" className="link-effect menu-element menu-background-grey"
                               onClick={this.onProjectsClick}>My
                                Projects</p>
                        </div>
                        <div id="headline-background" className="headline-background headline menu-background-1"></div>
                        <div className="content-and-headline opacity-transition-in" id="content-and-headline">
                            {this.renderAboutMe()}
                            {this.renderProjectSlider()}
                            {this.renderExperience()}
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

