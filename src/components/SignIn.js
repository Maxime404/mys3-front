import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'

export default class SignIn extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            error: '',
            redirectionToHome: false,
        }
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    signIn = async () => {
        const req = await fetch(`${process.env.REACT_APP_API_URL}api/authenticate/signin`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: this.state.email.trim(), password: this.state.password.trim() })
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
<<<<<<< HEAD
                <div className="auth-wrapper">
                    <div className="auth-inner">
                        <h3>Connexion</h3>
                        <div className="form-group">
                            <label>Adresse email</label>
                            <input type="text" name="email" className="form-control" placeholder="Email" value={this.state.email} onChange={this.handleChange} />
=======
                <div className="container auth-wrapper">
                    <div className="row">
                        <div className="auth-inner col-sm-12 col-md-6 col-lg-3 px-4">
                            <h3>Connexion</h3>

                            <div className="form-group">
                                <label>Adresse email</label>
                                <input type="text" name="email" className="form-control" placeholder="Email" value={this.state.email} onChange={this.handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Mot de passe</label>
                                <input type="password" name="password" className="form-control" placeholder="Mot de passe" value={this.state.password} onChange={this.handleChange} />
                            </div>
                            <p>{this.state.error}</p>
                            <button type="submit" className="btn btn-primary btn-block" onClick={this.signIn}>Se connecter</button>
                            <p className="forgot-password text-right">
                                <Link to="/reset-password">Mot de passe oublié ?</Link>
                            </p>
                            <p className="d-flex justify-content-center mt-4">Pas encore inscrit ?&nbsp;<Link to="/sign-up">Créer un compte ici !</Link></p>
>>>>>>> f3100f05435957d336de94211eaf26a6fe4b564a
                        </div>
                    </div>
                </div>
            )
        }
    }
}