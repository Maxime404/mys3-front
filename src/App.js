import React from 'react';
import {
    BrowserRouter as Router, Switch, Route, Link
} from 'react-router-dom'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import Home from './components/Home'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import Profil from './components/Profil'


export default function App() {
    return (
        <Router>
            <div className="App">
                <Switch>
                    <Route path="/" component={Home} exact />
                    <Route path="/sign-in" component={SignIn} />
                    <Route path="/sign-up" component={SignUp} />
                    <Route path="/profil" component={Profil} />
                </Switch>
            </div>
        </Router >
    );
}