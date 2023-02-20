import React, {useState} from 'react'
import {RiMenu3Line, RiCloseLine} from 'react-icons/ri';
import logo from '../../assets/avatar_rund.png'
import './navigation.css'


const Menu = () => (
    <>
        <p><a className='link-effect' href="#home">Home</a></p>
        <p><a className='link-effect' href="#aboutMe">About Me</a></p>
        <p><a className='link-effect' href="#chess-container">Chess</a></p>
        <p><a className='link-effect' href="#contact">Contact</a></p>
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

export default Navigation;