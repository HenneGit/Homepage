import React from 'react'
import logo from '../../assets/avatar_rund.png'
import './navigation.css'


const Menu = () => (
    <>
        <p><a className='link-effect' href="#aboutMe">About Me</a></p>
        <p><a className='link-effect' href="#chess-container">Chess</a></p>
        <p><a className='link-effect' href="#contact">Contact</a></p>
    </>
)

function Navigation() {
    return (
        <div className='navigation'>
            <div className="navigation-left">
                <div className="navigation-left_logo">
                </div>
                <img src={logo} alt="logo"/>
            </div>
            <div className="navigation-left-container">
                <Menu/>
            </div>
        </div>
    );
}

export default Navigation;