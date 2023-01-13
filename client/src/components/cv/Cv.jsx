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
                    <div className="cv-block box-shadow" id="skills">
                        <div className="header-background skills-background">
                            <h1>Skills</h1>
                        </div>
                        <div className="skill-container">
                        <svg id="svg" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" />
                            <path progress="75" className="progress" fill="none" stroke-linecap="round" stroke-width="5" stroke="#fff"
                                  stroke-dasharray="0,250.2"
                                  d="M50 10 a 40 40 0 0 1 0 80 a 40 40 0 0 1 0 -80"/>
                            <text id="count" progress="50 " x="50" y="50" text-anchor="middle" dy="7"
                                  font-size="20">50%
                            </text>
                        </svg>
                        <svg id="svg" viewBox="0 0 100 100" grid-row="1" grid-column="2">
                            <circle cx="50" cy="50" r="45" />
                            <path  progress="250"  className="progress" fill="none" stroke-linecap="round" stroke-width="5" stroke="#fff"
                                  stroke-dasharray="0,250.2"
                                  d="M50 10 a 40 40 0 0 1 0 80 a 40 40 0 0 1 0 -80"/>
                            <text id="count" progress="50 " x="50" y="50" text-anchor="middle" dy="7">JavaScript</text>
                        </svg>
                        <svg id="svg" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45"/>
                            <path  progress="250"  className="progress" fill="none" stroke-linecap="round" stroke-width="5" stroke="#fff"
                                  stroke-dasharray="0,250.2"
                                  d="M50 10 a 40 40 0 0 1 0 80 a 40 40 0 0 1 0 -80"/>
                            <text id="count" progress="50 " x="50" y="50" text-anchor="middle" dy="7">CSS</text>
                        </svg>
                        <svg id="svg" viewBox="0 0 100 100" grid-row="2" grid-column="2">
                            <circle cx="50" cy="50" r="45" fill="#FDB900"/>
                            <path  progress="250" className="progress" fill="none" stroke-linecap="round" stroke-width="5" stroke="#fff"
                                  stroke-dasharray="0,250.2"
                                  d="M50 10 a 40 40 0 0 1 0 80 a 40 40 0 0 1 0 -80"/>
                            <text id="count" progress="50 " x="50" y="50" text-anchor="middle" dy="7">Java</text>
                        </svg>
                        </div>
                    </div>
                    <div className="cv-block box-shadow " id="work">
                        <div className="header-background work-background">
                            <p>Work</p>
                        </div>
                    </div>
                    <div className="cv-block box-shadow" id="education">
                        <div className="header-background education-background">
                            <p>Education</p>
                        </div>
                    </div>
                    </div>



            </section>

        );
    }
}

