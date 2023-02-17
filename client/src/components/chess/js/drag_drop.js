import * as util from './utilities'
import * as moves from './moves'
import {getBoard, getBoardHistory, incrementTurnNumber, makeEngineMove, setBoard} from "./game";
import {
    createBoard,
    createPiecePicker,
    getPieceWasPicked,
    setPieceWasPicked,
    updateField
} from "./dom_operations";
import {checkForCheck, checkForCheckMate, getMovesForPiece, getOppositeColor} from "./moves";
import {containsPiece, getKingField, jsonCopy, updateFieldPromise} from "./utilities";

export {dragDrop, dragStart, dragEnd, resolveDrop}


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
    let currentField = util.getField(fieldId);
    let currentPieceColor = currentField.piece.color;
    let legalFields = getMovesForPiece(currentField);
    let color = getOppositeColor(currentPieceColor);
    if (checkForCheck(color)) {
        legalFields = legalFields.filter(field => {
            updateField(currentField.id, field.id, false);
            let resolvesCheck = moves.checkForCheck(color);
            const boardCopy = util.jsonCopy(getBoardHistory().pop());
            setBoard(boardCopy);
            return !resolvesCheck;
        })

    }
    //make every legal move and check if check is given
    legalFields = legalFields.filter(field => {
        updateField(currentField.id, field.id, false);
        let createsCheck = checkForCheck(color);
        setBoard(jsonCopy(getBoardHistory().pop()));
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
        if (getPieceWasPicked() === true) {
            clearInterval(interval);
            createBoard(getBoard(), false);
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
    getBoard().moveTracker.push([oldFieldId, newFieldId]);
    incrementTurnNumber();
    if (!isEngineMove) {
        await updateFieldPromise(oldFieldId, newFieldId, true).then(() => {
            checkForCheckMate(getOppositeColor(getBoard().playerColor))
        }).then(makeEngineMove);

    } else {
        await updateFieldPromise(oldFieldId, newFieldId, true).then(() => {
            checkForCheckMate(getBoard().playerColor);
        });
    }
}

/**
 * triggered when a piece was dropped on a field.
 */
async function dragDrop() {
    let draggedElement = document.querySelector('.dragged');
    let dropField = util.getField(this.id);
    let oldFieldId = draggedElement.parentElement.id;
    let oldField = util.getField(oldFieldId);
    let movedPiece = oldField.piece;
    if (movedPiece !== null) {
        if (movedPiece.type === 'pawn' && (dropField.y === 1 || dropField.y === 8)) {
            setPieceWasPicked(false);
            await createPiecePicker(dropField, oldField, movedPiece.color);

        } else {
            movedPiece.moveNumber += 1;
            resolveDrop(oldFieldId, this.id, false);
        }
    }
}

