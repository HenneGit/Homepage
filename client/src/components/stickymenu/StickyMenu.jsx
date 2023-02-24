import React, {Component} from 'react'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons";
import './stickymenu.css'


export default class StickyMenu extends Component {
    constructor() {
        super();
    }

    componentDidMount() {
        function isInViewport(el) {
            let rect = el.getBoundingClientRect();
            let elemTop = rect.top;
            return elemTop >= 150;
        }
        addStickyMenuFunctions();
        let aboutMeSection = document.getElementById("about-me");
        document.getElementById("sticky-menu").classList.add("invisible");
        document.getElementById("link-container").classList.add("collapsed");
        document.addEventListener('scroll', async function () {
            if (isInViewport(aboutMeSection)) {
                document.getElementById("sticky-menu").classList.remove("invisible");
                document.getElementById("sticky-menu").classList.remove("slide-in");
                document.getElementById("sticky-menu").classList.add("slide-out");
            } else {
                document.getElementById("sticky-menu").classList.remove("slide-out");
                document.getElementById("sticky-menu").classList.add("slide-in");
                document.getElementById("link-container").classList.add("collapsed");
            }
        });

        function addStickyMenuFunctions() {
            document.getElementById("sticky-menu").addEventListener("click", toggleStickyMenu);
        }

        function toggleStickyMenu() {
            document.getElementById("link-container").classList.toggle("collapsed");
        }
    }


    render() {
        return (
            <div id="sticky-menu" className="sticky-menu">
                <div className="burger-icon">
                    <FontAwesomeIcon icon={faBars}/>
                </div>
                <div id="link-container" className="link-container">
                    <p className="sticky-menu-item"><a className='link-effect' href="#start">Top</a></p>
                    <p className="sticky-menu-item"><a className='link-effect' href="#about-me">About Me</a></p>
                    <p className="sticky-menu-item"><a className='link-effect' href="#chess-container">Chess</a></p>
                    <p className="sticky-menu-item"><a className='link-effect' href="#contact">Contact</a>
                    </p>
                </div>
            </div>

        );
    }


}
