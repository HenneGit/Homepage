import React, {Component} from "react";
import './emptysection.css';
import {initLetterGrid} from '../display/js/letter_grid'

export default class Emptysection extends Component {
    constructor() {
        super();
    }

    componentDidMount() {

        // initLetterGrid("letter-container")


    }


    render() {
        return (
          <section className="empty-section">
              <div className="letter-container"></div>
          </section>
        );
    }
}
