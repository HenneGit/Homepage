import './cv.css'
import React, {Component} from 'react';


export default class Cv extends Component {
    constructor() {
        super();
    }

    componentDidMount() {

        let animationDone = false;

        function isInViewport(el) {
            const rect = el.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight));
        }


        const box = document.getElementById('skills');

        document.addEventListener('scroll', async function () {
            if (isInViewport(box)) {
                if (!animationDone) {
                    animationDone = true;
                    setTimeout(animateProgress, 200);
                }
            } else {
                animationDone = false;
            }
        }, {
            passive: true
        });

        function animateProgress() {
            let progressElements = document.querySelectorAll(".progress");

            for (let progressElement of progressElements) {
                let progressCount = parseInt(progressElement.getAttribute("progress"));
                let counter = 1;
                let interval = setInterval(() => {
                    counter++;
                    if (counter === progressCount) {
                        clearInterval(interval);
                    }
                    progressElement.style.strokeDasharray = counter + ",250.2";
                }, 2);
            }

        }


    }

    render() {
        return (<section id="cv">
                <div id="cv-container">
                    <div id="skills">
                        <div className="header-background skills-background">
                            <h1>Skills</h1>
                        </div>
                        <div className="skill-container">
                        <svg id="svg" viewBox="0 0 100 100" grid-row="1" grid-column="1">
                            <circle cx="50" cy="50" r="45" fill="#FDB900"/>
                            <path progress="75" className="progress" fill="none" stroke-linecap="round" stroke-width="5" stroke="#fff"
                                  stroke-dasharray="0,250.2"
                                  d="M50 10 a 40 40 0 0 1 0 80 a 40 40 0 0 1 0 -80"/>
                            <text id="count" progress="50 " x="50" y="50" text-anchor="middle" dy="7"
                                  font-size="20">50%
                            </text>
                        </svg>

                        <svg id="svg" viewBox="0 0 100 100" grid-row="1" grid-column="2">
                            <circle cx="50" cy="50" r="45" fill="#FDB900"/>
                            <path  progress="250"  className="progress" fill="none" stroke-linecap="round" stroke-width="5" stroke="#fff"
                                  stroke-dasharray="0,250.2"
                                  d="M50 10 a 40 40 0 0 1 0 80 a 40 40 0 0 1 0 -80"/>
                            <text id="count" progress="50 " x="50" y="50" text-anchor="middle" dy="7"
                                  font-size="20">50%
                            </text>
                        </svg>
                        <svg id="svg" viewBox="0 0 100 100" grid-row="2" grid-column="1">
                            <circle cx="50" cy="50" r="45" fill="#FDB900"/>
                            <path  progress="250"  className="progress" fill="none" stroke-linecap="round" stroke-width="5" stroke="#fff"
                                  stroke-dasharray="0,250.2"
                                  d="M50 10 a 40 40 0 0 1 0 80 a 40 40 0 0 1 0 -80"/>
                            <text id="count" progress="50 " x="50" y="50" text-anchor="middle" dy="7"
                                  font-size="20">50%
                            </text>
                        </svg>
                        <svg id="svg" viewBox="0 0 100 100" grid-row="2" grid-column="2">
                            <circle cx="50" cy="50" r="45" fill="#FDB900"/>
                            <path  progress="250" className="progress" fill="none" stroke-linecap="round" stroke-width="5" stroke="#fff"
                                  stroke-dasharray="0,250.2"
                                  d="M50 10 a 40 40 0 0 1 0 80 a 40 40 0 0 1 0 -80"/>
                            <text id="count" progress="50 " x="50" y="50" text-anchor="middle" dy="7"
                                  font-size="20">50%
                            </text>
                        </svg>
                        </div>
                    </div>
                    <div id="work">
                        <div className="header-background work-background">
                            <h1>Work</h1>
                        </div>
                        <div className="container">
                            <ul>
                                <li><span></span>
                                    <div>
                                        <div className="title">Product Manager</div>
                                        <div className="info">Producing of Games Brick-Force & Hazard Ops.</div>
                                        <div className="type">Infernum Productions</div>
                                    </div>
                                    <span className="number"><span>01/2013</span> <span>06/2016</span></span>
                                </li>
                                <li>
                                    <div><span></span>
                                        <div className="title">Java Backend Developer</div>
                                        <div className="info">Backend coding of BlueAnt</div>
                                        <div className="type">proventis GmbH</div>
                                    </div>
                                    <span className="number"><span>2018</span> <span>2022</span></span>
                                </li>
                          </ul>
                        </div>

                    </div>
                    <div id="education">
                        <div className="header-background education-background">
                            <h1>Education</h1>
                        </div>
                        <div className="container">
                            <ul>
                                <li><span></span>
                                    <div>
                                        <div className="title">B.A Media Science</div>
                                        <div className="info">Let&apos;s make coolest things in css</div>
                                        <div className="type">Philipps University Marburg</div>
                                    </div>
                                    <span className="number"><span>2012</span> <span></span></span>
                                </li>
                                <li>
                                    <div><span></span>
                                        <div className="title">Fachinformatik</div>
                                        <div className="info">Java, SQL, JavaScript, HTML/CSS</div>
                                        <div className="type">proventis GmbH</div>
                                    </div>
                                    <span className="number"><span>2021</span><span></span></span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    </div>



            </section>

        );
    }
}

