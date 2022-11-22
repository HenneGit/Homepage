import React from 'react';


const Form = () => (
    <form id="contact-form">
        <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" className="form-control" id="name"/>
        </div>
        <div className="form-group">
            <label htmlFor="exampleInputEmail1">Email address</label>
            <input type="email" className="form-control" id="email" aria-describedby="emailHelp"
            />
        </div>
        <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea className="form-control" rows="5" id="message"/>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
    </form>

)




    function Contact() {
        return (
            <div id="form-container">
                <Form/>
            </div>
        );
    };

export default Contact;