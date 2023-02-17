import {updateField} from "./dom_operations";
import {getBoard, getBoardHistory, setBoard} from "./game";
import {dragDrop, resolveDrop} from "./drag_drop";
import {containsPiece, getField, getFieldByXY, jsonCopy} from "./utilities";

export {getOppositeColor, castleRight, castleLeft, getMovesForPiece, checkForCheck, checkForCheckMate, executeEnPassant}

const vectors = [[2, -1], [2, 1], [-1, 2], [1, 2], [-1, -2], [1, -2], [-2, 1], [-2, -1]];


const directions = {
    diagonal: {
        upLeft: [-1, 1], upRight: [1, 1], downLeft: [-1, -1], downRight: [1, -1]
    }, straight: {
        left: [-1, 0], right: [1, 0], up: [0, +1], down: [0, -1]
    }
};

/**
 * get all fields containing pieces by given color.
 * @param color the color to get all pieces from.
 * @returns {fields} all fields with pieces.
 */
function getAllFieldsWithPiecesByColor(color) {
    return Array.from(getBoard().fields).reduce((total, field) => {
        if (containsPiece(field) && field.piece.color === color) {
            total.push(field);
        }
        return total;
    }, []);
}

/**
 * checks if the field is in range of an enemy piece.
 * @param fieldToCheck the field the king wants to move on.
 * @param color opposite color of current piece.
 * @returns {boolean} true if an enemy piece controls the field.
 */
function fieldHasCheck(fieldToCheck, color) {
    let enemyFields = getAllFieldsWithPiecesByColor(color);
    //exlucdes field with own pieces.
    let allLegalMoves = getLegalMovesForAllPieces(enemyFields);
    for (let field of allLegalMoves) {
        if (field.id === fieldToCheck.id) {
            return true;
        }
    }
    return false;
}


/**
 * execute en passant with a pawn.
 * @param enemyField the enemy field containing a pawn.
 * @param currentField the field the pawn is on
 * @param captureMoveField the en passant field just behind enemy pawn field.
 * @param isEngineMoving if the move is made by the engine.
 */
async function executeEnPassant(enemyField, currentField, captureMoveField, isEngineMoving) {
    let movedPiece = getField(currentField.id).piece;
    movedPiece.moveNumber += 1;
    let captureField = getField(enemyField.id);
    document.getElementById(captureField.id).removeEventListener("drop", dragDrop);
    getBoard().graveyard.push(captureField.piece);
    captureField.piece = null;
    await resolveDrop(currentField.id, captureMoveField.id, isEngineMoving);

}

/**
 * castle on the right site of the board.
 * @param kingField the field the king is on.
 * @param isEngineCastling if the engine is moving.
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
 * @param isEngineCastling if the engine in castling.
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
    if (!checkForCheck(getOppositeColor(getBoard().playerColor))) {
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
 * get all bishop moves.
 * @param field the field the bishop is currently on.
 * @returns {fields[]} all legal moves for the bishop.
 */
function getBishopMoves(field) {
    const {diagonal} = directions;
    return getLegalMoves(field, 7, diagonal, true);
}

/**
 * get all rook moves.
 * @param field the field the rook is currently on.
 * @returns {fields[]} all legal moves for the rook.
 */
function getRookMoves(field) {
    const {straight} = directions;
    return getLegalMoves(field, 7, straight, true);
}

/**
 * get all queen moves.
 * @param field the field the queen is currently on.
 * @returns {*[]} all legal moves for the queen.
 */
function getQueenMoves(field) {
    const {straight} = directions;
    const {diagonal} = directions;
    let legalMoves = [];
    legalMoves.push(...getLegalMoves(field, 7, straight, true));
    legalMoves.push(...getLegalMoves(field, 7, diagonal, true));
    return legalMoves;
}

/**
 * get legal moves for the king.
 * @param currentField the field the king is on.
 * @returns {*[]} all legal moves.
 */
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
        const boardCopy = jsonCopy(getBoardHistory().pop());
        setBoard(boardCopy)
        return !hasCheck;
    });

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

/**
 * check if en passant is valid and add according move.
 * @param enemyField the field to the left or righ.
 * @param currentField field of current pawn.
 * @param captureMoveField Field to move to when capturing.
 * @param legalMoves current legal moves to add en passant field to.
 */
function getEnPassant(enemyField, currentField, captureMoveField, legalMoves) {
    let moveTracker = getBoard().moveTracker;
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
                let enemyDomField = document.getElementById(enemyField.id);
                // class pieceBeingCaptured
                enemyDomField.classList.add('take');
                legalMoves.push(captureMoveField);
                domField.removeEventListener('drop', dragDrop);
                domField.addEventListener('drop', function () {
                    executeEnPassant(enemyField, currentField, captureMoveField, false)
                });
            }
        }
    }
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
    let allFieldsWithColor = getAllFieldsWithPiecesByColor(color).filter(field => field.piece.type !== 'king');
    let legalMoves = getLegalMovesForAllPieces(allFieldsWithColor);
    let containsKing = legalMoves.filter(field => {
        if (containsPiece(field)) {
            return field.piece.type === 'king';
        }
    });
    return containsKing.length > 0;
}

/**
 * check if a player is check mate.
 * @param color the color to check for.
 */
function checkForCheckMate(color, board) {
    let isCheckMate = true;
    let isCheck = checkForCheck(getOppositeColor(color));
    if (isCheck) {
        let allFieldsWithPieces = getAllFieldsWithPiecesByColor(color);
        for (let field of allFieldsWithPieces) {
            let legalMoves = getMovesForPiece(field);
            for (let legalMove of legalMoves) {
                updateField(field.id, legalMove.id, false);
                let isStillInCheck = checkForCheck(getOppositeColor(color));
                const boardCopy = jsonCopy(getBoardHistory().pop());
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
    const modal = document.querySelector("#modal");
    const closeModal = document.querySelector(".close-button");
    modal.showModal();
    closeModal.addEventListener("click", () => {
        modal.close();
    });
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


