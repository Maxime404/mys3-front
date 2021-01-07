import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'

export default class SignUp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            firstname: '',
            lastname: '',
            nickname: '',
            email: '',
            password: '',
            passwordConfirmation: '',
            error: '',
            redirectionToHome: false,
        }
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    signUp = async () => {
        const req = await fetch(`${process.env.REACT_APP_API_URL}api/authenticate/signup`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstname: this.state.firstname.trim(),
                lastname: this.state.lastname.trim(),
                nickname: this.state.nickname.trim(),
                email: this.state.email.trim(),
                password: this.state.password.trim(),
                passwordConfirmation: this.state.passwordConfirmation.trim()
            })
        })
        try {
            const json = await req.json()
            if (json.err) {
                this.setState({ error: json.err.description })
            } else {
                //console.log(json.data)
                await this.setDataStorage(json.data)
                this.setState({ redirectionToHome: true })
            }
        } catch (error) {
            console.log(error);
        }
    }

    setDataStorage = async (data) => {
        try {
            await localStorage.setItem('data', JSON.stringify(data))
        } catch (error) {
            console.log('Local storage data Error : ', error)
        }
    }

    render() {
        if (this.state.redirectionToHome) {
            return <Redirect to='/' />
        } else {
            return (
                <div className="container auth-wrapper">
                    <div className="row">
                        <div className="auth-inner col-sm-12 col-md-6 col-lg-3 px-4">
                            <h3>Inscription</h3>

                            <div className="form-group">
                                <label>Prénom</label>
                                <input type="text" name="firstname" className="form-control" placeholder="Prénom" value={this.state.firstname} onChange={this.handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Nom</label>
                                <input type="text" name="lastname" className="form-control" placeholder="Nom" value={this.state.lastname} onChange={this.handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Pseudo</label>
                                <input type="text" name="nickname" className="form-control" placeholder="Pseudo" value={this.state.nickname} onChange={this.handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Adresse email</label>
                                <input type="text" name="email" className="form-control" placeholder="Email" value={this.state.email} onChange={this.handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Mot de passe</label>
                                <input type="password" name="password" className="form-control" placeholder="Mot de passe" value={this.state.password} onChange={this.handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Confirmation du mot de passe</label>
                                <input type="password" name="passwordConfirmation" className="form-control" placeholder="Confirmation du mot de passe" value={this.state.passwordConfirmation} onChange={this.handleChange} />
                            </div>
                            <div className="form-group">
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" id="customCheck1" />
                                    <label className="custom-control-label" htmlFor="customCheck1">J'accepte les conditions générales d'utilisation</label>
                                </div>
                            </div>
                            <p>{this.state.error}</p>
                            <button type="submit" className="btn btn-primary btn-block" onClick={this.signUp}>Valider</button>
                            <p className="d-flex justify-content-center mt-4">Déjà inscrit ?&nbsp;<Link to="/sign-in">Connecte toi ici !</Link></p>
                        </div>
                    </div>
                </div>
            )
        }
    }
}