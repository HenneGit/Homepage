import './App.css';
import React,{Component} from 'react';
import axios from 'axios';
import {Navigation, Games, Header, Display} from "./components";
import Chess from "./components/chess/Chess";


export default class App extends Component {
    constructor(){
        super();
    }

    render(){
        return (
            <div className="App">
                <div className="gradient__bg">
                    <Chess/>
                </div>

            </div>
        );
    }
}

