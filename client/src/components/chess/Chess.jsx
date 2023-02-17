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
import {initChess} from "./js/game";


export default class Chess extends Component {
    constructor() {
        super();
    }


    componentDidMount() {
        initChess();
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
                <dialog className="modal" id="modal">
                    <p>Checkmate</p>
                    <button className="button close-button">Close</button>
                </dialog>
            </section>

        )
    };
}
