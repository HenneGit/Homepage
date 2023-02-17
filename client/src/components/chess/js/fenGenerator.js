import {getBoard, getBoardHistory, getHalfMoves} from "./game";
import {getField} from "./utilities";

export {generateFENString}


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
    let fields = getBoard().fields;
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
    let turnNumber = getBoardHistory().length;
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

    for (let move of getBoard().moveTracker) {
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
    let moveTracker = getBoard().moveTracker;
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
    fenString += " " + getHalfMoves();
    return fenString;
}

/**
 * add move counter to fen string indicating the current number of played turns.
 * @param fenString the fen string to add move counter to.
 * @returns {*} the updated fen string.
 */
function addMoveCounter(fenString) {
    fenString += " " + getBoardHistory().length;
    return fenString;
}