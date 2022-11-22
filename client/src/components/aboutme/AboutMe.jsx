import React from 'react';
import './aboutMe.css';
import bewerbung from '../../assets/bewerbung_gross.jpg'

function AboutMe() {
    return (
        <div className="header section__padding" id="home">
            <div className="header-content">
                <h1 className="gradient__text">Hello, welcome to my Webpage!</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat. </p>
            </div>
            <div className="header-image">
                <img src={bewerbung}/>
            </div>
        </div>
    );
}

export default AboutMe