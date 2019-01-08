import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { Provider } from "react-redux";

import store from "./store";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser } from "./actions/authActions";

import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Login from './containers/Login';
import Landing from './containers/Landing';
import Dashboard from './containers/Dashboard';
import CreateEvent from './containers/CreateEvent';
import JoinEvent from './containers/JoinEvent';
import Rsvp from './containers/Rsvp';
import EventPage from './containers/EventPage';
import EditProfile from './containers/EditProfile';
import Register from './containers/Register';

import './styles/App.css';

// Check for token to keep user logged in
// if (localStorage.jwtToken) {
//   // Decode token
//   const token = localStorage.jwtToken;
//   setAuthToken(token);
//   const decoded = jwt_decode(token);

//   // Set user and isAuthenticated
//   store.dispatch(setCurrentUser(decoded));
// }

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {
        id: null,
        email: null,
        firstName: null,
        lastName: null,
      },
    }
  }

  // dev: auto login as admin
  componentDidMount() {
    this.setState({
      currentUser: {
        id: 0,
        email: 'admin@example.com',
        firstName: 'admin',
        lastName: 'admin',
      },
    });
  }

  render() {
    if (localStorage.jwtToken) {
      // Decode token
      const token = localStorage.jwtToken;
      setAuthToken(token);
      const decoded = jwt_decode(token);
    
      // Set user and isAuthenticated
      store.dispatch(setCurrentUser(decoded));
    }
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar currentUser={this.state.currentUser} />
            <Route exact path="/" component={Landing} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path='/create' component={CreateEvent}></Route>
            <Route exact path='/Join' component={JoinEvent}></Route>
            <Route exact path='/EditProfile' component={EditProfile}></Route>
            {/* <Route exact path='/event/eventid/host' component={EventHostView}></Route> */}
            <Route exact path='/rsvp' component={Rsvp}></Route>
            <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute exact path="/event/:id" component={EventPage} />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}
export default App;
