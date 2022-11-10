import React, {Component} from "react";
import './chess.css';
import avatar from '../../assets/avatar.png'

export default class Chess extends Component {
    constructor() {
        super();
    }

    componentDidMount() {
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
            "c8": new Piece('bishop', 'black', 0, 2,"b"),
            "d8": new Piece('queen', 'black', 0, 4,"q"),
            "e8": new Piece('king', 'black', 0, 6, "k"),
            "f8": new Piece('bishop', 'black', 0, 2, "b"),
            "g8": new Piece('knight', 'black', 0, 1,"n"),
            "h8": new Piece('rook', 'black', 0, 3,"r")
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

        let board = null;
        const boardHistory = [];
        let moveTracker = [];
        let turnNumber = -1;

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

        function Board(fields, graveyard, playerColor) {
            this.fields = fields;
            this.graveyard = graveyard;
            this.playerColor = playerColor;

        }


        function generateFENString() {
            let fields = board.fields;
            let sortedFields = Array.from(fields);
            sortedFields.sort((a,b) =>{
                return a.x - b.x;
            })
            sortedFields.sort((a,b) =>{
                return b.y - a.y;
            })
            let fenString = "";
            let emptyFieldCounter = 0;
            let counter = 0;
            for (let field of sortedFields) {
                if (counter === 8) {
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
                    if (counter === 8 && emptyFieldCounter >= 0) {
                        fenString += 8;
                        emptyFieldCounter = 0;
                    }
                    emptyFieldCounter++;
                }
                if (counter === 8) {
                    counter = 0;
                }
                counter++;
            }
            return fenString;
        }


        newGame();

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
                        piece = new Piece('pawn', color, 0, 0, color === "white" ? "P" : "p");
                    }

                    let field = new Field(piece, letter + i, j, i);
                    fields.push(field);
                }
            }
            board = new Board(fields, graveyard, "white");
            createBoard(board, board.playerColor);
        }

        /**
         * create the board and add pieces to it.
         * @param currentBoard the board to create the field from.
         */
        function createBoard(currentBoard, playerColor) {
            let contentDiv = document.getElementById('chess');
            let isBlack = playerColor === "black";
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

            let panel = getDiv('panel');
            createPanel(panel);
            contentDiv.append(panel);
            console.log(generateFENString(currentBoard));
        }

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
        function createPanel(panel) {
            let blackPieces = getPiecesFromGraveyard('black');
            let whitePieces = getPiecesFromGraveyard('white');
            if (blackPieces !== null || true) {
                appendPiecesToGraveyard(blackPieces, "bottom");
            }
            if (whitePieces !== null || true) {
                appendPiecesToGraveyard(whitePieces, "top");
            }

        }

        function appendPiecesToGraveyard(pieces, sideOfBoard) {
            let sortablePieceArray = Array.from(pieces);
            sortablePieceArray.sort(function (a, b) {
                return b.sort - a.sort;
            });
            let graveyard = document.getElementById(sideOfBoard + "Graveyard");
            let spans = graveyard.querySelectorAll("span");
            spans.forEach(span => clearElement(span));

            sortablePieceArray.forEach(piece => {
                let type = piece.type;
                let typeGraveyard = document.getElementById(sideOfBoard + "-" + type);
                let img = document.createElement('img');
                img.src = "http://localhost:5000/" + piece.type + piece.color;
                typeGraveyard.appendChild(img);
            });

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
                    createBoard(board, board.playerColor);
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
                createBoard(board, board.playerColor);
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
            container.style.gridArea = 1 + "/" + flippedNumbers[dropField.x - 1] + "/" + 5;
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
                            executeEnPassant(enemyField, currentField, captureMoveField)
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
        function executeEnPassant(enemyField, currentField, captureMoveField) {

            let movedPiece = getField(currentField.id).piece;
            movedPiece.moveNumber += 1;
            captureMoveField.piece = movedPiece;
            let captureField = getField(enemyField.id);
            currentField.piece = null;
            board.graveyard.push(captureField.piece);
            captureField.piece = null;
            resolveDrop(currentField.id, captureMoveField.id);
            createBoard(board, board.playerColor);

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
            createBoard(board, board.playerColor);

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
            createBoard(board, board.playerColor);
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
            <div className="chess-wrapper">
                <div className="chess-container">

                    <div id="topPlayer" className="player-panel">
                        <div id="topAvatar" className="avatar">
                            <img src={avatar}/>
                        </div>
                        <div className="player-graveyard-wrapper">
                            <p>StockFish</p>
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
                    <div id="bottomPlayer" className="player-panel">
                        <div id="bottomAvatar" className="avatar">
                            <img src={avatar}/>
                        </div>
                        <div className="player-graveyard-wrapper">
                            <p>StockFish</p>
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
                        <div id="turns-header"></div>
                        <div id="turns"></div>
                        <div id="buttons">
                            <i id="backButton" className="arrow left"></i>
                            <i id="forwardButton" className="arrow right"></i>
                            <div id="newGame"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
