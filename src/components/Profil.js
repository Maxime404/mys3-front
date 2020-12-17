import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { isEmpty } from 'lodash'

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
            return <Redirect to='/signin' />
        } else {
            const { user } = this.state
            return (
                <div>
                    <div>
                        <p>There's sign up page !</p>
                        <input type="text" name="firstname" placeholder={user.firstname} value={this.state.firstname} onChange={this.handleChange} />
                        <input type="text" name="lastname" placeholder={user.lastname} value={this.state.lastname} onChange={this.handleChange} />
                        <input type="text" name="nickname" placeholder={user.nickname} value={this.state.nickname} onChange={this.handleChange} />
                        <input type="submit" value="Mettre à jour" onClick={this.updateUser} />
                        <p>{this.state.error}</p>
                        <Link to="/">Home</Link>
                    </div>
                    <div>
                        <button onClick={this.deleteUser}>Delete user</button>
                    </div>
                </div>
            )
        }
    }
}