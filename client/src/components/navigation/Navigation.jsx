import React, {useState} from 'react'
import {RiMenu3Line, RiCloseLine} from 'react-icons/ri';
import logo from '../../assets/logo_small.jpg'
import './navigation.css'

const Menu = () => (
    <>
        <p><a href="#home">Home</a></p>
        <p><a href="#what">About Me</a></p>
        <p><a href="#games">Games</a></p>
        <p><a href="#features">Contact</a></p>
    </>
)

function Navigation() {
    const [toggleMenu, setToggleMenu] = useState(false);
    return (
        <div className='navigation'>
            <div className="navigation-links">
                <div className="navigation-links_logo">

                </div>
                <img src={logo} alt="logo"/>
            </div>
                <div className="navigation-links-container">
                    <Menu/>
                </div>
            <div className="navigation-menu">
                {toggleMenu
                    ? <RiCloseLine color="#fff" size={27} onClick={() => setToggleMenu(false)}/>
                    : <RiMenu3Line color="#fff" size={27} onClick={() => setToggleMenu(true)}/>
                }
                {toggleMenu && (
                    <div className="navigation-menu-container scale-up-center">
                        <div className="navigation-menu-container-links">
                            <Menu/>
                           </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Navigation