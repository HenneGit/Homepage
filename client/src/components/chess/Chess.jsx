import React, {Component} from "react";
import './chess.css';
import avatar from '../../assets/avatar.png'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faChevronRight} from '@fortawesome/free-solid-svg-icons'
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons'
import {faRotateLeft} from '@fortawesome/free-solid-svg-icons'
import {faPlus} from '@fortawesome/free-solid-svg-icons'
import {faChessBishop} from '@fortawesome/free-solid-svg-icons'
import {faChessPawn} from '@fortawesome/free-solid-svg-icons'
import {faChessRook} from '@fortawesome/free-solid-svg-icons'
import {faChessKing} from '@fortawesome/free-solid-svg-icons'
import {faChessQueen} from '@fortawesome/free-solid-svg-icons'
import {faChessKnight} from '@fortawesome/free-solid-svg-icons'


export default class Chess extends Component {
    constructor() {
        super();
    }


    componentDidMount() {

        const stockfish = new Worker("http://localhost:3000/stockfish.js");
        stockfish.onmessage = async function onmessage(message) {
            console.log(message);
            if (message.data.includes("bestmove")) {
                if (message.data.includes("none")) {
                    return;
                }
                const messageArray = message.data.split(" ");
                const move = messageArray[1];
                const startFieldId = move.substring(0, 2);
                const endFieldId = move.substring(2, 4);
                const queeningMove = move.substring(4, 5);
                board.moveTracker.push([startFieldId, endFieldId]);
                turnNumber += 1;
                if ((startFieldId === "e8" && endFieldId === "g8") || startFieldId === "e1" && endFieldId === "g1") {
                    castleRight(getField(startFieldId), true);
                    return;
                }
                if ((startFieldId === "e8" && endFieldId === "c8") || startFieldId === "e1" && endFieldId === "c1") {
                    castleLeft(getField(startFieldId), true);

                    return;
                }
                let piece = getField(startFieldId).piece;
                if (piece !== null && piece.type === "pawn") {
                    if (startFieldId.includes("5") || startFieldId.includes("4")) {
                        let endField = getField(endFieldId)
                        if (endField.piece === null && endField.id.substring(0, 1) !== startFieldId.substring(0, 1)) {
                            let enemyField = board.playerColor === "black" ? getFieldByXY(endField.x, endField.y - 1) : getFieldByXY(endField.x, endField.y + 1);
                            if (enemyField.piece !== null && enemyField.piece.type === "pawn") {
                                executeEnPassant(enemyField, getField(startFieldId), endField, true);
                                return;
                            }
                        }
                    }
                }

                let pieceMap = piecePicker(getOppositeColor(board.playerColor));
                if (queeningMove !== "") {
                    for (let [pieceType, newPiece] of pieceMap) {
                        if (newPiece.fenChar === queeningMove) {
                            let queeningField = getField(startFieldId);
                            queeningField.piece = newPiece;
                        }
                    }
                }

                await updateFieldPromise(startFieldId, endFieldId).then(() => {
                    console.log("Schachmatt hier");
                    checkForCheckMate(board.playerColor);
                    piece.moveNumber += 1;
                });

            }
        };

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

        let pieceWasPicked = true;

        const directions = {
            diagonal: {
                upLeft: [-1, 1],
                upRight: [1, 1],
                downLeft: [-1, -1],
                downRight: [1, -1]
            },
            straight: {
                left: [-1, 0],
                right: [1, 0],
                up: [0, +1],
                down: [0, -1]
            }
        };

        const vectors = [[2, -1], [2, 1], [-1, 2], [1, 2], [-1, -2], [1, -2], [-2, 1], [-2, -1]];
        const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const flippedNumbers = [8, 7, 6, 5, 4, 3, 2, 1];
        const difficulty = ["I want to win", "Easy", "Medium", "Hard", "I want to loose"];
        let board = null;
        let boardHistory = [];
        let turnNumber = -1;
        let halfMoves = 0;

        function Piece(type, color, moveNumber, sort, fenChar) {
            this.type = type;
            this.color = color;
            this.moveNumber = moveNumber;
            this.sort = sort;
            this.fenChar = fenChar;
        }

        function Field(piece, id, x, y) {
            this.piece = piece;
            this.id = id;
            this.x = x;
            this.y = y;
        }

        function Board(fields, graveyard, playerColor, moveTracker, playerName) {
            this.fields = fields;
            this.graveyard = graveyard;
            this.playerColor = playerColor;
            this.moveTracker = moveTracker;
            this.playerName = playerName;

        }

        createNewBoard("white", true, "You");
        setUpBackButton();
        setUpForwardButton();
        setResetButton();
        setUpNewGameButton();
        setUpNewGamePanel();

        /**
         * init a new board with pieces in starting position.
         */
        async function newGame() {
            localStorage.clear();
            board = null;
            let playerColorLB = document.getElementById("playerColor");
            let playerNameInput = document.getElementById("player-name-input").value;
            let playerName = playerNameInput === undefined ? "You" : playerNameInput;
            let playerColor;
            if (playerColorLB !== null) {
                playerColor = playerColorLB.options[playerColorLB.selectedIndex].innerText.toLowerCase();
            } else {
                playerColor = "white"
            }
            let skillLevel = document.getElementById("difficulty").value;
            setUpEngine(skillLevel);
            turnNumber = 0;
            board = null;
            halfMoves = null;
            boardHistory = [];

            createNewBoard(playerColor, false, playerName);
            clearElement(document.getElementById("turns"));
            if (board.playerColor === "black") {
                makeEngineMove();
            }
        }

        /**
         * waits for the return to start animation to be done.
         */
        async function awaitReturnToStartAnimation() {
            let playerName = board.playerName;
            if (boardHistory.length > 0) {
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
                let counter = boardHistory.length - 1;
                let playerName = board.playerName;
                let interval = setInterval(() => {

                    let board = boardHistory[counter];
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
                boardHistory = storedHistory;
                board = storedBoard;
                turnNumber = boardHistory.length - 1;
                createBoard(storedBoard, false);
                return;
            }
            board = null;
            boardHistory = [];
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
            board = new Board(fields, graveyard, playerColor, [], playerName);
            createBoard(board, isInitBoard);
        }

        /**
         * setup the new game panel with game settings.
         * @param playerName the player name to add to the player name input box.
         */
        function setUpNewGamePanel(playerName) {
            if (board !== null) {
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
         * set a json string to local storage.
         * @param key the key for the item.
         * @param item the item to store in localstorage.
         */
        function setLocalStorage(key, item) {
            localStorage.setItem(key, JSON.stringify(item));
        }

        /**
         * get an item from local storage.
         * @param key the key to find the item for.
         * @returns {any} the found item.
         */
        function getItemFromLocalStorage(key) {
            if (key === null || key === undefined) {
                return null;
            }
            let item = localStorage.getItem(key);
            if (item !== null) {
                return JSON.parse(item);
            }
            return null;
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
            if (boardHistory.length > 0) {
                setLocalStorage("board", board);
                setLocalStorage("history", boardHistory);
            }
            let contentDiv = document.getElementById('chess');
            let isBlack = currentBoard.playerColor === "black";
            clearElement(contentDiv);
            let boardDiv = createElement('div', 'board-div');
            let blackOrWhite = -1;
            for (let field of currentBoard.fields) {
                let domField = getDiv(field.id);
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
         * @param panel the panel div.
         */
        function setUpGraveyard() {
            let blackPieces = getPiecesFromGraveyard('black');
            let whitePieces = getPiecesFromGraveyard('white');
            if (board.playerColor === "black") {
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
         * 
         * @param piece
         * @param isInitBoard
         * @returns {Node}
         */
        function cloneChessPiece(piece, isInitBoard) {
            let color = piece.color;
            let type = piece.type
            let pieceDiv = document.getElementById(type).cloneNode(true);
            pieceDiv.id = color + type;
            pieceDiv.classList.add("piece-" + color);
            pieceDiv.classList.remove("invisible");
            pieceDiv.classList.add("piece");
            if (board !== null && color === board.playerColor && !isInitBoard) {
                pieceDiv.draggable = true;
                pieceDiv.addEventListener('dragstart', dragStart);
                pieceDiv.addEventListener('dragend', dragEnd);
            }
            return pieceDiv;
        }

        /**
         * get all pieces from graveyard
         * @param color
         * @returns {null|*}
         */
        function getPiecesFromGraveyard(color) {
            let capturedPieces = board.graveyard;
            if (capturedPieces !== null) {
                capturedPieces = capturedPieces.filter(piece => piece.color === color);
                return capturedPieces;
            }
            return null;
        }

        /**
         * create a simple div and add given id.
         * @param id the id to add to the created div.
         * @returns {HTMLDivElement} the created element.
         */
        function getDiv(id) {
            let div = document.createElement('div');
            div.id = id;
            return div;
        }

        /**
         * check if a player is check mate.
         * @param color the color to check for.
         */
        function checkForCheckMate(color) {
            let isCheckMate = true;
            let isCheck = checkForCheck(getOppositeColor(color));
            if (isCheck) {
                let allFieldsWithPieces = getAllFieldsWithPiecesByColor(color);
                for (let field of allFieldsWithPieces) {
                    let legalMoves = getMovesForPiece(field);
                    for (let legalMove of legalMoves) {
                        updateField(field.id, legalMove.id, false);
                        let isStillInCheck = checkForCheck(getOppositeColor(color));
                        const boardCopy = jsonCopy(boardHistory.pop());
                        board = boardCopy;
                        if (!isStillInCheck) {
                            isCheckMate = false;
                        }
                    }
                }
            }
            if (isCheck && isCheckMate) {
                addCheckMate();
            }
        }

        /**
         * add check mate to turns panel.
         */
        function addCheckMate() {
            let turns = document.getElementById("turns");
            let span = createElement("span", "check-mate");
            span.innerText = "Checkmate";
            turns.append(span);
            document.getElementById("turns").scrollTo(0, document.getElementById("turns").scrollHeight);
        }

        /**
         * start dragging a piece. Applies class for legal moves.
         */
        function dragStart(event) {
            event.dataTransfer.setDragImage(this, +25, +25);
            this.classList.add('hold');
            document.querySelectorAll('.dragged').forEach(el => el.classList.remove('dragged'));
            this.classList.add('dragged');
            setTimeout(() => this.classList.add('invisible'), 0);
            let fieldId = this.parentElement.id;
            let currentField = getField(fieldId);
            let currentPieceColor = currentField.piece.color;
            let legalFields = getMovesForPiece(currentField);
            let color = getOppositeColor(currentPieceColor);
            if (checkForCheck(color)) {
                legalFields = legalFields.filter(field => {
                    updateField(currentField.id, field.id, false);
                    let resolvesCheck = checkForCheck(color);
                    const boardCopy = jsonCopy(boardHistory.pop());
                    board = boardCopy;
                    return !resolvesCheck;
                })

            }
            //make every legal move and check if check is given
            legalFields = legalFields.filter(field => {
                updateField(currentField.id, field.id, false);
                let createsCheck = checkForCheck(color);
                board = jsonCopy(boardHistory.pop());
                return !createsCheck;
            });
            if (legalFields.length === 0 && checkForCheck(color)) {
                let kingFieldId = getKingField(currentPieceColor).id;
                document.getElementById(kingFieldId).classList.remove("white");
                document.getElementById(kingFieldId).classList.remove("black");
                document.getElementById(kingFieldId).classList.add("take");
            }
            for (let field of legalFields) {
                if (field !== undefined) {
                    setUpLegalFields(field);
                }
            }
        }

        /**
         * applies listeners and classes to a field that is legal for the given piece.
         * @param legalField the field the piece is allowed to move on.
         */
        function setUpLegalFields(legalField) {
            let domField = document.getElementById(legalField.id);
            if (containsPiece(legalField)) {
                domField.classList.add('take');
            } else {
                domField.classList.add('legal');
            }
            domField.addEventListener('dragover', dragOver);
            domField.addEventListener('dragleave', dragLeave);
            domField.addEventListener('dragenter', dragEnter);
            domField.addEventListener('drop', dragDrop);

        }

        function dragEnd(event) {
            event.preventDefault();
            let interval = setInterval(function () {
                if (pieceWasPicked === true) {
                    clearInterval(interval);
                    createBoard(board, false);
                }
            }, 10);
        }


        /**
         * triggered when a piece is holding above a field.
         * @param event
         */
        function dragOver(event) {
            event.preventDefault();
            this.classList.add('hovered');

        }

        /**
         * triggered when a piece enters a field while dragged.
         * @param event
         */
        function dragEnter(event) {
            event.preventDefault();
            this.classList.add('hovered');

        }

        /**
         * triggered when a piece leaves a field while dragged.
         * @param event
         */
        function dragLeave(event) {
            event.preventDefault();
            this.classList.remove('hovered');

        }

        /**
         * updates board after movement and test if a check is given.
         * @param oldFieldId old field of moved piece.
         * @param newFieldId field the piece moved to.
         */
        async function resolveDrop(oldFieldId, newFieldId, isEngineMove) {
            board.moveTracker.push([oldFieldId, newFieldId]);
            turnNumber += 1;
            if (!isEngineMove) {
                await updateFieldPromise(oldFieldId, newFieldId, true).then(() => {
                    checkForCheckMate(getOppositeColor(board.playerColor))
                }).then(makeEngineMove);

            } else {
                await updateFieldPromise(oldFieldId, newFieldId, true).then(() => {
                    checkForCheckMate(board.playerColor);
                });
            }
        }

        function setUpEngine(skill) {
            let skillLevel = 0;
            switch (skill) {
                case difficulty[0]:
                    skillLevel = 0;
                    stockfish.postMessage("setoption name Skill Level Maximum Error value 900\n");
                    stockfish.postMessage("setoption name Skill Level Probability value 10\n");
                    break;
                case difficulty[1]:
                    skillLevel = 5;
                    break;
                case difficulty[2]:
                    skillLevel = 10;
                    break;
                case difficulty[3]:
                    skillLevel = 15;
                    break;
                case difficulty[5]:
                    skillLevel = 20;
                    break;
                default:
                    skillLevel = 10;
            }

            stockfish.postMessage("uci\n");
            stockfish.postMessage("setoption name Skill Level value " + skillLevel + "\n");
            stockfish.postMessage("isready\n");
            stockfish.postMessage("ucinewgame\n");
            stockfish.postMessage("isready\n");
        }

        function makeEngineMove() {
            let fenString = generateFENString(board);
            stockfish.postMessage("position fen " + fenString + "\n");
            stockfish.postMessage("go movetime 1000\n");
            setTimeout(() => {
                stockfish.postMessage("stop\n");
            }, 1000);
        }


        /**
         * triggered when a piece was dropped on a field.
         */
        async function dragDrop() {
            let draggedElement = document.querySelector('.dragged');
            let dropField = getField(this.id);
            let oldFieldId = draggedElement.parentElement.id;
            let oldField = getField(oldFieldId);
            let movedPiece = oldField.piece;
            if (movedPiece !== null) {
                if (movedPiece.type === 'pawn' && (dropField.y === 1 || dropField.y === 8)) {
                    pieceWasPicked = false;
                    await createPiecePicker(dropField, oldField, movedPiece.color);

                } else {
                    movedPiece.moveNumber += 1;
                    resolveDrop(oldFieldId, this.id, false);
                }
            }
        }


        /**
         * update piece movement in board.
         * @param oldFieldId the old field to delete piece from.
         * @param newFieldId the new field to set the piece on.
         */
        function updateField(oldFieldId, newFieldId, isRealMove) {
            if (!isRealMove) {
                const boardCopy = jsonCopy(board);
                boardHistory.push(boardCopy);
            }
            let newField = getField(newFieldId);
            let oldField = getField(oldFieldId);
            let fieldContainsPiece = containsPiece(newField);
            if (fieldContainsPiece) {
                if (isRealMove) {
                    halfMoves = 0;
                }
                let enemyPiece = newField.piece;
                board.graveyard.push(enemyPiece);
                newField.piece = null;
            }
            let piece = getPiece(oldField);
            oldField.piece = null;
            newField.piece = piece;
            if (piece !== null && (piece.type === "pawn" || fieldContainsPiece) && isRealMove) {
                halfMoves = 0;
            } else if (isRealMove) {
                halfMoves++;
            }
            if (isRealMove) {
                const boardCopy = jsonCopy(board);
                boardHistory.push(boardCopy);
            }
        }


        function updateFieldPromise(oldFieldId, newFieldId) {
            return new Promise((resolve) => {
                updateField(oldFieldId, newFieldId, true);
                setTimeout(() => {
                    createBoard(board, false);
                    resolve();
                }, 200);
            });
        }

        function jsonCopy(obj) {
            return JSON.parse(JSON.stringify(obj));
        }

        /**
         * iterates over the given direction and returns legal fields.
         * @param startField the field to start from.
         * @param depth the amount of tiles to scan.
         * @param movingType straight or diagonal.
         * @param capturePeace if true a discovered enemy piece is marked as captureable.
         * @returns {[fields]} all legal fields for the given piece.
         */
        function getLegalMoves(startField, depth, movingType, capturePeace) {
            let fields = [];
            for (let offSet in movingType) {
                let offSetXY = movingType[offSet];
                fields.push(...getMovement(startField, depth, offSetXY[0], offSetXY[1], capturePeace));
            }
            return fields
        }


        /**
         * walks all fields in given depth in the given directions until a friendly or an enemy piece is discovered or if
         * end of field is reached. Returns all collected fields.
         * @param startField the field to start from
         * @param depth the amount of tiles to walk into a certain direction.
         * @param offsetX direction x.
         * @param offSetY direction y.
         * @param capturePeace if true a discovered enemy piece is marked as captureable.
         * @returns {[]} all legal fields.
         */
        function getMovement(startField, depth, offsetX, offSetY, capturePeace) {

            let fields = [];
            let containsPieceOrIsInvalid = false;
            for (let i = 1; i <= depth; i++) {
                if (!containsPieceOrIsInvalid) {
                    let nextField = getFieldByXY(startField.x + offsetX * i, startField.y + offSetY * i);
                    if (nextField === undefined) {
                        containsPieceOrIsInvalid = true;
                    } else if (containsPiece(nextField)) {
                        let nextFieldPiece = nextField.piece;
                        if (nextFieldPiece.color !== startField.piece.color && capturePeace) {
                            fields.push(jsonCopy(nextField));
                        }
                        containsPieceOrIsInvalid = true;
                        return fields;
                    } else {
                        fields.push(jsonCopy(nextField));
                    }
                }
            }
            return fields;
        }


        /**
         * checks if the field is in range of an enemy piece.
         * @param fieldToCheck the field the king wants to move on.
         * @param color opposite color of current piece.
         * @returns {boolean} true if an enemy piece controls the field.
         */
        function fieldHasCheck(fieldToCheck, color) {
            let enemyFields = getAllFieldsWithPiecesByColor(color);
            //schließt felder mit eigenen Figuren aus. Deckung wird nicht erkannt.
            let allLegalMoves = getLegalMovesForAllPieces(enemyFields);
            for (let field of allLegalMoves) {
                if (field.id === fieldToCheck.id) {
                    return true;
                }
            }
            return false;
        }

        /**
         * get all legal moves for all pieces currently on board.
         * @param fields fields with piece
         /**s.
         * @returns {[]} all legal moves for all pieces currently on board.
         */
        function getLegalMovesForAllPieces(fields) {
            let allLegalMoves = [];
            for (let field of fields) {
                if (field.piece.type === 'king') {
                    const {diagonal} = directions;
                    const {straight} = directions;
                    allLegalMoves.push(...getLegalMoves(field, 1, diagonal, true))
                    allLegalMoves.push(...getLegalMoves(field, 1, straight, true))
                } else {
                    allLegalMoves.push(...getMovesForPiece(field));
                }
            }
            return allLegalMoves;
        }

        /**
         * check if a check is given.
         * @param color the color to check if it is in check.
         * @returns {boolean} true if color has a current check.
         */
        function checkForCheck(color) {
            let allFieldsWithColor = getAllFieldsWithPiecesByColor(color);
            allFieldsWithColor.filter(field => field.piece.type !== 'king');
            let legalMoves = getLegalMovesForAllPieces(allFieldsWithColor);
            let containsKing = legalMoves.filter(field => {
                if (containsPiece(field)) {
                    return field.piece.type === 'king';
                }
            });
            return containsKing.length > 0;
        }

        /**
         * get all fields containing pieces by given color.
         * @param color the color to get all pieces from.
         * @returns {fields} all fields with pieces.
         */
        function getAllFieldsWithPiecesByColor(color) {
            return Array.from(board.fields).reduce((total, field) => {
                if (containsPiece(field) && field.piece.color === color) {
                    total.push(field);
                }
                return total;
            }, []);
        }

        /**
         * constructs moves for piece knight.
         * @param field the field to start from
         * @returns {[Field]} array of fields with legal moves.
         */
        function getKnightMoves(field) {
            let legalFields = [];

            for (let vector of vectors) {
                let nextField = getFieldByXY(field.x + vector[0], field.y + vector[1]);
                if (nextField === undefined || containsPiece(nextField)) {
                    if (nextField !== undefined && nextField.piece.color !== field.piece.color) {
                        legalFields.push(jsonCopy(nextField));
                    }
                } else {
                    legalFields.push(jsonCopy(nextField));
                }
            }
            return legalFields;
        }

        function getPawnMoves(field) {
            let legalMoves = [];
            let color = field.piece.color;
            let yOffset = color === 'black' ? -1 : 1;
            const {straight} = directions;

            if (field.y === 2 || field.y === 7) {
                legalMoves.push(...getLegalMoves(field, 2, straight, false));
            } else {
                legalMoves.push(...getLegalMoves(field, 1, straight, false));
            }
            let fieldUpRight = getFieldByXY(field.x + 1, field.y + yOffset);
            let fieldUpLeft = getFieldByXY(field.x - 1, field.y + yOffset);

            if (fieldUpRight !== undefined && containsPiece(fieldUpRight) && fieldUpRight.piece.color !== color) {
                legalMoves.push(jsonCopy(fieldUpRight));
            }
            if (fieldUpLeft !== undefined && containsPiece(fieldUpLeft) && fieldUpLeft.piece.color !== color) {
                legalMoves.push(jsonCopy(fieldUpLeft));
            }

            //filter behind pawn according to color.
            let filteredMoves = legalMoves.filter(legalField => {
                return color === 'black' ? legalField.y < field.y : legalField.y > field.y;
            });

            //let filterMoves = function (legalField) {};
            let fieldRight = getFieldByXY(field.x + 1, field.y);
            let fieldLeft = getFieldByXY(field.x - 1, field.y);
            getEnPassant(fieldRight, field, fieldUpRight, filteredMoves);
            getEnPassant(fieldLeft, field, fieldUpLeft, filteredMoves);

            return filteredMoves;
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
            let gridAreaX = null;
            if (board.playerColor === "white") {
                gridAreaX = dropField.x;
            } else {
                gridAreaX = flippedNumbers[dropField.x - 1];
            }
            container.style.gridArea = 1 + "/" + gridAreaX + "/" + 5;
            for (let [pieceType, piece] of pieceMap) {
                if (piece.hasOwnProperty('type')) {
                    let newField = new Field(piece, dropField.id, dropField.x, dropField.y);
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
         * check if en passant is valid and add according move.
         * @param enemyField the field to the left or righ.
         * @param currentField field of current pawn.
         * @param captureMoveField Field to move to when capturing.
         * @param legalMoves current legal moves to add en passant field to.
         */
        function getEnPassant(enemyField, currentField, captureMoveField, legalMoves) {
            let moveTracker = board.moveTracker;
            let lastMove = moveTracker[moveTracker.length - 1];
            if (enemyField !== undefined && lastMove !== undefined) {
                let piece = enemyField.piece;
                if (piece !== null) {
                    //let fieldRight = getFieldByXY(field.x + 1, field.y);
                    if (piece.type === 'pawn' && piece.moveNumber === 1 && piece.color !== currentField.piece.color
                        && lastMove[1] === enemyField.id && (enemyField.y === 4 || enemyField.y === 5)) {
                        let domField = document.getElementById(captureMoveField.id);
                        // class captureMove
                        domField.classList.add('take');
                        let enemeyDomField = document.getElementById(enemyField.id);
                        // class pieceBeingCaptured
                        enemeyDomField.classList.add('take');
                        legalMoves.push(captureMoveField);
                        domField.removeEventListener('drop', dragDrop);
                        domField.addEventListener('drop', function () {
                            executeEnPassant(enemyField, currentField, captureMoveField, false)
                        });
                    }
                }
            }
        }


        function setResetButton() {
            let button = document.getElementById("resetButton");
            button.addEventListener("click", () => {
                turnNumber = boardHistory.length - 1;
                createBoard(board, false);
            });
        }

        function setUpNewGameButton() {
            let button = document.getElementById(("newGameButton"));
            button.addEventListener("click", appendNewGamePopUp);
        }

        function setUpForwardButton() {
            let button = document.getElementById("forwardButton");
            button.addEventListener("click", () => {
                if (turnNumber < boardHistory.length - 1) {
                    createBoard(boardHistory[turnNumber += 1], true);
                } else if (boardHistory.length > 0 && turnNumber <= boardHistory.length) {
                    createBoard(boardHistory[boardHistory.length - 1], true);
                }
            });

        }

        function setUpBackButton() {
            let button = document.getElementById("backButton");
            button.addEventListener("click", () => {
                if (boardHistory.length > 2) {
                    if (turnNumber >= 1) {
                        if (turnNumber === boardHistory.length) {
                            turnNumber -= 2;
                        } else {
                            turnNumber -= 1;
                        }
                        createBoard(boardHistory[turnNumber], true);
                    }
                } else if (boardHistory.length > 0) {
                    createBoard(boardHistory[0], true)
                }
            });
        }

        /**
         * execute en passant with a pawn.
         * @param enemyField the enemy field containing a pawn.
         * @param currentField the field the pawn is on
         * @param captureMoveField the en passant field just behind enemy pawn field.
         */
        async function executeEnPassant(enemyField, currentField, captureMoveField, isEngineMoving) {
            let movedPiece = getField(currentField.id).piece;
            movedPiece.moveNumber += 1;
            let captureField = getField(enemyField.id);
            document.getElementById(captureField.id).removeEventListener("drop", dragDrop);
            board.graveyard.push(captureField.piece);
            captureField.piece = null;
            await resolveDrop(currentField.id, captureMoveField.id, isEngineMoving);

        }

        /**
         * castle on the right site of the board.
         * @param kingField the field the king is on.
         */
        async function castleRight(kingField, isEngineCastling) {
            let rookField = getFieldByXY(kingField.x + 3, kingField.y);
            getField(kingField.id).piece.moveNumber += 1;
            let rookTargetField = getFieldByXY(kingField.x + 1, kingField.y);
            rookTargetField.piece = rookField.piece;
            rookField.piece = null;
            let moveTargetKing = getFieldByXY(kingField.x + 2, kingField.y);
            await resolveDrop(kingField.id, moveTargetKing.id, isEngineCastling);

        }

        /**
         * castle on the left side of the board.
         * @param kingField the field the king is on.
         */
        async function castleLeft(kingField, isEngineCastling) {
            let rookField = getFieldByXY(kingField.x - 4, kingField.y);
            getField(kingField.id).piece.moveNumber += 1;
            let rookTargetField = getFieldByXY(kingField.x - 1, kingField.y);
            rookTargetField.piece = rookField.piece;
            rookField.piece = null;
            let moveTargetKing = getFieldByXY(kingField.x - 2, kingField.y);
            await resolveDrop(kingField.id, moveTargetKing.id, isEngineCastling);
        }

        function getBishopMoves(field) {
            const {diagonal} = directions;
            return getLegalMoves(field, 7, diagonal, true);
        }

        function getRookMoves(field) {
            const {straight} = directions;
            return getLegalMoves(field, 7, straight, true);
        }

        function getQueenMoves(field) {
            const {straight} = directions;
            const {diagonal} = directions;
            let legalMoves = [];
            legalMoves.push(...getLegalMoves(field, 7, straight, true));
            legalMoves.push(...getLegalMoves(field, 7, diagonal, true));
            return legalMoves;
        }

        function getKingMoves(currentField) {
            const {straight} = directions;
            const {diagonal} = directions;
            let color = currentField.piece.color === 'white' ? "black" : "white";
            let legalMoves = [];
            legalMoves.push(...getLegalMoves(currentField, 1, straight, true));
            legalMoves.push(...getLegalMoves(currentField, 1, diagonal, true));
            if (currentField.piece.moveNumber === 0) {
                legalMoves.push(...checkForCastle(currentField));
            }

            let withoutCheck = legalMoves.filter(field => !fieldHasCheck(field, color));

            //filter moves with covered enemy pieces on it.
            return withoutCheck.filter(field => {
                updateField(currentField.id, field.id, false);
                let hasCheck = checkForCheck(color);
                const boardCopy = jsonCopy(boardHistory.pop());
                board = boardCopy;
                return !hasCheck;
            });

        }

        /**
         * checks if castling is possbile and if so sets up event listeners on the fields and returns them as legal moves.
         * @param kingField the field the king is on.
         * @returns {[]} legalMoves
         */
        function checkForCastle(kingField) {
            let legalMoves = [];
            let color = getOppositeColor(kingField.piece.color);
            let rookLeft = getFieldByXY(kingField.x - 4, kingField.y).piece;
            let rookRight = getFieldByXY(kingField.x + 3, kingField.y).piece;

            let fieldRightX1 = getFieldByXY(kingField.x + 1, kingField.y);
            let fieldRightX2 = getFieldByXY(kingField.x + 2, kingField.y);
            let fieldLeftX1 = getFieldByXY(kingField.x - 1, kingField.y);
            let fieldLeftX2 = getFieldByXY(kingField.x - 2, kingField.y);
            let fieldLeftX3 = getFieldByXY(kingField.x - 3, kingField.y);
            if (!checkForCheck(getOppositeColor(board.playerColor))) {
                if (!containsPiece(fieldRightX1) && !containsPiece(fieldRightX2) && rookRight !== null && rookRight.moveNumber === 0 && !fieldHasCheck(fieldRightX1, color)
                    && !fieldHasCheck(fieldRightX2, color)) {
                    document.getElementById(fieldRightX2.id).removeEventListener("drop", dragDrop);
                    document.getElementById(fieldRightX2.id).addEventListener('drop', function () {
                        castleRight(kingField, false);
                    });
                    legalMoves.push(jsonCopy(fieldRightX2));
                }
                if (!containsPiece(fieldLeftX1) && !containsPiece(fieldLeftX2) && !containsPiece(fieldLeftX3) && rookLeft !== null && rookLeft.moveNumber === 0
                    && !fieldHasCheck(fieldLeftX1, color) && !fieldHasCheck(fieldLeftX2, color) && !fieldHasCheck(fieldLeftX3, color)) {
                    document.getElementById(fieldLeftX2.id).removeEventListener("drop", dragDrop);
                    document.getElementById(fieldLeftX2.id).addEventListener('drop', function () {
                        castleLeft(kingField, false);
                    });
                    legalMoves.push(jsonCopy(fieldLeftX2));
                }
            }

            return legalMoves;
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
         * decides which legal moves to return according to given peace.
         * @param field
         * @returns {Field[]|[]}
         */
        function getMovesForPiece(field) {
            switch (field.piece.type) {
                case "pawn":
                    return getPawnMoves(field);
                case "bishop":
                    return getBishopMoves(field);
                case 'rook':
                    return getRookMoves(field);
                case 'queen':
                    return getQueenMoves(field);
                case 'king':
                    return getKingMoves(field);
                case 'knight':
                    return getKnightMoves(field);
            }
        }

        /**
         * get field by fieldId
         * @param fieldId
         */
        function getField(fieldId) {
            for (let field of board.fields) {
                if (field.id === fieldId) {
                    return field;
                }
            }
        }

        /**
         * find the field for a given color that currently contains the king.
         * @param color the color to find the king for.
         * @returns {null|any} the field the king is currently on.
         */
        function getKingField(color) {
            for (let field of board.fields) {
                if (field.piece !== null && field.piece.type === "king" && field.piece.color === color) {
                    return field;
                }
            }
            return null;
        }

        /**
         * get piece from given field.
         * @param currentField
         * @returns {null|*|undefined}
         */
        function getPiece(currentField) {
            for (let field of board.fields) {
                if (field.id === currentField.id) {
                    return field.piece;
                }
            }
        }

        /**
         * simply returns the opposite of given color.
         * @param color the given color to return the opposite from.
         * @returns {string} the color.
         */
        function getOppositeColor(color) {
            return color === 'white' ? 'black' : 'white';
        }

        /**
         * get field by x,y coordinates.
         * @param x
         * @param y
         */
        function getFieldByXY(x, y) {
            for (let field of board.fields) {
                if (field.x === x && field.y === y) {
                    return field;
                }
            }
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
         * returns true if a field contains a piece.
         * @param field the field to check.
         * @returns {boolean} true if the field contains a piece.
         */
        function containsPiece(field) {
            return field.piece !== null;
        }

        /**
         * generate the FEN String to send to stockfish.
         * @returns {*|string} the finished fen string.
         */
        function generateFENString() {
            let fenString = "";
            fenString = addBoardToFENString(fenString);
            fenString = addTurnToFEN(fenString);
            fenString = addCastleRights(fenString);
            fenString = addEnPassantMoves(fenString);
            fenString = addMoveCounter(fenString);
            fenString = addHalfMoves(fenString);
            return fenString;
        }

        /**
         * add the current board to fen string. A black piece is represented by lower case letters whereas a white piece
         * is represented by upper case letters (e.g. white queen 'Q', black pawn 'p'.
         * If there empty fields they are counted till a piece is found. Thus 5 empty fields are noted
         * as a five.
         * @param fenString the fen string.
         * @returns {*} the fen string with added board.
         */
        function addBoardToFENString(fenString) {
            let fields = board.fields;
            let sortedFields = Array.from(fields);
            sortedFields.sort((a, b) => {
                return a.x - b.x;
            })
            sortedFields.sort((a, b) => {
                return b.y - a.y;
            })

            let emptyFieldCounter = 0;
            let counter = 0;
            for (let field of sortedFields) {
                if (counter === 8) {
                    if (emptyFieldCounter > 0) {
                        fenString += emptyFieldCounter;
                        emptyFieldCounter = 0;
                    }
                    fenString += "/";
                }
                let piece = field.piece;
                if (piece !== null) {
                    if (emptyFieldCounter !== 0) {
                        fenString += emptyFieldCounter;
                        emptyFieldCounter = 0;
                    }
                    fenString += piece.fenChar;
                } else {
                    emptyFieldCounter++;
                }
                if (counter === 8) {
                    counter = 0;
                }
                counter++;
            }
            return fenString;

        }

        /**
         * add letter indicating which player is to move.
         * @param fenString the fen string to update.
         * @returns {*} the updated fen string.
         */
        function addTurnToFEN(fenString) {
            let turnNumber = boardHistory.length;
            if (turnNumber % 2 === 0) {
                fenString += " w";
            } else {
                fenString += " b";
            }
            fenString += " ";
            return fenString;
        }

        /**
         * add castling rights for both players. Upper case letters indicate castling rights for white. 'K' stands for
         * king site castling and 'Q' for queen site castling. Same is true for black but in lower case lettes.
         * @param fenString the fen string to update.
         * @returns {*} the updated fen string.
         */
        function addCastleRights(fenString) {
            let whiteQueenSide = true;
            let whiteKingSide = true;
            let blackQueenSide = true;
            let blackKingSide = true;

            for (let move of board.moveTracker) {
                let oldField = move[0];
                if (oldField === "a1") {
                    whiteQueenSide = false;
                }
                if (oldField === "h1") {
                    whiteKingSide = false;
                }
                if (oldField === "e1") {
                    whiteQueenSide = false;
                    whiteKingSide = false;
                }
                if (oldField === "e8") {
                    blackQueenSide = false;
                    blackKingSide = false;
                }
                if (oldField === "a8") {
                    blackQueenSide = false;
                }
                if (oldField === "h8") {
                    blackKingSide = false;
                }
            }
            if (whiteKingSide) {
                fenString += "K";
            }
            if (whiteQueenSide) {
                fenString += "Q";
            }
            if (blackKingSide) {
                fenString += "k";
            }
            if (blackQueenSide) {
                fenString += "q";
            }
            if (!whiteQueenSide && !whiteKingSide && !blackQueenSide && !blackKingSide) {
                fenString += "-";
            }
            return fenString;
        }

        /**
         * add possible enPassant move to fen string.
         * @param fenString the fen string to build.
         * @returns {*} fen string with added en passant move.
         */
        function addEnPassantMoves(fenString) {
            let moveTracker = board.moveTracker;
            let lastMove = moveTracker[moveTracker.length - 1];
            let enPassantPossible = false;
            if (lastMove !== undefined) {
                let oldField = lastMove[0];
                let newField = lastMove[1];
                if (getField(newField).piece.type === "pawn") {
                    if ((oldField.includes("2") && newField.includes("4")) || oldField.includes("7") && newField.includes("5")) {
                        let letterOfField = newField.charAt(0);
                        let numberOfField = newField.charAt(1);
                        if (numberOfField.includes("5")) {
                            numberOfField++;
                        } else {
                            numberOfField--;
                        }
                        enPassantPossible = true;
                        fenString += " " + letterOfField + numberOfField;
                    }
                }
            }
            if (!enPassantPossible) {
                fenString += " -"
            }
            return fenString;
        }

        /**
         * add half moves to fen string. half moves are all moves that don't take a piece or move a pawn.
         * @param fenString the fen string to add half moves to.
         * @returns {*} the updated fen string.
         */
        function addHalfMoves(fenString) {
            fenString += " " + halfMoves;
            return fenString;
        }

        /**
         * add move counter to fen string indicating the current number of played turns.
         * @param fenString the fen string to add move counter to.
         * @returns {*} the updated fen string.
         */
        function addMoveCounter(fenString) {
            fenString += " " + boardHistory.length;
            return fenString;
        }

    }

    render() {
        return (
            <section id="chess-section">
                <div id="chess-wrapper">
                <div id="chess-container" className="chess-container">
                    <div id="topPlayer" className="player-panel">
                        <div id="topAvatar" className="avatar">
                            <img src={avatar}/>
                        </div>
                        <div className="player-graveyard-wrapper">
                            <div className="player-name">StockFish</div>
                            <div id="topGraveyard" className="graveyard">
                                <span id="top-pawn" className="piece-graveyard"></span>
                                <span id="top-bishop" className="piece-graveyard"></span>
                                <span id="top-knight" className="piece-graveyard"></span>
                                <span id="top-rook" className="piece-graveyard"></span>
                                <span id="top-queen" className="piece-graveyard"></span>
                            </div>
                        </div>
                    </div>
                    <div id="chess"></div>
                    <div id="rook" className="invisible">
                        <FontAwesomeIcon icon={faChessRook}/>
                    </div>
                    <div id="bishop" className="invisible">
                        <FontAwesomeIcon icon={faChessBishop}/>
                    </div>
                    <div id="knight" className="invisible">
                        <FontAwesomeIcon icon={faChessKnight}/>
                    </div>
                    <div id="pawn" className="invisible">
                        <FontAwesomeIcon icon={faChessPawn}/>
                    </div>
                    <div id="queen" className="invisible">
                        <FontAwesomeIcon icon={faChessQueen}/>
                    </div>
                    <div id="king" className="invisible">
                        <FontAwesomeIcon icon={faChessKing}/>
                    </div>
                    <div id="bottomPlayer" className="player-panel">
                        <div id="bottomAvatar" className="avatar">
                            <img src={avatar}/>
                        </div>
                        <div className="player-graveyard-wrapper">
                            <div id="player-name" className="player-name"></div>
                            <div id="bottomGraveyard" className="graveyard">
                                <span id="bottom-pawn" className="piece-graveyard"></span>
                                <span id="bottom-bishop" className="piece-graveyard"></span>
                                <span id="bottom-knight" className="piece-graveyard"></span>
                                <span id="bottom-rook" className="piece-graveyard"></span>
                                <span id="bottom-queen" className="piece-graveyard"></span>
                            </div>
                        </div>
                    </div>
                    <div id="panel">
                        <div id="turns"></div>
                        <div id="buttons">
                            <div className="tooltip tooltip--top panel-button" id="backButton"
                                 data-tooltip="Last move">
                                <FontAwesomeIcon icon={faChevronLeft}/>
                            </div>
                            <div className="tooltip tooltip--top panel-button" id="forwardButton"
                                 data-tooltip="Next move">
                                <FontAwesomeIcon icon={faChevronRight}/>
                            </div>
                            <div className="tooltip tooltip--top panel-button" id="resetButton"
                                 data-tooltip="Reset board">
                                <FontAwesomeIcon icon={faRotateLeft}/>
                            </div>
                            <div className="tooltip tooltip--top panel-button" id="newGameButton"
                                 data-tooltip="New game">
                                <FontAwesomeIcon icon={faPlus}/>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </section>
        )
    };
}
