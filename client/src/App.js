import './App.css';
import React, {Component} from 'react';
import {Navigation, Aboutme, Display, Chess, Contact, Footer, StickyMenu} from "./components";
import {BrowserView, MobileView} from 'react-device-detect';


export default class App extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <>
                <BrowserView>
                    <div id="start">
                        <div>
                            <StickyMenu/>
                            <Navigation/>
                            <Display/>
                            <Aboutme/>
                            <Chess/>
                            <Contact/>
                            <Footer/>
                        </div>
                    </div>
                </BrowserView>
                <MobileView>
                    <p>Hello, this site is not yet implemented for mobile devices :(.</p>
                </MobileView>
            </>
        );
    }
}

