import {letters} from './letters.js';

/**
 * inits the page, collects active pixels and sets animation for appearing.
 * @returns {Promise<void>}
 */
export function initLetterGrid(displayContainerId, word, addAnimation, pixelStyle) {
    console.log(displayContainerId)
    let contentDiv = document.getElementById(displayContainerId);
    if (contentDiv.children.length > 0) {
        return;
    }
    buildLetterGrid(word, contentDiv);
    const pixels = contentDiv.querySelectorAll('.pixel-active');

    let array = [];
    let i = 0;
    for (let el of pixels) {
        array.push(el.id);
    }
    shuffle(array);
    let timer = setInterval(function () {
        const pix = contentDiv.querySelector("#" + array[i]);
        if (pix === undefined || pix === null) {
            clearInterval(timer);

        }
        pix.classList.add(pixelStyle);
        i++;
        if (i === pixels.length) {
            clearInterval(timer);
            complete(displayContainerId,word, addAnimation);
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
    if (blinkSquare === undefined || blinkSquare === null) {
        return;
    }
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
async function complete(displayContainerId,word, addAnimation) {
    let contentDiv = document.getElementById(displayContainerId);
    let pixels = contentDiv.querySelectorAll('.pixel-active');

    //pick random pixel and append tooltip.
    let x = Math.floor(Math.random() * Math.floor(pixels.length));
    let pix = pixels[x];


    //add event to tooltip
    pix.addEventListener('click', async function () {
        await movePixels();
        //reset pixels.
        setTimeout(() => {
            removeChildren(contentDiv);
            initLetterGrid(displayContainerId, word, addAnimation);
        }, 500)
    });
    if (addAnimation) {

        setTimeout(() => {
            pix.classList.add('blink');
        }, 1);

        pix.classList.add('enter');
    }
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

/**
 * sets up the letters and appends them to chosen container.
 * @param word the word to build the letters for.
 * @param container the container to append the letters to.
 */
function buildLetterGrid(word, container) {
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
    initLetters(word, container);
}

/**
 * create the display from given word.
 * @param word the word to display.
 * @returns {Promise<void>}
 */
function initLetters(word, containerDiv) {
    let chars = Array.from(word);
    let l = 0;
    for (let char of chars) {
        for (let id of letters[char.toUpperCase()]) {
            let pixel = containerDiv.querySelector('#l' + l + id);
            pixel.classList.add('pixel-active');
        }
        l++;
    }
    cleanLetters(containerDiv);
}

/**
 * remove pixel columns without active pixels.
 */
function cleanLetters(containerDiv) {
    let letters = containerDiv.querySelectorAll('.letter-box');
    let columnNumber = ['c0', 'c1', 'c2', 'c3', 'c4'];

    for (let letter of letters) {
        let inactive = Array.from(letter.children).filter(pixel => {
            return !pixel.classList.contains('pixel-active');
        });

        let pixelToRemove = [];
        columnNumber.forEach(no => pixelToRemove.push(inactive.filter(pixel => {
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

/**
 * remove all children from an element.
 * @param parent
 */
const removeChildren = (parent) => {
    while (parent.lastChild) {
        parent.removeChild(parent.lastChild);
    }
};