import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'

export default class ResetPassword extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            error: '',
            message: '',
            emailSent: false
        }
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    resetPassword = async () => {
        const req = await fetch(`${process.env.REACT_APP_API_URL}api/reset-password/${this.state.email}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        try {
            const json = await req.json()
            if (json.err) {
                this.setState({ error: json.err.description })
            } else {
                console.log(json.data)
                this.setState({ message: json.message, emailSent: true })

            }
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        if (!this.state.emailSent) {
            return (
                <div className="container auth-wrapper">
                    <div className="row">
                        <div className="auth-inner col-sm-12 col-md-6 col-lg-3 px-4">
                            <h3>Mot de passe oublié</h3>

                            <div className="form-group">
                                <p>En entrant votre email et en validant, vous allez recevoir par email un nouveau mot de passe vous permettant de vous connecter au compte associé.</p>
                                <label>Adresse email</label>
                                <input type="text" name="email" className="form-control" placeholder="Email" value={this.state.email} onChange={this.handleChange} />
                            </div>
                            <p>{this.state.error}</p>
                            <button type="submit" className="btn btn-primary btn-block" onClick={this.resetPassword}>Valider</button>
                            <p className="d-flex justify-content-center mt-4"><Link to="/sign-in">Retour</Link></p>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="container auth-wrapper">
                    <div className="row">
                        <div className="auth-inner col-sm-12 col-md-6 col-lg-3 px-4">
                            <h3>Rendez-vous dans votre boîte mail !</h3>

                            <p className="text-center">{this.state.message}</p>
                            <p className="d-flex justify-content-center mt-4"><Link to="/sign-in">Retour à la connexion</Link></p>
                        </div>
                    </div>
                </div>
            )
        }
    }
}