import {getBoard} from "./game";
import {createBoard, updateField} from "./dom_operations";

export {containsPiece, getField, getKingField, getPiece, getFieldByXY, setLocalStorage, getItemFromLocalStorage, jsonCopy, updateFieldPromise }

/**
 * returns true if a field contains a piece.
 * @param field the field to check.
 * @returns {boolean} true if the field contains a piece.
 */
function containsPiece(field) {
    return field.piece !== null;
}

/**
 * create a clone of an object using json.
 * @param obj the object to clone.
 * @returns {any} the new object.
 */
function jsonCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}


/**
 * updates a field but wait to do so for a while.
 * @param oldFieldId the id of the old field.
 * @param newFieldId the id of the new field.
 * @returns {Promise<unknown>} the promise to be handled somewhere else.
 */
function updateFieldPromise(oldFieldId, newFieldId) {
    return new Promise((resolve) => {
        updateField(oldFieldId, newFieldId, true);
        setTimeout(() => {
            createBoard(getBoard(), false);
            resolve();
        }, 200);
    });
}




/**
 * get field by fieldId
 * @param fieldId
 */
function getField(fieldId) {
    for (let field of getBoard().fields) {
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
    for (let field of getBoard().fields) {
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
    for (let field of getBoard().fields) {
        if (field.id === currentField.id) {
            return field.piece;
        }
    }
}



/**
 * get field by x,y coordinates.
 * @param x
 * @param y
 */
function getFieldByXY(x, y) {
    for (let field of getBoard().fields) {
        if (field.x === x && field.y === y) {
            return field;
        }
    }
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