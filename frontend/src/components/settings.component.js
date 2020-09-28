import React, { Component } from "react";

export default class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = { email: '' };
        this.state = { threshold: null };
      }
    
      handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
      }
    
      handleSubmit = (event) => {
        alert('Сonfirmation has been sent to your email: ' + this.state.email);
    
        fetch('https://dev1-api.bandapixels.foxyloxy.me/mail/create', {
            method: 'POST',
            body: JSON.stringify(this.state),
            headers: {
              'Content-Type': 'application/json',
            },
          }).then(function(response) {
            console.log(response)
            return response.json();
          });
    
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit} >
                <h3>Get info</h3>

                <div className="form-group">
                    <label>Email address</label>
                    <input type="email" className="form-control" placeholder="Enter email" required
                    value={this.state.value} name="email" onChange={this.handleChange}/>
                </div>

                <div className="form-group">
                    <label>Threshold</label>
                    <input className="form-control" placeholder="course" required 
                     value={this.state.value} name="threshold" onChange={this.handleChange}/>
                </div>
                 <input type="submit"  className="btn btn-primary btn-block" value="Submit" />
            </form>
        );
    }
}
