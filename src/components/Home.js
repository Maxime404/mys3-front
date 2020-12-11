import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { isEmpty } from 'lodash'

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
        const missings = this.state.storageItems.filter((storageItem) => data[storageItem])

        if (!isEmpty(missings)) {
            const isPlural = missings.length > 1

            console.log(`Storage item${isPlural ? 's' : ''} [ ${missings.join(', ')} ] ${isPlural ? 'are' : 'is'} missing`)
            this.setState({ redirectionToSignIn: true })
        }
        else {
            this.setState({ user: data.user, token: data.meta.token, })
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