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
            buckets: [],
            bucketName: '',
            isCreatedBucket: false
        }
    }

    async componentDidMount() {
        await this.getDataStorage()
        this.getBuckets()
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
        this.setState({ [event.target.name]: event.target.value, error: '', isCreatedBucket: false })
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
        }).then((response) => response.json())
            .then((json) => {
                if (json.data && json.data.bucket) {
                    console.log(json.data);
                    this.setState({
                        buckets: json.data.bucket
                    })
                }
            })
            .catch((error) => {
                console.error(error);
            })
    }

    createBucket = async () => {
        const { user, bucketName, token } = this.state
        const req = await fetch(`${process.env.REACT_APP_API_URL}api/users/${user.uuid}/buckets`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name: bucketName.trim() })
        })
        try {
            const json = await req.json()
            if (json.err) {
                this.setState({ error: json.err.description })
            } else {
                this.getBuckets();
                this.state({ isCreatedBucket: true })
            }
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        if (this.state.redirectionToSignIn) {
            return <Redirect to='/sign-in' />
        } else {
            const { error, isCreatedBucket, bucketName } = this.state
            return (
                <div className="container auth-wrapper">
                    <div className="row">
                        <div className="home-inner col-sm-12 col-md-12 col-lg-10 px-4">
                            <Header />
                            <div className='form-group'>
                                <label>
                                    Nom du Bucket :
                                        <input type="text" name="bucketName" className="form-control" placeholder="Ex: covid-19 ❤" value={this.state.bucketName} onChange={this.handleChange} />
                                </label>
                                <button type="submit" className="btn btn-primary ml-2" onClick={this.createBucket}>Créer</button>
                            </div>
                            {isCreatedBucket && <div className="block-message block-notify mb-3">Nouveau bucket créé</div>}
                            {error && <div className="block-message block-error mb-3">{error}</div>}

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