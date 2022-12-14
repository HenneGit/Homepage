import './App.css';
import React,{Component} from 'react';
import {Navigation, AboutMe, Display, Chess, Contact, Footer, Cv} from "./components";


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
                    <AboutMe/>
                    <Cv/>
                    <Chess/>
                    <Contact/>
                    <Footer/>
                </div>
            </div>
        );
    }
}

