import React, {Component} from 'react';
import './games.css';
import rook from '../../assets/chess/rook_black.svg';
export default class Games extends Component {
    constructor() {
        super();
    }


    componentDidMount() {
        let masterMindDiv = document.getElementById("mastermind-div");
        masterMindDiv.addEventListener('click', () => {
            masterMindDiv.classList.add("move-right");
            let chessSvg = document.getElementById("chess-svg-path");
            chessSvg.classList.remove("draw-line");
            chessSvg.classList.add('vanish');
            setTimeout(() => {
                const gamesDiv = document.getElementById('games-div');
                clearElement(gamesDiv);
                newGame();
            }, 20);
        });

        const positions = {

            "a1": new Piece('rook', 'white', 0, 3),
            "b1": new Piece('knight', 'white', 0, 1),
            "c1": new Piece('bishop', 'white', 0, 2),
            "d1": new Piece('queen', 'white', 0, 4),
            "e1": new Piece('king', 'white', 0, 6),
            "f1": new Piece('bishop', 'white', 0, 2),
            "g1": new Piece('knight', 'white', 0, 1),
            "h1": new Piece('rook', 'white', 0, 3),
            "a8": new Piece('rook', 'black', 0, 3),
            "b8": new Piece('knight', 'black', 0, 1),
            "c8": new Piece('bishop', 'black', 0, 2),
            "d8": new Piece('queen', 'black', 0, 4),
            "e8": new Piece('king', 'black', 0, 6),
            "f8": new Piece('bishop', 'black', 0, 2),
            "g8": new Piece('knight', 'black', 0, 1),
            "h8": new Piece('rook', 'black', 0, 3)
        };



        const piecePicker = function (color) {
            let piecePickerMap = new Map;
            piecePickerMap.set('bishop', new Piece('bishop', color, 0));
            piecePickerMap.set('knight', new Piece('knight', color, 0));
            piecePickerMap.set('rook', new Piece('rook', color, 0));
            piecePickerMap.set('queen', new Piece('queen', color, 0));
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

        const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const flippedNumber = [8, 7, 6, 5, 4, 3, 2, 1];

        let board = null;
        const boardHistory = [];
        let moveTracker = [];
        let turnNumber = -1;

        function Piece(type, color, moveNumber, sort) {
            this.type = type;
            this.color = color;
            this.moveNumber = moveNumber;
            this.sort = sort;
        }

        function Field(piece, id, x, y) {
            this.piece = piece;
            this.id = id;
            this.x = x;
            this.y = y;
        }

        function Board(fields, graveyard) {
            this.fields = fields;
            this.graveyard = graveyard;

        }

        /**
         * init a new board with pieces in starting position.
         */
        function newGame() {
            turnNumber = -1;
            let fields = [];
            let graveyard = [];

            for (let i = 1; i < 9; i++) {
                for (let j = 8; j > 0; j--) {
                    let letter = letters[j - 1];
                    let piece = positions[letter + i] === undefined ? null : positions[letter + i];
                    if (i === 2 || i === 7) {
                        let color = i === 7 ? 'black' : 'white';
                        piece = new Piece('pawn', color, 0, 0);
                    }

                    let field = new Field(piece, letter + i, j, i);
                    fields.push(field);
                }
            }
            board = new Board(fields, graveyard);
            console.log(board);
            createBoard(board);
        }

        /**
         * create the board and add pieces to it.
         * @param currentBoard the board to create the field from.
         */
        function createBoard(currentBoard) {
            let contentDiv = document.getElementById('games-div');
            clearElement(contentDiv);
            let boardDiv = createElement('div', 'board-div');
            let blackOrWhite = -1;

            for (let field of currentBoard.fields) {

                let domField = getDiv(field.id);
                let classType = blackOrWhite < 0 ? 'white' : 'black';
                domField.classList.add(classType);
                domField.classList.add('field');
                domField.setAttribute('x', field.x);
                domField.setAttribute('y', field.y);
                domField.style.gridArea = flippedNumber[field.y - 1] + "/" + field.x;
                if (field.piece !== null) {
                    let imgDiv = createImgFromField(field);
                    domField.appendChild(imgDiv);
                }
                boardDiv.appendChild(domField);
                blackOrWhite = blackOrWhite * -1;
                if (field.x === 1) {
                    blackOrWhite = blackOrWhite * -1;
                }

            }
            contentDiv.appendChild(boardDiv);
            let xAxis = getDiv("x-axis");
            let yAxis = getDiv('y-axis');
            appendAxis(yAxis, true);
            appendAxis(xAxis, false);
            contentDiv.appendChild(yAxis);
            contentDiv.appendChild(xAxis);
            let panel = getDiv('panel');
            flip();

            createPanel(panel);
            contentDiv.append(panel, addFlipButton());
            //displayNotation();

        }

        function addFlipButton() {
            let container = createElement('div', 'flip-button');
            let img = createElement('img', 'flip-svg');
            img.src = "flip.svg";
            container.append(img);
            container.addEventListener('click', flip);
            return container;
        }

        /**
         * create the panel where graveyard, moves and time is displayed.
         * @param panel
         */
        function createPanel(panel) {
            let whiteGraveyard = getDiv('white-graveyard');
            let blackGraveyard = getDiv('black-graveyard');
            let details = getDiv('details');
            blackGraveyard.classList.add('graveyard');
            whiteGraveyard.classList.add('graveyard');
            panel.appendChild(blackGraveyard);
            panel.appendChild(details);
            panel.appendChild(whiteGraveyard);
            let blackPieces = getPiecesFromGraveyard('black');
            let whitePieces = getPiecesFromGraveyard('white');
            if (blackPieces !== null || true) {

                appendPiecesToGraveyard(blackPieces, blackGraveyard);
            }
            if (whitePieces !== null || true) {

                appendPiecesToGraveyard(whitePieces, whiteGraveyard);
            }

        }

        function appendPiecesToGraveyard(pieces, graveyard) {
            let sortablePieceArray = Array.from(pieces);
            sortablePieceArray.sort(function (a, b) {
                return b.sort - a.sort;
            });
            sortablePieceArray.forEach(piece => {
                let imgDiv = document.createElement('div');
                imgDiv.appendChild(fetchPiece(piece.type));
                graveyard.appendChild(imgDiv);
            });

        }

        function fetchPiece(type) {
            return createElement('div');

        }

        function createImgFromField(field) {

            let imgDiv = document.createElement('div');
            let img = document.createElement('img');
            img.src = "http://localhost:5000/" + field.piece.type + field.piece.color;
            imgDiv.id = field.id + "-piece";
            imgDiv.classList.add("piece");
            imgDiv.draggable = true;
            imgDiv.addEventListener('dragstart', dragStart);
            imgDiv.addEventListener('dragend', dragEnd);

            imgDiv.appendChild(img);

            return imgDiv;
        }

        function getPiecesFromGraveyard(color) {
            let capturedPieces = board.graveyard;
            if (capturedPieces !== null || true) {
                capturedPieces = capturedPieces.filter(piece => piece.color === color);
                console.log(capturedPieces);
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
         * append x(a - h) and y(1-8) axis
         * @param axis
         * @param hasLetters
         */
        function appendAxis(axis, hasLetters) {
            let letterCount = 7;
            for (let i = 0; i < 8; i++) {
                let div = document.createElement('div');
                hasLetters ? div.innerText = i + 1 : div.innerText = letters[letterCount];
                axis.appendChild(div);
                letterCount--;
            }

        }

        /**
         * mirror the board.
         */
        function flip() {
            let boardDiv = document.getElementById('board-div');
            let domFields = document.querySelectorAll('.field');
            let xAxis = document.getElementById('x-axis');
            let yAxis = document.getElementById('y-axis');
            let elements = [boardDiv, xAxis, yAxis];
            for (let element of elements) {
                for (let i = 1; i < element.childNodes.length; i++) {
                    element.insertBefore(element.childNodes[i], element.firstChild);
                }
            }
            for (let domField of domFields) {
                if (boardDiv.firstChild.id === 'a8') {

                    domField.style.gridArea = flippedNumber[domField.getAttribute('y') - 1] + "/" + domField.getAttribute('x');
                } else {

                    domField.style.gridArea = domField.getAttribute('y') + "/" + domField.getAttribute('x');

                }
            }
        }


        /**
         * start dragging a piece. Applies classes.
         */
        function dragStart() {
            this.classList = 'hold';
            document.querySelectorAll('.dragged').forEach(el => el.classList.remove('dragged'));
            this.classList.add('dragged');
            setTimeout(() => this.classList.add('invisible'), 0);
            let fieldId = this.parentElement.id;
            let currentField = getField(fieldId);
            let piece = currentField.piece;
            let color = getOppositeColor(currentField.piece.color);
            let legalFields = getMovesForPiece(currentField);
            console.log(checkForCheck(color));
            if (checkForCheck(color)) {
                legalFields = legalFields.filter(field => {
                    updateField(currentField.id, field.id);
                    let resolvesCheck = checkForCheck(color);
                    const boardCopy = jsonCopy(boardHistory.pop());
                    board = boardCopy;
                    console.log(board);
                    console.log(boardHistory);
                    return !resolvesCheck;
                })

            }
            //make every legal move and check if check is given
            legalFields = legalFields.filter(field => {
                updateField(currentField.id, field.id);
                let createsCheck = checkForCheck(color);
                const boardCopy = jsonCopy(boardHistory.pop());
                board = boardCopy;
                console.log(board);
                console.log(boardHistory);
                return !createsCheck;
            });

            for (let field of legalFields) {
                if (field !== undefined) {
                    setUpLegalFields(field, piece);
                }
            }

        }

        /**
         * applies listeners and classes to a field that is legal for the given piece.
         * @param legalField the field the piece is allowed to move on.
         */
        function setUpLegalFields(legalField, piece) {
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

        function dragEnd() {

            let interval = setInterval(function () {
                if (pieceWasPicked === true) {
                    clearInterval(interval);
                    createBoard(board);
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
         * @param oldfieldId old field of moved piece.
         * @param newFieldId field the piece moved to.
         */
        function resolveDrop(oldFieldId, newFieldId) {
            updateField(oldFieldId, newFieldId);
            moveTracker.push([oldFieldId, newFieldId]);
            turnNumber += 1;

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
            if (movedPiece.type === 'pawn' && (dropField.y === 1 || dropField.y === 8)) {
                pieceWasPicked = false;
                await createPiecePicker(dropField, oldField, movedPiece.color);

            } else {
                movedPiece.moveNumber += 1;
                resolveDrop(oldFieldId, this.id);
                createBoard(board);
            }
        }


        /**
         * update piece movement in board.
         * @param oldFieldId the old field to delete piece from.
         * @param newFieldId the new field to set the piece on.
         */
        function updateField(oldFieldId, newFieldId) {
            const boardCopy = jsonCopy(board);
            boardHistory.push(boardCopy);
            console.log(boardHistory);
            console.log(board);
            let newField = getField(newFieldId);
            let oldField = getField(oldFieldId);
            if (containsPiece(newField)) {
                let enemyPiece = newField.piece;
                board.graveyard.push(enemyPiece);
                newField.piece = null;
            }
            let piece = getPiece(oldField);
            oldField.piece = null;
            newField.piece = piece;
            console.log(board);

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
                if (field === fieldToCheck) {
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
            for (let enemyField of fields) {
                if (enemyField.piece.type === 'king') {
                    const {diagonal} = directions;
                    const {straight} = directions;
                    allLegalMoves.push(...getLegalMoves(enemyField, 1, diagonal, true))
                    allLegalMoves.push(...getLegalMoves(enemyField, 1, straight, true))
                } else {
                    allLegalMoves.push(...getMovesForPiece(enemyField));
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
            let vectors = [[2, -1], [2, 1], [-1, 2], [1, 2], [-1, -2], [1, -2], [-2, 1], [-2, -1]];

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
            console.log(filteredMoves);

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
            let sideOfTheBoard = color === 'white' ? 1 : 9;
            container.style.gridArea = sideOfTheBoard + "/" + dropField.x + "/" + 5;

            for (let [pieceType, piece] of pieceMap) {
                if (piece.hasOwnProperty('type')) {
                    let newField = new Field(piece, dropField.id, dropField.x, dropField.y);
                    let pieceBox = document.createElement('div');
                    let imgDiv = createImgFromField(newField, true);
                    pieceBox.appendChild(imgDiv);
                    pieceBox.setAttribute('piece', pieceType);
                    pieceBox.addEventListener('click', function () {
                        oldField.piece = pieceMap.get(this.getAttribute('piece'));
                        pieceWasPicked = true;
                        resolveDrop(oldField.id, dropField.id);
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
                            executeEnpassant(enemyField, currentField, captureMoveField)
                        });
                    }
                }
            }
        }

        /**
         * execute en passant with a pawn.
         * @param enemyField the enemy field containing a pawn.
         * @param currentField the field the pawn is on
         * @param captureMoveField the en passant field just behind enemy pawn field.
         */
        function executeEnpassant(enemyField, currentField, captureMoveField) {

            let movedPiece = getField(currentField.id).piece;
            movedPiece.moveNumber += 1;
            captureMoveField.piece = movedPiece;
            let captureField = getField(enemyField.id);
            currentField.piece = null;
            board.graveyard.push(captureField.piece);
            captureField.piece = null;
            resolveDrop(currentField.id, captureMoveField.id);
            createBoard(board);

        }

        /**
         * castle on the right site of the board.
         * @param kingField the field the king is on.
         */
        function castleRight(kingField) {
            let rookField = getFieldByXY(kingField.x + 3, kingField.y);
            getField(kingField.id).piece.moveNumber += 1;
            let rookTargetField = getFieldByXY(kingField.x + 1, kingField.y);

            rookTargetField.piece = rookField.piece;
            rookField.piece = null;
            let moveTargetKing = getFieldByXY(kingField.x + 2, kingField.y);

            resolveDrop(kingField.id, moveTargetKing.id);
            createBoard(board);

        }

        /**
         * castle on the left side of the board.
         * @param kingField the field the king is on.
         */
        function castleLeft(kingField) {
            let rookField = getFieldByXY(kingField.x - 4, kingField.y);
            getField(kingField.id).piece.moveNumber += 1;
            let rookTargetField = getFieldByXY(kingField.x - 1, kingField.y);

            rookTargetField.piece = rookField.piece;
            rookField.piece = null;
            let moveTargetKing = getFieldByXY(kingField.x - 2, kingField.y);

            resolveDrop(kingField.id, moveTargetKing.id);
            createBoard(board);
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
                updateField(currentField.id, field.id);
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
            let rookRight = getFieldByXY(kingField.x - 4, kingField.y).piece;
            let rookLeft = getFieldByXY(kingField.x + 3, kingField.y).piece;

            let fieldRightX1 = getFieldByXY(kingField.x + 1, kingField.y);
            let fieldRightX2 = getFieldByXY(kingField.x + 2, kingField.y);
            let fieldLeftX1 = getFieldByXY(kingField.x - 1, kingField.y);
            let fieldLeftX2 = getFieldByXY(kingField.x - 2, kingField.y);
            let fieldLeftX3 = getFieldByXY(kingField.x - 3, kingField.y);

            if (!containsPiece(fieldRightX1) && !containsPiece(fieldRightX2) && rookRight.moveNumber === 0 && !fieldHasCheck(fieldRightX1, color)
                && !fieldHasCheck(fieldRightX2, color)) {
                document.getElementById(fieldRightX2.id).addEventListener('drop', function () {
                    castleRight(kingField);
                });
                legalMoves.push(jsonCopy(fieldRightX2));
            }
            if (!containsPiece(fieldLeftX1) && !containsPiece(fieldLeftX2) && !containsPiece(fieldLeftX3) && rookLeft.moveNumber === 0
                && !fieldHasCheck(fieldLeftX1, color) && !fieldHasCheck(fieldLeftX2, color) && !fieldHasCheck(fieldLeftX3, color)) {
                document.getElementById(fieldLeftX2.id).addEventListener('drop', function () {
                    castleLeft(kingField);
                });
                legalMoves.push(jsonCopy(fieldLeftX2));
            }
            return legalMoves;
        }

        function displayNotation() {
            let details = document.getElementById('details');
            while (details.firstChild) {
                details.removeChild(details.firstChild);
            }
            let notationDiv = document.createElement('div');
            notationDiv.id = 'notationDiv';
            notationDiv.append(createTurnButtons());
            let table = document.createElement('table');
            let blackTh = document.createElement('th');
            blackTh.innerText = "Black";
            let whiteTh = document.createElement('th');
            whiteTh.innerText = 'White';
            let tr = document.createElement('tr');
            table.append(whiteTh, blackTh);
            let i = moveTracker.length < 15 ? 0 : 15;
            for (i; i < moveTracker.length; i++) {

                let td = document.createElement('td');
                td.innerText = moveTracker[i][1];
                if (i % 2 === 0) {
                    tr = document.createElement('tr');
                    tr.append(td);
                } else {
                    tr.append(td);
                }
                table.append(tr);
            }
            notationDiv.append(table);
            details.append(notationDiv);
        }

        function createElement(type, id) {
            let el = document.createElement(type);
            el.id = id;
            return el;
        }

        function createTurnButtons() {
            let buttonDiv = createElement('div', 'turn-buttons');
            let buttonBack = createElement('div', 'back-button');
            buttonBack.addEventListener('click', function () {
                createBoard(boardHistory[turnNumber -= 1])
            });

            let buttonForward = createElement('div', 'forward-button');
            buttonForward.addEventListener('click', function () {
                if (turnNumber <= boardHistory.length) {
                    createBoard(boardHistory[turnNumber += 1]);
                } else {
                    createBoard(boardHistory[boardHistory.length - 1]);
                }
            });
            let buttonStart = createElement('div', 'start-button');
            buttonStart.addEventListener('click', function () {
                createBoard(boardHistory[turnNumber = 0])
            });
            let buttonEnd = createElement('div', 'end-button');
            buttonEnd.addEventListener('click', function () {
                turnNumber = boardHistory.length;
                createBoard(boardHistory[turnNumber])
            });

            buttonDiv.append(buttonStart, buttonBack, buttonForward, buttonEnd);
            return buttonDiv;
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

        function clearElement(element) {
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
        }

        function containsPiece(field) {
            return field.piece !== null;
        }

    }

    render() {
        return (
            <div className='games' id='games-div'>
                <div id='chess-svg' className='chess-svg'>
                    <svg transform="scale(-2,2)"
                         viewBox="0 0 1200.000000 1019.000000">
                        <g transform="translate(0.000000,1019.000000) scale(0.100000,-0.100000)"
                        >
                            <path fill="none" id="chess-svg-path" className="draw-line" d="M8347 6184 c-154 -24 -207 -71 -207 -184 1 -75 12 -121 69 -269 27
-69 52 -139 55 -156 l6 -30 -122 0 c-98 0 -129 -4 -155 -18 -59 -31 -71 -95
-28 -141 34 -37 65 -46 157 -46 79 0 81 -1 114 -35 32 -35 49 -84 42 -122 -2
-12 -14 -19 -38 -21 -42 -4 -65 -24 -91 -75 -25 -48 -62 -70 -163 -97 -194
-52 -241 -127 -182 -296 13 -38 60 -145 104 -239 129 -274 154 -379 113 -474
-11 -27 -21 -63 -21 -79 0 -45 28 -52 220 -52 161 0 234 -10 214 -29 -5 -5
-76 -11 -159 -13 -136 -3 -155 -6 -200 -29 -60 -30 -118 -107 -135 -179 -10
-41 -9 -54 5 -83 21 -46 61 -64 159 -73 l78 -7 -6 -29 c-3 -16 -10 -122 -16
-236 -15 -314 -20 -369 -46 -472 -39 -158 -68 -214 -133 -263 -64 -49 -76 -82
-41 -115 52 -48 222 -54 588 -21 169 16 236 19 244 11 45 -45 -57 -234 -153
-282 -78 -40 -155 -21 -309 77 -128 81 -153 93 -216 103 -68 11 -107 -3 -158
-61 -66 -73 -128 -236 -161 -428 -33 -186 -8 -277 88 -328 78 -40 384 -68 670
-60 165 4 235 11 385 37 173 30 184 31 208 15 66 -43 70 -187 7 -257 -89 -99
-494 -165 -848 -138 -248 19 -510 71 -620 125 -59 29 -89 71 -79 112 4 15 23
59 42 98 53 106 63 152 72 338 9 194 18 230 96 375 86 159 103 197 110 235 6
36 4 40 -50 92 -31 30 -56 61 -56 68 0 7 14 26 30 42 17 16 30 38 30 50 0 11
-29 53 -65 94 -72 82 -92 125 -135 296 -61 243 -105 546 -91 637 12 76 17 78
152 78 134 0 161 8 184 57 23 47 16 74 -25 100 -80 51 -75 39 -79 176 l-3 126
-36 42 c-48 56 -47 89 9 204 58 122 59 189 5 355 -63 194 -59 223 39 270 25
12 52 29 60 37 17 16 20 66 5 92 -16 31 -104 81 -205 117 -89 32 -104 34 -218
34 -67 0 -139 3 -160 6 -64 11 -36 29 54 35 46 3 92 9 102 14 33 14 69 90 69
148 1 63 -20 107 -64 140 -56 40 -98 52 -188 51 -130 0 -205 -44 -230 -132
-11 -40 -7 -65 22 -138 28 -69 19 -97 -38 -133 -24 -16 -118 -52 -207 -81
-225 -73 -297 -111 -341 -183 -27 -46 -17 -97 36 -163 148 -190 225 -334 264
-497 20 -80 32 -108 55 -132 29 -30 30 -30 169 -35 118 -5 143 -9 158 -24 16
-18 11 -18 -185 -12 l-203 7 -20 -33 c-22 -34 -22 -33 -4 -190 4 -31 4 -68 0
-82 -6 -23 -11 -26 -50 -26 -54 0 -76 -22 -76 -77 0 -62 30 -83 132 -94 76 -8
112 -6 161 8 10 2 27 24 37 48 l19 43 67 8 c81 8 248 -1 288 -15 37 -15 31
-41 -14 -63 -28 -14 -61 -18 -165 -18 -111 0 -135 -3 -162 -20 -43 -26 -49
-55 -62 -290 -19 -330 -66 -497 -178 -636 -19 -23 -49 -52 -68 -65 -68 -47
-55 -73 43 -85 37 -5 213 -8 392 -9 309 0 327 -1 360 -20 45 -27 60 -76 39
-131 -22 -57 -59 -79 -132 -79 -81 1 -128 14 -337 98 -151 61 -186 71 -252 75
-65 4 -84 1 -122 -18 -82 -39 -151 -149 -196 -312 -24 -88 -25 -148 -4 -249
19 -88 15 -109 -21 -109 -63 0 -85 -40 -85 -156 0 -109 34 -174 90 -174 32 0
57 25 104 107 20 35 45 67 56 73 30 16 88 12 200 -15 162 -40 300 -50 461 -35
190 18 228 6 214 -66 -7 -40 -79 -120 -132 -148 -48 -24 -140 -35 -413 -45
-497 -20 -1471 -23 -3490 -12 -3631 19 -3255 19 -3255 -4 0 -20 9 -20 1020
-26 4122 -24 5629 -22 5985 12 133 12 175 28 246 92 158 143 93 280 -117 248
-157 -25 -339 -14 -524 30 -44 10 -108 19 -142 19 -75 0 -105 -21 -151 -108
-43 -81 -57 -91 -85 -63 -19 19 -22 32 -22 110 0 103 10 122 59 114 27 -4 34
-1 44 21 16 36 15 91 -4 172 -17 76 -13 132 18 234 43 139 104 229 173 256 70
26 135 13 330 -65 202 -82 291 -105 375 -99 64 5 97 22 134 72 16 21 21 42 21
96 0 79 -14 101 -85 134 -43 20 -57 21 -360 18 -173 -2 -336 0 -361 3 l-47 7
40 36 c22 20 56 61 76 92 93 145 131 312 151 674 12 209 4 200 189 204 157 3
200 16 227 66 24 44 16 68 -30 91 -35 18 -60 20 -216 20 -194 0 -198 -1 -227
-64 l-17 -36 -90 -3 c-108 -3 -140 9 -140 53 0 28 3 30 45 33 24 2 50 8 57 14
25 21 34 84 22 155 -14 87 -15 141 -1 155 7 7 56 7 163 -2 179 -14 233 -9 255
25 14 21 14 26 -1 48 -9 14 -24 29 -33 33 -9 4 -79 10 -154 13 -168 7 -167 6
-201 147 -14 55 -41 136 -61 178 -37 80 -135 234 -204 321 -57 70 -60 91 -21
138 41 49 114 85 279 137 294 93 349 147 290 285 -38 89 -20 149 57 186 100
48 259 19 304 -55 37 -61 12 -164 -45 -186 -13 -4 -54 -8 -90 -8 -57 0 -71 -3
-92 -23 -30 -28 -31 -64 -1 -81 14 -8 83 -15 187 -19 155 -5 171 -8 253 -39
98 -36 172 -86 172 -115 0 -12 -16 -27 -45 -42 -25 -13 -60 -39 -79 -59 -32
-35 -33 -39 -29 -98 3 -33 22 -113 43 -176 51 -157 51 -199 -4 -313 -65 -138
-64 -203 5 -268 23 -21 24 -29 24 -132 0 -132 13 -166 71 -192 29 -14 39 -24
39 -41 0 -43 -36 -55 -156 -52 -128 3 -148 -3 -172 -45 -40 -74 -8 -388 73
-711 47 -189 67 -233 135 -311 33 -38 60 -73 60 -79 0 -6 -12 -22 -25 -35 -18
-16 -25 -34 -25 -59 0 -30 8 -43 50 -83 61 -57 62 -75 15 -161 -73 -133 -135
-265 -150 -323 -9 -35 -18 -119 -21 -200 -6 -173 -16 -217 -71 -329 -50 -103
-54 -146 -20 -197 45 -67 223 -127 502 -171 171 -26 540 -31 695 -9 236 33
381 91 427 169 38 64 44 173 14 235 -12 25 -34 53 -48 62 -31 21 -85 17 -261
-14 -253 -46 -541 -52 -822 -16 -192 24 -237 46 -260 131 -34 121 74 516 165
604 65 63 149 49 293 -49 218 -147 336 -153 455 -21 91 102 129 228 83 279
-24 27 -64 27 -336 1 -232 -22 -366 -25 -439 -9 -66 14 -80 31 -46 56 93 65
123 114 163 268 32 122 40 190 52 450 7 132 15 260 18 285 l7 45 90 8 c127 10
137 13 133 40 -5 33 -67 59 -143 61 -57 1 -67 -2 -94 -28 -28 -27 -33 -28
-109 -25 -93 5 -122 22 -122 74 0 38 42 122 73 148 50 41 89 49 250 56 141 5
160 8 173 25 20 28 18 39 -12 67 -25 23 -31 24 -219 29 -106 3 -196 8 -200 11
-3 4 1 24 10 45 30 69 33 92 25 161 -13 97 -41 174 -132 368 -86 183 -128 292
-128 336 0 31 40 83 79 103 14 8 62 23 106 35 110 31 147 53 181 115 26 45 34
51 66 54 48 4 71 32 71 86 0 54 -29 111 -75 149 -32 25 -46 29 -119 33 -111 7
-126 11 -139 34 -32 60 25 83 196 81 97 -1 123 2 127 13 9 23 -18 122 -69 251
-59 152 -74 230 -54 288 13 37 21 44 70 64 147 58 521 48 626 -18 69 -42 69
-66 5 -263 -57 -175 -85 -302 -67 -314 6 -4 54 -7 105 -7 l95 0 23 -34 c28
-42 26 -61 -7 -79 -25 -13 -78 -13 -437 4 -97 5 -137 3 -147 -5 -29 -24 -6
-38 72 -45 42 -4 105 -14 140 -21 127 -30 149 -58 117 -152 -11 -32 -15 -57
-9 -62 5 -5 53 -22 107 -38 l99 -29 -219 -27 c-120 -15 -248 -30 -285 -33 -56
-6 -68 -10 -68 -24 0 -10 16 -25 38 -36 33 -17 56 -19 232 -15 411 10 522 7
557 -11 61 -34 76 -83 52 -173 -6 -22 -66 -155 -134 -295 -150 -310 -169 -363
-161 -445 4 -37 14 -71 27 -88 l20 -28 -30 -35 c-35 -40 -48 -80 -34 -103 6
-9 33 -20 61 -24 l51 -8 41 -81 c68 -136 58 -148 -123 -148 -178 0 -183 -8
-180 -303 3 -310 32 -539 83 -654 12 -27 49 -75 90 -115 l70 -69 0 -57 c0 -61
2 -64 114 -314 73 -162 106 -269 106 -339 0 -36 -6 -54 -30 -84 -21 -27 -30
-49 -30 -76 0 -40 2 -42 79 -92 19 -12 45 -42 59 -67 22 -42 23 -52 17 -146
-6 -84 -4 -102 9 -113 34 -29 240 -34 1391 -33 1122 0 1160 1 1160 18 0 18
-42 19 -1230 25 -676 4 -1244 10 -1261 14 l-31 7 5 96 c5 107 -4 143 -53 200
-15 18 -45 42 -66 53 -22 11 -39 26 -39 34 0 8 15 35 33 61 29 41 32 52 30
110 -2 99 -54 247 -177 504 -28 57 -36 87 -36 128 0 71 -21 112 -85 167 -33
28 -64 66 -80 99 -54 110 -85 350 -85 658 0 171 7 224 33 240 7 4 67 8 133 8
107 0 124 2 148 21 40 31 36 87 -14 187 -22 44 -47 85 -54 92 -8 6 -36 15 -62
18 l-47 7 37 43 c40 49 45 82 17 118 -31 39 -35 103 -11 175 12 35 77 179 145
319 135 276 157 339 145 410 -11 66 -18 78 -65 105 -70 42 -164 48 -441 29
-133 -8 -252 -14 -265 -12 -27 4 393 57 486 62 45 2 61 7 63 19 4 21 -6 26
-158 73 -97 30 -134 46 -131 55 2 8 6 40 9 71 4 55 3 59 -29 89 l-34 32 80 -5
c218 -14 298 38 233 153 -29 53 -79 72 -164 63 l-65 -7 6 29 c4 16 9 38 12 49
2 11 29 100 60 197 54 171 55 178 42 219 -18 57 -79 103 -155 119 -159 33
-324 38 -477 14z m-19 -2691 c-16 -2 -40 -2 -55 0 -16 2 -3 4 27 4 30 0 43 -2
28 -4z"/>
                        </g>
                    </svg>
                </div>
                <div id='games-div' className='games-div'>
                    <div id='chess-div' className='games-chess'>
                        <p>Chess</p>
                    </div>
                    <div id='mastermind-div' className='games-mastermind'>
                        <p>MasterMind</p>
                    </div>
                </div>
            </div>
        );
    }


}