import {
    Board,
    Field,
    newGame,
    Piece,
    getBoard,
    setBoard,
    getBoardHistory,
    resetHalfMoves, incrementHalfMoves, pushHistory, setTurnNumber, getTurnNumber, setBoardHistory
} from "./game";
import {dragEnd, dragStart, resolveDrop} from "./drag_drop";
import {containsPiece, getField, getItemFromLocalStorage, getPiece, jsonCopy, setLocalStorage} from "./utilities";

export {init, updateField, createPiecePicker, createBoard, piecePicker, clearElement, createNewBoard, difficulty, getPieceWasPicked, setPieceWasPicked}

const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const flippedNumbers = [8, 7, 6, 5, 4, 3, 2, 1];
const difficulty = ["I want to win", "Easy", "Medium", "Hard", "I want to loose"];
let pieceWasPicked = true;


const positions = {
    "a1": new Piece('rook', 'white', 0, 3, "R"),
    "b1": new Piece('knight', 'white', 0, 1, "N"),
    "c1": new Piece('bishop', 'white', 0, 2, "B"),
    "d1": new Piece('queen', 'white', 0, 4, "Q"),
    "e1": new Piece('king', 'white', 0, 6, "K"),
    "f1": new Piece('bishop', 'white', 0, 2, "B"),
    "g1": new Piece('knight', 'white', 0, 1, "N"),
    "h1": new Piece('rook', 'white', 0, 3, "R"),
    "a8": new Piece('rook', 'black', 0, 3, "r"),
    "b8": new Piece('knight', 'black', 0, 1, "n"),
    "c8": new Piece('bishop', 'black', 0, 2, "b"),
    "d8": new Piece('queen', 'black', 0, 4, "q"),
    "e8": new Piece('king', 'black', 0, 6, "k"),
    "f8": new Piece('bishop', 'black', 0, 2, "b"),
    "g8": new Piece('knight', 'black', 0, 1, "n"),
    "h8": new Piece('rook', 'black', 0, 3, "r")
};



const piecePicker = function (color) {
    let piecePickerMap = new Map();
    piecePickerMap.set('bishop', new Piece('bishop', color, 0, 2, color === "white" ? "B" : "b"));
    piecePickerMap.set('knight', new Piece('knight', color, 0, 1, color === "white" ? "N" : "n"));
    piecePickerMap.set('rook', new Piece('rook', color, 0, 3, color === "white" ? "R" : "r"));
    piecePickerMap.set('queen', new Piece('queen', color, 0, 4, color === "white" ? "Q" : "q"));
    return piecePickerMap;
};


function init() {
    createNewBoard("white", true, "You");
    setUpBackButton();
    setUpForwardButton();
    setResetButton();
    setUpNewGameButton();
    setUpNewGamePanel();
}

function getPieceWasPicked() {
    return pieceWasPicked;
}

function setPieceWasPicked(newValue) {
    pieceWasPicked = newValue;
}

/**
 * create an element and add an id to it.
 * @param type the type of the element.
 * @param id the id of the element.
 * @returns {*} the created element.
 */
function createElement(type, id) {
    let el = document.createElement(type);
    el.id = id;
    return el;
}

/**
 * clear all child elements of a given element.
 * @param element the element to remove all children from.
 */
function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

/**
 * update piece movement in board.
 * @param oldFieldId the old field to delete piece from.
 * @param newFieldId the new field to set the piece on.
 * @param isRealMove if the moves is real and not simulated.
 */
function updateField(oldFieldId, newFieldId, isRealMove) {
    if (!isRealMove) {
        const boardCopy = jsonCopy(getBoard());
        getBoardHistory().push(boardCopy);
    }
    let newField = getField(newFieldId);
    let oldField = getField(oldFieldId);
    let fieldContainsPiece = containsPiece(newField);
    if (fieldContainsPiece) {
        if (isRealMove) {
            resetHalfMoves();
        }
        let enemyPiece = newField.piece;
        getBoard().graveyard.push(enemyPiece);
        newField.piece = null;
    }
    let piece = getPiece(oldField);
    oldField.piece = null;
    newField.piece = piece;
    if (piece !== null && (piece.type === "pawn" || fieldContainsPiece) && isRealMove) {
        resetHalfMoves();

    } else if (isRealMove) {
        incrementHalfMoves();
    }
    if (isRealMove) {
        const boardCopy = jsonCopy(getBoard());
        pushHistory(boardCopy);
    }
}

/**
 * creates a box to pick a piece when a pawn reached enemies base line.
 * @param dropField the field the pawn is reaching
 * @param oldField the field the pawn is coming from
 * @param color color of the pawn
 * @returns {Promise<void>}
 */
async function createPiecePicker(dropField, oldField, color) {
    let pieceMap = piecePicker(color);
    let container = document.createElement('div');
    let contentDiv = document.getElementById('board-div');
    container.id = 'piece-picker-box';
    let gridAreaX;
    if (getBoard().playerColor === "white") {
        gridAreaX = dropField.x;
    } else {
        gridAreaX = flippedNumbers[dropField.x - 1];
    }
    container.style.gridArea = 1 + "/" + gridAreaX + "/" + 5;
    for (let [pieceType, piece] of pieceMap) {
        if (piece.hasOwnProperty('type')) {
            let pieceBox = document.createElement('div');
            let imgDiv = cloneChessPiece(piece, false);
            pieceBox.appendChild(imgDiv);
            pieceBox.setAttribute('piece', pieceType);
            pieceBox.addEventListener('click', function () {
                oldField.piece = pieceMap.get(this.getAttribute('piece'));
                pieceWasPicked = true;
                resolveDrop(oldField.id, dropField.id, false);
            });
            pieceBox.classList.add('piece-in-piece-picker');
            container.appendChild(pieceBox);
        }
    }
    contentDiv.append(container);
    await waitForPiecePicked();
}

/**
 * waits till a piece was picked.
 * @returns {Promise<Promise<unknown>>} a promise that is resolved when a piece was picked.
 */
async function waitForPiecePicked() {
    return new Promise(resolve => {
        let timer = setInterval(function () {
            if (pieceWasPicked === true) {
                clearInterval(timer);
                resolve();
            }
        }, 20);
    });
}

/**
 * set up the reset button for returning to current board.
 */
function setResetButton() {
    let button = document.getElementById("resetButton");
    button.addEventListener("click", () => {
        setTurnNumber(getBoardHistory().length - 1);
        createBoard(getBoard(), false);
    });
}

/**
 * set up the new game button for starting a new game.
 */
function setUpNewGameButton() {
    let button = document.getElementById(("newGameButton"));
    button.addEventListener("click", appendNewGamePopUp);
}

/**
 * set up forward button to display the next move.
 */
function setUpForwardButton() {
    let button = document.getElementById("forwardButton");
    let turnNumber = getTurnNumber();
    let boardHistory = getBoardHistory();
    button.addEventListener("click", () => {
        if (turnNumber < boardHistory.length - 1) {
            createBoard(boardHistory[turnNumber += 1], true);
        } else if (boardHistory.length > 0 && turnNumber <= boardHistory.length) {
            createBoard(boardHistory[boardHistory.length - 1], true);
        }
    });

}

/**
 * set up the back button to display the previous move.
 */
function setUpBackButton() {
    let button = document.getElementById("backButton");
    let turnNumber = getTurnNumber();
    let boardHistory = getBoardHistory();
    button.addEventListener("click", () => {
        if (boardHistory.length > 2) {
            if (turnNumber >= 1) {
                if (turnNumber === boardHistory.length) {
                    setTurnNumber(turnNumber -= 2);
                } else {
                    setTurnNumber(turnNumber -= 1);
                }
                createBoard(boardHistory[turnNumber], true);
            }
        } else if (boardHistory.length > 0) {
            createBoard(boardHistory[0], true)
        }
    });
}


/**
 * get all pieces from graveyard
 * @param color
 * @returns {null|*}
 */
function getPiecesFromGraveyard(color) {
    let capturedPieces = getBoard().graveyard;
    if (capturedPieces !== null) {
        capturedPieces = capturedPieces.filter(piece => piece.color === color);
        return capturedPieces;
    }
    return null;
}


/**
 * waits for the return to start animation to be done.
 */
async function awaitReturnToStartAnimation() {
    let playerName = getBoard().playerName;
    if (getBoardHistory().length > 0) {
        await returnToStartAnimation();
    } else {
        createNewBoard("white", true, playerName);
    }
}

/**
 * creates a small popup over the new game button to confirm that a new game will be started.
 */
function appendNewGamePopUp() {
    let wrapper = createElement("div", "new-game-balloon");
    let buttonWrapper = createElement("div", "button-wrapper");
    let buttonCancel = createElement("button", "button-cancel");
    buttonCancel.innerText = "Cancel";
    buttonCancel.addEventListener("click", () => {
        document.getElementById("buttons").removeChild(document.getElementById("new-game-balloon"));
    })
    let buttonConfirm = createElement("button", "button-confirm");
    buttonConfirm.addEventListener("click", () => {
        document.getElementById("buttons").removeChild(document.getElementById("new-game-balloon"));
        awaitReturnToStartAnimation();
    });
    buttonConfirm.innerText = "Yes";
    let text = createElement("div", "new-game-text");
    text.innerText = "Start a new game?";
    buttonWrapper.append(buttonCancel, buttonConfirm);
    wrapper.append(text, buttonWrapper);
    document.getElementById("buttons").append(wrapper);
}

/**
 * gets all moves from history and plays an animation moving all pieces backwards to starting position.
 * @returns {Promise<unknown>} the promise to wait for.
 */
async function returnToStartAnimation() {
    return new Promise((resolve) => {
        let counter = getBoardHistory().length - 1;
        let playerName = getBoard().playerName;
        let interval = setInterval(() => {
            let board = getBoardHistory()[counter];
            createBoard(board);
            if (counter === 0) {
                localStorage.clear();
                createNewBoard("white", true, playerName);
                clearInterval(interval);
            }
            counter--;
        }, 100)
        resolve();
    })
}

/**
 * create a new board an reset all moves.
 * @param playerColor the color of curent player.
 * @param isInitBoard if its a fresh board to be created from scratch.
 * @param playerName name of the player.
 */
function createNewBoard(playerColor, isInitBoard, playerName) {
    let fields = [];
    let graveyard = [];
    let storedBoard = getItemFromLocalStorage("board");
    let storedHistory = getItemFromLocalStorage("history");
    if (storedBoard !== null && storedHistory !== null) {
        setBoardHistory(storedHistory);
        setBoard(storedBoard);
        setTurnNumber(getBoardHistory().length - 1);
        createBoard(storedBoard, false);
        return;
    }
    setBoard(null);
    setUpNewGamePanel(playerName);
    for (let i = 1; i < 9; i++) {
        for (let j = 8; j > 0; j--) {
            let letter = letters[j - 1];
            let piece = positions[letter + i] === undefined ? null : positions[letter + i];
            if (i === 2 || i === 7) {
                let color = i === 7 ? 'black' : 'white';
                piece = new Piece('pawn', color, 0, 0, color === "white" ? "P" : "p");
            }
            let field = new Field(piece, letter + i, j, i);
            fields.push(field);
        }
    }
    setBoard(new Board(fields, graveyard, playerColor, [], playerName));
    createBoard(getBoard(), isInitBoard);
}

/**
 * setup the new game panel with game settings.
 * @param playerName the player name to add to the player name input box.
 */
function setUpNewGamePanel(playerName) {
    if (getBoard() !== null) {
        return;
    }
    let panel = document.getElementById("turns");
    clearElement(panel);
    let wrapper = createElement("div", "new-game-wrapper");
    let level = createElement("select", "difficulty");
    for (let skillLevel of difficulty) {
        level.append(getOption(skillLevel));
    }
    let input = createElement("input", "player-name-input");
    if (playerName === undefined) {
        input.placeholder = "Your name...";
    } else {
        input.value = playerName;
    }
    let playerColor = createElement("select", "playerColor");
    playerColor.append(getOption("White"), getOption("Black"));
    let startGameButton = createElement("button", "start-game-button");
    startGameButton.innerText = "Start Game";
    startGameButton.addEventListener("click", newGame);
    startGameButton.classList.add("new-game-item");
    level.classList.add("new-game-item");
    input.classList.add("new-game-item");
    playerColor.classList.add("new-game-item");
    wrapper.append(level, playerColor, input, startGameButton);
    panel.append(wrapper)

}

/**
 * creates an option element with given text.
 * @param optionText the text for the option.
 * @returns {*} the created option element.
 */
function getOption(optionText) {
    let option = createElement("option");
    option.innerText = optionText;
    return option;
}


/**
 * create the board and add pieces to it.
 * @param currentBoard the board to create the field from.
 * @param isInitBoard
 */
function createBoard(currentBoard, isInitBoard) {
    let playerName = currentBoard.playerName === undefined ? "You" : currentBoard.playerName;
    document.getElementById("turns").scrollTo(0, document.getElementById("turns").scrollHeight);
    document.getElementById("player-name").innerText = playerName;
    if (getBoardHistory().length > 0) {
        setLocalStorage("board", getBoard());
        setLocalStorage("history", getBoardHistory());
    }
    let contentDiv = document.getElementById('chess');
    let isBlack = currentBoard.playerColor === "black";
    clearElement(contentDiv);
    let boardDiv = createElement('div', 'board-div');
    let blackOrWhite = -1;
    for (let field of currentBoard.fields) {
        let domField = createElement('div', field.id);
        addLetterOrNumberGrid(field, domField, isBlack)
        let classType = blackOrWhite < 0 ? 'white' : 'black';
        domField.classList.add(classType);
        domField.classList.add('field');
        domField.setAttribute('y', field.y);
        domField.setAttribute('x', field.x);
        if (isBlack) {
            domField.style.gridArea = field.y + "/" + flippedNumbers[field.x - 1];
        } else {
            domField.style.gridArea = flippedNumbers[field.y - 1] + "/" + field.x;
        }
        let boardHistory = getBoardHistory();
        if (field.piece !== null) {
            if (isInitBoard && boardHistory.length > 0) {
                isInitBoard = currentBoard.moveTracker.length !== boardHistory[boardHistory.length - 1].moveTracker.length;
            }
            domField.appendChild(cloneChessPiece(field.piece, isInitBoard));
        }
        boardDiv.appendChild(domField);
        blackOrWhite = blackOrWhite * -1;
        if (field.x === 1) {
            blackOrWhite = blackOrWhite * -1;
        }
    }
    contentDiv.appendChild(boardDiv);
    document.querySelectorAll(".last-move").forEach(el => el.classList.remove("last-move"));
    setUpLastMove(currentBoard.moveTracker);
    setUpGraveyard();
    setTurn(currentBoard)
}

/**
 * mark the field of the last move made.
 * @param moveTracker the movetracker containing the last move.
 */
function setUpLastMove(moveTracker) {
    if (moveTracker.length > 0) {
        let lastMove = moveTracker[moveTracker.length - 1];
        addLastMoveClasses(document.getElementById(lastMove[0]));
        addLastMoveClasses(document.getElementById(lastMove[1]));
    }
}

/**
 * add last move css classes.
 * @param field the field to add the classes for.
 */
function addLastMoveClasses(field) {
    field.classList.remove("white");
    field.classList.remove("black");
    field.classList.add("last-move");
}

/**
 * create the turns panel and set all made move in it.
 * @param currentBoard the
 */
function setTurn(currentBoard) {
    let moveTracker = currentBoard.moveTracker;
    if (moveTracker.length === 0) {
        return;
    }
    let turns = document.getElementById("turns");
    let table = createElement("table", "turn-table");

    clearElement(turns);
    let turnCounter = 1;
    for (let move of moveTracker) {
        let turnRow = createElement("tr", "turn-column");
        let turn = createElement("td", "turn-" + turnCounter);
        let startMove = createElement("td", "turn-" + turnCounter + "-start-move");
        let endMove = createElement("td", "turn-" + turnCounter + "-end-move");
        if (turnCounter % 2 === 0) {
            turnRow.classList.add("turn-even");
        } else {
            turnRow.classList.add("turn-odd");
        }
        turn.innerText = turnCounter + ".";
        startMove.innerText = move[0];
        endMove.innerText = move[1];
        turnRow.append(turn, startMove, endMove);
        table.append(turnRow);
        turnCounter++;
    }
    turns.appendChild(table);
}

/**
 * add the numbers and letters on y and y axis.
 * @param field the field to add the number or letter to.
 * @param domField the domfield to attach the number/letter to.
 * @param isBlack if the human player is playing black pieces or not.
 */
function addLetterOrNumberGrid(field, domField, isBlack) {
    let letter = isBlack ? "h" : "a";
    let moduloResult = isBlack ? 1 : 0;
    let number = isBlack ? "8" : "1";
    if (field.id.includes(letter)) {
        let numberDiv = createElement("div", "numeric-div");
        let number = field.y;
        if (number % 2 === moduloResult) {
            numberDiv.classList.add("white");
        } else {
            numberDiv.classList.add("black");
        }
        numberDiv.innerText = number;
        domField.appendChild(numberDiv);
    }
    //add letters and number grid.
    if (field.id.includes(number)) {
        let letterDiv = createElement("div", "letter-div");
        letterDiv.classList.add("letter-div");
        let number = field.x;
        if (number % 2 === moduloResult) {
            letterDiv.classList.add("white");
        } else {
            letterDiv.classList.add("black");
        }
        letterDiv.innerText = letters[field.x - 1];
        domField.appendChild(letterDiv);
    }

}


/**
 * create the panel where graveyard and moves are displayed.
 */
function setUpGraveyard() {
    let blackPieces = getPiecesFromGraveyard('black');
    let whitePieces = getPiecesFromGraveyard('white');
    if (getBoard().playerColor === "black") {
        appendPiecesToGraveyard(blackPieces, "top");
        appendPiecesToGraveyard(whitePieces, "bottom");
    } else {
        appendPiecesToGraveyard(whitePieces, "top");
        appendPiecesToGraveyard(blackPieces, "bottom");
    }
}

/**
 * append captured pieces to the graveyard.
 * @param pieces the pieces to append.
 * @param sideOfBoard if top or bottom player.
 */
function appendPiecesToGraveyard(pieces, sideOfBoard) {
    let sortablePieceArray = Array.from(pieces);
    sortablePieceArray.sort(function (a, b) {
        return b.sort - a.sort;
    });
    let graveyard = document.getElementById(sideOfBoard + "Graveyard");
    let spans = graveyard.querySelectorAll("span");
    spans.forEach(span => clearElement(span));

    sortablePieceArray.forEach(piece => {
        let typeGraveyard = document.getElementById(sideOfBoard + "-" + piece.type);
        let pieceDiv = cloneChessPiece(piece, true);
        pieceDiv.classList.remove("piece");
        pieceDiv.classList.add("graveyard-piece");
        typeGraveyard.appendChild(pieceDiv);
    });
}

/**
 * clone a chess piece.
 * @param piece the piece to clone
 * @param isInitBoard if its a fresh board.
 * @returns {Node} a div with the cloned piece.
 */
function cloneChessPiece(piece, isInitBoard) {
    let color = piece.color;
    let type = piece.type
    let pieceDiv = document.getElementById(type).cloneNode(true);
    pieceDiv.id = color + type;
    pieceDiv.classList.add("piece-" + color);
    pieceDiv.classList.remove("invisible");
    pieceDiv.classList.add("piece");
    let board = getBoard();
    if (board !== null && color === board.playerColor && !isInitBoard) {
        pieceDiv.draggable = true;
        pieceDiv.addEventListener('dragstart', dragStart);
        pieceDiv.addEventListener('dragend', dragEnd);
    }
    return pieceDiv;
}

