export {createElement, containsPiece, getPiece, getField, getAllFieldsWithPiecesByColor, clearElement, getFieldByXY, getDiv, getKingField, getItemFromLocalStorage, getOppositeColor, setLocalStorage, addLastMoveClasses, getOption, jsonCopy}


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
 * get field by fieldId
 * @param board the current board.
 * @param fieldId
 */
function getField(fieldId, board) {
    for (let field of board.fields) {
        if (field.id === fieldId) {
            return field;
        }
    }
}

/**
 * find the field for a given color that currently contains the king.
 * @param color the color to find the king for.
 * @param board the current board.
 * @returns {null|any} the field the king is currently on.
 */
function getKingField(color, board) {
    for (let field of board.fields) {
        if (field.piece !== null && field.piece.type === "king" && field.piece.color === color) {
            return field;
        }
    }
    return null;
}


/**
 * get piece from given field.
 * @param currentField the field to get the piece from.
 * @param board the current board.
 * @returns {null|*|undefined} the found peace.
 */
function getPiece(currentField, board) {
    for (let field of board.fields) {
        if (field.id === currentField.id) {
            return field.piece;
        }
    }
    return null;
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
 * @param the current baord.
 */
function getFieldByXY(x, y, board) {
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
 * get all fields containing pieces by given color.
 * @param color the color to get all pieces from.
 * @param board the current board.
 * @returns {fields} all fields with pieces.
 */
function getAllFieldsWithPiecesByColor(color, board) {
    return Array.from(board.fields).reduce((total, field) => {
        if (containsPiece(field) && field.piece.color === color) {
            total.push(field);
        }
        return total;
    }, []);
}

/**
 * function to copy an object.
 * @param obj the object to copy.
  * @returns {any} the copied object.
 */
function jsonCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
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
    let item = sessionStorage.getItem(key);
    if (item !== null) {
        return JSON.parse(item);
    }
    return null;
}

/**
 * set a json string to local storage.
 * @param key the key for the item.
 * @param item the item to store in localstorage.
 */
function setLocalStorage(key, item) {
    sessionStorage.setItem(key, JSON.stringify(item));
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
 * add last move css classes.
 * @param field the field to add the classes for.
 */
function addLastMoveClasses(field) {
    field.classList.remove("white");
    field.classList.remove("black");
    field.classList.add("last-move");
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


