
import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom'

import Home from './components/Home'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import Profil from './components/Profil'


export default function App() {
    return (
        <Router>
            <Route path="/" component={Home} exact />
            <Route path="/signin" component={SignIn} exact />
            <Route path="/signup" component={SignUp} exact />
            <Route path="/profil" component={Profil} exact />
        </Router >
    );
}