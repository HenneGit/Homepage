import React from 'react';
import './header.css';
import bender from '../../assets/bender.jpeg'
import git from '../../assets/gitlab.png'

function Header() {
    return (
        <div className="header section__padding" id="home">
            <div className="header-content">
                <h1 className="gradient__text">Hello, welcome to my Webpage!</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat. </p>

                <div className="header-content-input">
                    <input type="email" placeholder="Your Email"/>
                    <button type="button">Get Started</button>
                </div>
                <div className="header-content-git">
                    <img src={git}/>
                    <p>Futurama, you can't proove it wont happen!</p>
                </div>
            </div>
            <div className="header-image">
                <img src={bender} alt="bender"/>
            </div>
        </div>
    );
}

export default Header