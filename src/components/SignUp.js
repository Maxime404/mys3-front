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
                await this.storeData(json.data)
                this.setState({ redirectionToHome: true })
            }
        } catch (error) {
            console.log(error);
        }
    }

    storeData = async (data) => {
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
                <div>
                    <p>There's sign up page !</p>
                    <input type="text" name="firstname" placeholder="firstname" value={this.state.firstname} onChange={this.handleChange} />
                    <input type="text" name="lastname" placeholder="lastname" value={this.state.lastname} onChange={this.handleChange} />
                    <input type="text" name="nickname" placeholder="nickname" value={this.state.nickname} onChange={this.handleChange} />
                    <input type="text" name="email" placeholder="email" value={this.state.email} onChange={this.handleChange} />
                    <input type="password" name="password" placeholder="password" value={this.state.password} onChange={this.handleChange} />
                    <input type="password" name="passwordConfirmation" placeholder="password confirmation" value={this.state.passwordConfirmation} onChange={this.handleChange} />
                    <input type="submit" value="Envoyer" onClick={this.signUp} />
                    <p>{this.state.error}</p>
                    <Link to="/signin">SignIn</Link>
                </div>
            )
        }
    }
}