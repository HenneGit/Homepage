import React, {Component} from "react";
import './emptysection.css';
import {initLetterGrid} from '../display/js/letter_grid'

export default class Emptysection extends Component {
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
            <section className="empty-section">
                <div id="letter-container" className="letter-container"></div>
            </section>
        );
    }
}
