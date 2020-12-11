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
                    <p>There's sign in page !</p>
                    <input type="text" name="email" placeholder="email" value={this.state.email} onChange={this.handleChange} />
                    <input type="password" name="password" placeholder="password" value={this.state.password} onChange={this.handleChange} />
                    <input type="submit" value="Envoyer" onClick={this.signIn} />
                    <p>{this.state.error}</p>
                    <Link to="/signup">SignUp</Link>
                </div>
            )
        }
    }
}