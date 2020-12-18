import React, { Component } from 'react';
import { Link } from 'react-router-dom'

export default class Header extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-light fixed-top">
                <div className="container">
                    <Link className="navbar-brand" to={"/"}>MyS3 App</Link>
                    <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to={"/"}>Accueil</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to={"/profil"}>Mon profil</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }
}

