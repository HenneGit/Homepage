import React, {Component, useEffect, useState} from 'react';
import './display.css';


export default class Display extends Component {
    constructor() {
        super();
    }

    componentDidMount() {
        init();


        /**
         * inits the page, collects active pixels and sets animation for appearing.
         * @returns {Promise<void>}
         */
        async function init() {
            let contentDiv = document.getElementById('content-div');
            await buildLetterGrid("hello", contentDiv);
            const pixels = contentDiv.querySelectorAll('.pixel-active');

            let array = [];
            let i = 0;
            for (let el of pixels) {
                array.push(el.id);
            }
            shuffle(array);

            let timer = setInterval(function () {

                const pix = document.getElementById(array[i]);
                pix.classList.add('fade');
                i++;
                if (i === pixels.length) {
                    clearInterval(timer);
                    complete();
                }
            }, 10);

        }

        /**
         * starts the moving down animation on shuffled rows.
         * @returns {Promise<void>}
         */
        async function movePixels() {
            const rows = getShuffledRows();
            for (let row of rows) {
                await startAnimationAndResolve(row);
            }
        }


        /**
         * waits 10 * row length ms and starts the animation for given rows.
         * @param row
         * @returns {Promise<Promise<unknown>>}
         */
        async function startAnimationAndResolve(row) {
            let blinkSquare = document.getElementsByClassName("blink");
            Array.from(blinkSquare).forEach(el => el.classList.remove("blink"));

            return new Promise(resolve => {
                setTimeout(function () {
                    playAnimation(row);
                    resolve();
                }, row.length * 10)
            });
        }

        /**
         * sets the transition class to all elements in row with an offset of 10ms
         * @param row
         */
        function playAnimation(row) {
            let i = 0;
            const timer = setInterval(function () {
                document.getElementById(row[i]).classList.add('move');
                i++;
                if (row === null || i === row.length) {
                    clearInterval(timer);
                }
            }, 10)

        }

        /**
         * shuffles all elements of an array.
         * @param array
         */
        function shuffle(array) {
            let counter = array.length;
            // While there are elements in the array
            while (counter > 0) {
                // Pick a random index
                let index = Math.floor(Math.random() * counter);
                counter--;
                // And swap the last element with it
                let temp = array[counter];
                array[counter] = array[index];
                array[index] = temp;
            }
        }

        /**
         * Pics random pixel. Sets timeout for pixel to add blinking class.
         */
        async function complete() {
            let pixels = document.querySelectorAll('.pixel-active');

            //pick random pixel and append tooltip.
            let x = Math.floor(Math.random() * Math.floor(pixels.length));
            let pix = pixels[x];


            //add event to tooltip
            pix.addEventListener('click', async function () {
                await movePixels();
                let contentDiv = document.getElementById('content-div');
                //reset pixels.
                setTimeout(() => {
                    removeChildren(contentDiv);
                    init();
                }, 500)

            });

            setTimeout(() => {
                pix.classList.add('blink');
            }, 1);

            pix.classList.add('enter');
        }


        /**
         * gets all active pixels of a row and shuffles them. Returns an array with all rows shuffled.
         * @returns {[]}
         */
        function getShuffledRows() {
            let elements = document.querySelectorAll('.pixel-active');
            let ids = Array.from(elements).map((element) => element.id);

            let rowNumbers = ['r6', 'r5', 'r4', 'r3', 'r2', 'r1', 'r0'];
            let rowIds = [];
            //filter ids for including each row no and push on rowIds array.
            rowNumbers.forEach(no => rowIds.push(ids.filter(id => {
                return id.includes(no)
            })));

            rowIds.forEach((row) => shuffle(row));
            return rowIds;
        }

        async function buildLetterGrid(word, container) {

            let letterCount = 0;
            while (letterCount < word.length) {
                let rows = 0b0;
                let letterDiv = document.createElement('div');
                letterDiv.id = 'l' + letterCount;
                letterDiv.classList.add('letter-box');
                while (rows < 7) {
                    let cells = 0;
                    while (cells < 5) {
                        let cell = document.createElement('div');
                        cell.id = 'l' + letterCount + 'r' + rows + 'c' + cells;
                        cell.classList.add('pixel');
                        letterDiv.appendChild(cell);
                        cells++;
                    }
                    rows++;
                }
                container.appendChild(letterDiv);
                letterCount++;
            }
            await initLetters(word);
        }

        async function initLetters(word) {
            let letters = await fetch("http://localhost:3000/letters.json",).then(resp => resp.json());
            let chars = Array.from(word);
            let l = 0;
            for (let char of chars) {
                for (let id of letters[char.toUpperCase()]) {
                    let pixel = document.getElementById('l' + l + id);
                    if (pixel === null) {
                        console.log(id);
                    }
                    pixel.classList.add('pixel-active');
                }
                l++;
            }
            cleanLetters();


        }

        function cleanLetters() {
            let letters = document.querySelectorAll('.letter-box');
            let columnNo = ['c0', 'c1', 'c2', 'c3', 'c4'];

            for (let letter of letters) {
                let inactive = Array.from(letter.children).filter(pixel => {
                    return !pixel.classList.contains('pixel-active');
                });

                let pixelToRemove = [];
                columnNo.forEach(no => pixelToRemove.push(inactive.filter(pixel => {
                    return pixel.id.includes(no);
                })));
                let columnCount = 5;
                for (let column of pixelToRemove) {
                    if (column.length === 7) {
                        column.forEach(pixel => letter.removeChild(pixel));
                        columnCount--;
                    }
                }
                letter.style.gridTemplateColumns = "repeat(" + columnCount + ", 1fr)";
            }
        }

        const removeChildren = (parent) => {
            while (parent.lastChild) {
                parent.removeChild(parent.lastChild);
            }
        };
    }

    render() {
        return (
            <div id='content-div'></div>
        )
    }
}
