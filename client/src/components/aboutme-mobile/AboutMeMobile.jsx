import React from "react";
import './about-me-mobile.css';
import bewerbung from '../../assets/bewerbung_hoch.jpg'


const AboutMeText = () =>
    (
        <>
            <div id="content-box" className="content-box-mobile">
                <div className="about-me-text-mobile">
                    <h1>Hello,</h1>
                    <p>
                        and welcome to my personal homepage! Currently you are looking at the mobile version which is as
                        of now not the complete website. So please make sure to check it out on your non-mobile device.
                        Thank you and see you there.
                    </p>

                </div>
            </div>
        </>
    )


function AboutMeMobile() {
    return (
        <section className="about-me-mobile-section">
            <div className="about-me-mobile-container">
                <div className="about-me-image" id="about-me-image">
                    <img id="my-picture" src={bewerbung}/>
                </div>
                <AboutMeText/>
            </div>
        </section>
    );
}

export default AboutMeMobile;