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
        let aboutMeSection = document.getElementById("aboutMe");
        document.addEventListener('scroll', async function () {
            console.log(isInViewport(aboutMeSection));
            if (isInViewport(aboutMeSection)) {
                document.getElementById("sticky-menu").classList.remove("slide-in");
                document.getElementById("sticky-menu").classList.add("slide-out");
            } else {
                document.getElementById("sticky-menu").classList.remove("slide-out");
                document.getElementById("sticky-menu").classList.add("slide-in");

            }
        }, {
            passive: true
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
                    <p id="item-0" className="sticky-menu-item"><a className='link-effect ' href="#display">Home</a></p>
                    <p id="item-1" className="sticky-menu-item"><a className='link-effect' href="#aboutMe">About Me</a>
                    </p>
                    <p id="item-2" className="sticky-menu-item"><a className='link-effect'
                                                                   href="#chess-container">Chess</a></p>
                    <p id="item-3" className="sticky-menu-item"><a className='link-effect' href="#contact">Contact</a>
                    </p>
                </div>
            </div>

        );
    }


}
