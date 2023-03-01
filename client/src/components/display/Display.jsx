import React, {Component} from 'react';
import './display.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown} from "@fortawesome/free-solid-svg-icons";
import {initLetterGrid} from "./js/letter_grid";


export default class Display extends Component {
    constructor() {
        super();
    }

    componentDidMount() {
        document.getElementById("arrow-down").addEventListener('click', function () {
            document.getElementById('about-me').scrollIntoView();
        });
        initLetterGrid('display-div', "hello", true, 'fade');



    }

    render() {
        return (
            <section id="display">
                <div id='display-div'></div>
                <div id='arrow-down'>
                    <FontAwesomeIcon icon={faChevronDown}/>
                </div>
            </section>
        )
    }
}
