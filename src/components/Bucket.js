import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { FcImageFile } from 'react-icons/fc';
import { ExternalLink } from 'react-external-link';

import Header from './Header';


export function Blob({blob,user,bucket_name}){

    return   (
    <div className='col-4'>
     <ExternalLink className='text-decoration-none' href ={`https://mys3-mj.s3.eu-west-3.amazonaws.com/mys3DATA/${user.uuid}/${bucket_name}/${blob.name}`} >
     <FcImageFile size="2em" />
     <span className='ml-2'>{blob.name}</span>
     </ExternalLink>
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
            blobs:[],
            file :null,
            error:null
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
            if(json){
                this.setState({
                blobs : json})
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
        this.getBlobs()
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

    createBlob = async () => {
        console.log('file ',this.state.file);
        const formData = new FormData()
        formData.append( 
            "data", 
            this.state.file, 
            this.state.file.name 
          )
        const id =this.props.match.params.id
        const {token} = this.state
        fetch(`${process.env.REACT_APP_API_URL}api/users/${this.state.user.uuid}/buckets/${id}/blobs/`, {
            method: 'POST',
            body:formData,
            headers:
              new Headers({
                'Authorization': 'Bearer ' + token
              })
        }).then(()=>{
            this.getBlobs()
        }).catch((err)=>{
            console.error(err)
        })
    }


    handleChange(e){
        e.preventDefault() 
        this.setState({
            file : e.target.files[0]
        })
    }



    render() {
        if (this.state.redirectionToSignIn) {
            return <Redirect to='/sign-in' />
        } else {
            return (
                <div className="auth-wrapper">
                    <div className="home-inner">
                        <Header />
                        <div className="container">
                        <div className='form-group'>
                                    <label>
                                        Importer un fichier :
                                        <input type="file"  className="form-control" placeholder="Ex: covid-19 ❤"  onChange={(e)=>{this.handleChange(e)}} />
                                    </label>
                                    <button type="submit" className="btn btn-primary ml-2" onClick={this.createBlob}>Créer</button>
                        </div>
                            <div className="row">
                            {this.state.blobs.map((blob) => {
                            
                                return <Blob blob={blob} user = {this.state.user} bucket_name = {blob.bucket.name} key={blob.id} />
                            })}
                            </div>
                        </div>   
                    </div>
                </div>
            )
        }
    }
}