import React, {Component} from 'react';
import './contact.css';
import emailjs from '@emailjs/browser';


export default class Contact extends Component {
    constructor() {
        super();
    }


    componentDidMount() {
        init();

        function init() {
            emailjs.init('__dpeUhliQSxalKvl');
            document.getElementById('contact-form').addEventListener('submit', submit);
        }


        function submit(event) {
            event.preventDefault();
            // generate a five digit number for the contact_number variable
            this.contact_number.value = Math.random() * 100000 | 0;
            let message = document.getElementById("message").value;

            if (message === "" || message === undefined || message === null) {
                alert("If you want to sent me an email please make sure there is a message :).")
                return;
            }
            let emailAddress = document.getElementById("email").value;
            if (emailAddress === "" || emailAddress === undefined || emailAddress === null) {
                alert("Please enter your email address. Otherwise I can't write you back!")
                return;
            }


            emailjs.sendForm('service_nutnlxd', 'template_wb0h6td', this)
                .then(function () {
                    saySomething("Thank you for your message :)");
                }, function (error) {
                    saySomething("Something went wrong :(.  Please try again later. ");
                });
        }

        function saySomething(stringMessage) {
            let formContainer = document.getElementById("contact");
            while (formContainer.firstChild) {
                formContainer.removeChild(formContainer.firstChild);
            }
            let thankYou = document.createElement("span");
            thankYou.classList.add("thank-you-div");
            thankYou.innerText = stringMessage;
            formContainer.append(thankYou);
        }
    }

    render() {
        return (
            <section id="contact">
                <div>
                    <h1>Contact</h1>
                    <form id="contact-form">
                        <input type="hidden" name="contact_number"/>
                        <label htmlFor="name">Name</label>
                        <input type="text" className="form-control" id="name" name="user_name"/>
                        <label htmlFor="exampleInputEmail1">Email address</label>
                        <input type="email" className="form-control" id="email" aria-describedby="emailHelp"
                               name="user_email"/>
                        <label htmlFor="message">Message</label>
                        <textarea className="form-control" rows="5" id="message" name="message"/>
                        <button type="submit">Submit</button>
                    </form>
                </div>
            </section>
        )
    }
}
