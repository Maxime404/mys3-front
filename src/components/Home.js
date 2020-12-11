import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectionToSignIn: false,
            user: {},
            token: ''
        }
    }

    componentDidMount() {
        this.getDataStorage()
    }

    async getDataStorage() {
        const data = await localStorage.getItem('data')
        if (!data) {
            console.log('No user')
            this.setState({ redirectionToSignIn: true })
        }
        else {
            const jsonData = JSON.parse(data)
            this.setState({ user: jsonData.user, token: jsonData.meta.token, })
            console.log(this.state.user, this.state.token)
        }
    }

    render() {
        if (this.state.redirectionToSignIn) {
            return <Redirect to='/signin' />
        } else {
            return (
                <div>
                    <p>There's home page !</p>
                    <Link to="/profil">Profil</Link>
                </div>

            )
        }
    }
}