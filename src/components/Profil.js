import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'

import Header from './Header';

export default class SignUp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: {},
            token: '',
            firstname: '',
            lastname: '',
            nickname: '',
            error: '',
            redirectionToSignIn: false
        }
    }

    componentDidMount() {
        this.getDataStorage()
    }

    async getDataStorage() {
        const data = await JSON.parse(localStorage.getItem('data'))
        if (!data || !data.user || !data.meta.token) {
            console.log('Some storage item is missing')
            this.setState({ redirectionToSignIn: true })
        } else {
            this.setState({ user: data.user, token: data.meta.token })
        }
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    updateUser = async () => {
        const { user, token } = this.state
        const req = await fetch(`${process.env.REACT_APP_API_URL}api/users/${user.uuid}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                firstname: this.state.firstname ? this.state.firstname.trim() : user.firstname,
                lastname: this.state.lastname ? this.state.lastname.trim() : user.lastname,
                nickname: this.state.nickname ? this.state.nickname.trim() : user.nickname,
            })
        })
        try {
            const json = await req.json()
            if (json.err) {
                this.setState({ error: json.err.description })
            } else {
                //console.log(json.data)
                await this.storeData(json.data)
                console.log('User updated !')
            }
        } catch (error) {
            console.log(error);
        }
    }

    deleteUser = async () => {
        const { user, token } = this.state
        const req = await fetch(`${process.env.REACT_APP_API_URL}api/users/${user.uuid}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        try {
            const json = await req.json()
            if (json.err) {
                this.setState({ error: json.err.description })
            } else {
                //console.log(json.data)
                await this.deleteDataStorage()
                this.setState({ redirectionToSignIn: true })
            }
        } catch (error) {
            console.log(error);
        }
    }

    updateDataStorage = async (data) => {
        try {
            await localStorage.setItem('data', JSON.stringify(data))
        } catch (error) {
            console.log('Local storage data Error : ', error)
        }
    }

    deleteDataStorage = async () => {
        try {
            await localStorage.removeItem('data')
        } catch (error) {
            console.log('Local storage data Error : ', error)
        }
    }

    render() {
        if (this.state.redirectionToSignIn) {
            return <Redirect to='/sign-in' />
        } else {
            const { user } = this.state
            return (
                <div className="container auth-wrapper">
                    <div className="row">
                        <div className="auth-inner col-sm-12 col-md-6 col-lg-3 px-4">
                            <Header />

                            <h3>Mon profil</h3>

                            <div className="form-group">
                                <label>Prénom</label>
                                <input type="text" name="firstname" className="form-control" placeholder={user.firstname} value={this.state.firstname} onChange={this.handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Nom</label>
                                <input type="text" name="lastname" className="form-control" placeholder={user.lastname} value={this.state.lastname} onChange={this.handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Pseudo</label>
                                <input type="text" name="nickname" className="form-control" placeholder={user.nickname} value={this.state.nickname} onChange={this.handleChange} />
                            </div>
                            <p>{this.state.error}</p>
                            <button type="submit" className="btn btn-primary btn-block" onClick={this.updateUser}>Mettre à jour mon profil</button>
                            <button type="submit" className="btn btn-danger btn-block mt-5" onClick={this.deleteUser}>Supprimer mon compte</button>
                        </div>
                    </div>
                </div>
            )
        }
    }
}