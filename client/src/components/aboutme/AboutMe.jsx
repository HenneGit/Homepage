import React, {Component} from 'react';
import './aboutMe.css';
import thatsme from '../../assets/thatsme.png'
import bewerbung from '../../assets/bewerbung_gross.jpg'
import {faGit} from "@fortawesome/free-brands-svg-icons";
import {faLinkedin} from "@fortawesome/free-brands-svg-icons";
import {faEnvelope} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


export default class Cv extends Component {
    constructor() {
        super();
    }


    componentDidMount() {
        let image = document.getElementById("my-picture");
        image.addEventListener("mouseover", (event) => {
            event.preventDefault();
            let thatsMeImage = document.getElementById("thats-me");
            thatsMeImage.classList.remove("thats-me");
            thatsMeImage.classList.add("thats-me-transition");
        });
        image.addEventListener("mouseleave", (event) => {
            event.preventDefault();
            let thatsMeImage = document.getElementById("thats-me");
            thatsMeImage.classList.add("thats-me");
            thatsMeImage.classList.remove("thats-me-transition");
        });

    }

    render() {
        return (
            <div className="about-me-container" id="aboutMe">
                <div className="about-me-content-wrapper">
                    <div className="headline-wrapper">
                        <p className="headline">About</p>
                        <p className="me">Me</p>
                    </div>
                    <div className="picture">
                        <div className="menu">
                            <p className="link-effect">About Me</p>
                            <p className="link-effect">What do I do</p>
                            <p className="link-effect">This website</p>
                        </div>
                        <div className="about-me-image" id="about-me-image">
                            <img id="thats-me" className="thats-me" src={thatsme}/>
                            <img id="my-picture" src={bewerbung}/>
                        </div>

                    </div>

                    <div className="about-me-content text-block">
                        <div className="content-headline">Hello again!</div>
                        <p className="text-block">Welcome to my page. In the box right next to this one you can read about who I am. Down below
                            you can learn of what I did in my life before and what skills I possess.
                            If you are done with that, why not linger around and play a round of chess against
                            Stockfish. Might be fun. If you have questions or want to contact me fell free to do so in
                            the formular I created at the bottom of this page.
                            Anyways thanks for visiting and have a good day :)!

                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Suspendisse potenti nullam ac tortor vitae purus faucibus ornare suspendisse. Imperdiet proin fermentum leo vel. Nunc scelerisque viverra mauris in aliquam. Enim eu turpis egestas pretium aenean pharetra. Nulla aliquet enim tortor at auctor urna nunc id. Viverra maecenas accumsan lacus vel facilisis volutpat est velit egestas. Velit scelerisque in dictum non consectetur a erat nam. Ut aliquam purus sit amet luctus venenatis lectus magna fringilla. Mattis aliquam faucibus purus in massa tempor nec feugiat nisl. Sit amet consectetur adipiscing elit ut aliquam purus sit amet. Tincidunt id aliquet risus feugiat. Posuere morbi leo urna molestie at elementum eu. Tempus urna et pharetra pharetra massa massa ultricies mi quis. Adipiscing vitae proin sagittis nisl rhoncus mattis rhoncus.

                            Vitae sapien pellentesque habitant morbi tristique senectus et. Nunc vel risus commodo viverra maecenas accumsan lacus. A diam maecenas sed enim. Habitasse platea dictumst quisque sagittis purus sit amet volutpat consequat. Quis risus sed vulputate odio ut enim blandit. Massa sed elementum tempus egestas. Placerat orci nulla pellentesque dignissim enim sit amet venenatis urna. Volutpat ac tincidunt vitae semper quis lectus nulla at. Aliquam faucibus purus in massa tempor nec. Pretium aenean pharetra magna ac. Ante metus dictum at tempor. Diam vulputate ut pharetra sit. Non sodales neque sodales ut etiam sit amet nisl purus.

                        </p>
                        <div className="icons">
                            <a href="https://github.com/HenneGit" target="-_blank" className="icon">
                                <FontAwesomeIcon icon={faGit}/>
                            </a>
                            <a href="https://www.linkedin.com/in/henning-ahrens-52a183b1" target="-_blank" className="icon">
                                <FontAwesomeIcon icon={faLinkedin}/>
                            </a>
                            <a href="#contact" className="icon">
                                <FontAwesomeIcon icon={faEnvelope}/>
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

