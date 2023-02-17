import {generateFENString} from "./fenGenerator";
import {castleLeft, castleRight, checkForCheckMate, executeEnPassant, getOppositeColor} from "./moves";
import {getField, getFieldByXY, updateFieldPromise} from "./utilities";
import {clearElement, createNewBoard, difficulty, init, piecePicker} from "./dom_operations";

export {getBoardHistory,setBoardHistory,getHalfMoves, setTurnNumber, incrementHalfMoves, incrementTurnNumber, resetHalfMoves,getTurnNumber, Piece, Field, Board, newGame, makeEngineMove, initChess, getBoard, setBoard, pushHistory}


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


let board = null;
let boardHistory = [];
let turnNumber = -1;
let halfMoves = 0;
let stockfish = null;


function getBoard() {
    return board;
}

function setBoard(newBoard) {
    board = newBoard;
}

function getBoardHistory() {
    return boardHistory;
}

function getHalfMoves() {
    return halfMoves;
}

function getTurnNumber() {
    return turnNumber;
}

function setTurnNumber(turn) {
    turnNumber = turn;
}

function incrementHalfMoves() {
    halfMoves++;
}

function incrementTurnNumber() {
    turnNumber++;
}

function resetHalfMoves() {
    halfMoves = 0;
}

function pushHistory(newBoard) {
    boardHistory.push(newBoard);
}

function setBoardHistory(newBoardHistory) {
    boardHistory = newBoardHistory;
}


function initChess() {
    init();
    stockfish = new Worker("http://localhost:3000/stockfish.js");
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
                checkForCheckMate(board.playerColor);
                piece.moveNumber += 1;
            });
        }
    };
}


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
    let fenString = generateFENString();
    stockfish.postMessage("position fen " + fenString + "\n");
    stockfish.postMessage("go movetime 1000\n");
    setTimeout(() => {
        stockfish.postMessage("stop\n");
    }, 1000);
}
