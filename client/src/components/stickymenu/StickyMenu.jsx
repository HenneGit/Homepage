import React, {Component} from 'react'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons";
import './stickymenu.css'


export default class StickyMenu extends Component {
    constructor() {
        super();
    }

    componentDidMount() {

        addStickyMenuFunctions();

        function addStickyMenuFunctions() {
            document.getElementById("sticky-menu").addEventListener("click", toggleStickyMenu);
        }

        function toggleStickyMenu() {
            document.getElementById("link-container").classList.toggle("height-transition");
            document.querySelectorAll(".sticky-menu-item").forEach(el => el.classList.toggle("position-transition"))
        }

    }


    render() {
        return (
            <div id="sticky-menu" className="sticky-menu">
                <FontAwesomeIcon icon={faBars}/>
                <div id="link-container" className="link-container">
                    <p><a className='link-effect sticky-menu-item' href="#display">Home</a></p>
                    <p><a className='link-effect sticky-menu-item' href="#aboutMe">About Me</a></p>
                    <p><a className='link-effect sticky-menu-item' href="#chess-container">Chess</a></p>
                    <p><a className='link-effect sticky-menu-item' href="#contact">Contact</a></p>
                </div>
            </div>

        );
    }


}
