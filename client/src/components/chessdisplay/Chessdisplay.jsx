import React, {Component} from "react";
import './chessdisplay.css';
import {initLetterGrid} from '../display/js/letter_grid'

export default class Chessdisplay extends Component {
    constructor() {
        super();
    }

    componentDidMount() {
        function isInViewport(el) {
            const rect = el.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight));
        }

        document.addEventListener('scroll', async function () {
            let letterContainer = document.getElementById("letter-container");
            if (isInViewport(letterContainer)) {
                initLetterGrid("letter-container", "chess", false, "chess-pixel");
            }

        });

    }


    render() {
        return (
            <section className="chess-display">
                <div id="letter-container" className="letter-container"></div>
            </section>
        );
    }
}
