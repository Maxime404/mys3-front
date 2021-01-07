import React, { Component } from 'react'
import { Redirect ,Link} from 'react-router-dom'
import { FaFolder } from 'react-icons/fa';

import Header from './Header';


export function Blob({blob}){

    return   (
    <div className='col-4'>
     <Link className='text-decoration-none' >
     <FaFolder size="2em" />
     <span className='ml-2'>{blob.name}</span>
     </Link>

    </div>
    )

}


export default class Bucket extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectionToSignIn: false,
            user: {},
            token: '',
            blobs:[]
        }
    }

    getBlobs = async () => {
        const {token} = this.state
        const id =this.props.match.params.id
        return fetch(`${process.env.REACT_APP_API_URL}api/users/${this.state.user.uuid}/buckets/${id}/blobs/`, {
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
            if(json.data){
                this.setState({
                blobs : json.data})
            }
            else{
                throw new Error(json.err.description)
            }
          
          })
          .catch((error) => {
            console.log(error);
          })
      }

    async componentDidMount() {
        await this.getDataStorage()
        if (this.state.token !==''){
            this.getBlobs()
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
        console.log(this.state);
        if (this.state.redirectionToSignIn) {
            return <Redirect to='/sign-in' />
        } else {
            return (
                <div className="auth-wrapper">
                    <div className="home-inner">
                        <Header />
                        <div className="container">
                            <div className="row">
                            {this.state.blobs.map((blob) => {
                                return <Blob bucket={blob} key={blob.id} />
                            })}
                            </div>
                        </div>   
                    </div>
                </div>
            )
        }
    }
}