import './App.css';
import React,{Component} from 'react';
import axios from 'axios';
import {Navigation, Games, Header, Display} from "./components";


export default class App extends Component {
    constructor(){
        super();
    }

    render(){
        return (
            <div className="App">
                <div className="gradient__bg">
                    <Navigation/>
                    <Display/>
                    <Header/>
                </div>
                <div>
                    <Games/>
                </div>
            </div>
        );
    }
}

