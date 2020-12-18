import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'

import Header from './Header';

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
        const data = await JSON.parse(localStorage.getItem('data'))
        if (!data || !data.user || !data.meta.token) {
            console.log('Some storage item is missing')
            this.setState({ redirectionToSignIn: true })
        } else {
            this.setState({ user: data.user, token: data.meta.token })
        }
    }

    render() {
        if (this.state.redirectionToSignIn) {
            return <Redirect to='/sign-in' />
        } else {
            return (
                <div className="auth-wrapper">
                    <div className="home-inner">
                        <Header />

                        <p className="d-flex justify-content-center mt-3">Home page en cours de construction...</p>
                    </div>
                </div>
            )
        }
    }
}