import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { FaFolder } from 'react-icons/fa';
import Header from './Header';

export function BucketFolder({ bucket }) {

    return (
        <div className='col-4'>
            <Link className='text-decoration-none' to={'bucket/' + bucket.id} >
                <FaFolder size="2em" />
                <span className='ml-2'>{bucket.name}</span>
            </Link>

        </div>
    )

}

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectionToSignIn: false,
            user: {},
            token: '',
            buckets: []
        }
    }

    getBuckets = async () => {
        const { token } = this.state
        return fetch(`${process.env.REACT_APP_API_URL}api/users/${this.state.user.uuid}/buckets`, {
            method: 'GET',
            headers:
                new Headers({
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                })
        })
            .then((response) => response.json())
            .then((json) => {
                this.setState({
                    buckets: json.data.bucket
                })
            })
            .catch((error) => {
                console.error(error);
            })
    }

    async componentDidMount() {
        await this.getDataStorage()
        if (this.state.token !== '') {
            this.getBuckets()
        }

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
                <div className="container auth-wrapper">
                    <div className="row">
                        <div className="home-inner col-sm-12 col-md-12 col-lg-10 px-4">
                            <Header />
                            <form >
                                <div className='form-group'>
                                    <label>
                                        Nom du dossier:
                            <input type="text" name="name" className="form-control" />
                                    </label>
                                    <button type="submit" class=" ml-2 btn btn-primary">Creer </button>
                                </div>
                            </form>

                            <div className="container">
                                <div className="row">
                                    {this.state.buckets.map((bucket) => {
                                        return <BucketFolder bucket={bucket} key={bucket.id} />
                                    })}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )
        }
    }
}