import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { registerUser } from "../actions/authActions";

import { Grid, Button } from '@material-ui/core';
import { MuiThemeProvider } from 'material-ui/styles';
import { TextField } from "material-ui";

import '../styles/form.css';


class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      errors: {}
    };
  }

  // If user is logged in, should not be able to navigate to Register
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

  // Update state when form is changed
  onChange = (e) => {
    e.preventDefault();
    this.setState({ [e.target.id]: e.target.value });
  };

  // Try to register new user upon form submit
  onSubmit = (e) => {
    e.preventDefault();

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      // password2: this.state.password2
    };

    this.props.registerUser(newUser, this.props.history);
  };

  render() {
    // const { errors } = this.state;

    return (
      <div>
        <Grid container spacing={24}>
          <Grid item xs={4}>
            </Grid>
              <Grid item xs={4}>
                <div className='main'>
                  <h1 id='mainTitle'>Sign Up</h1>
                  <MuiThemeProvider>
                    <div className="App">
                      <form noValidate>
                        <br />
                        <TextField
                          name="name"
                          id="name"
                          // className={classnames("", { invalid: errors.name })}
                          hintText="Name"
                          floatingLabelText="Name"
                          value={this.state.name}
                          // error={errors.name}
                          onChange={this.onChange}
                          floatingLabelFixed
                        />
                        <TextField
                          name="email"
                          id="email"
                          // className={classnames("", { invalid: errors.email })}
                          hintText="E-mail"
                          floatingLabelText="E-mail"
                          value={this.state.email}
                          // error={errors.email}
                          onChange={this.onChange}
                          floatingLabelFixed
                        />
                        <TextField
                          name="password"
                          id="password"
                          // className={classnames("", { invalid: errors.password })}
                          hintText="Password"
                          floatingLabelText="Password"
                          type="password"
                          value={this.state.password}
                          // error={errors.password}
                          onChange={this.onChange}
                          floatingLabelFixed
                        />
                        <TextField
                          name="password2"
                          id="password2"
                          type="password"
                          // className={classnames("", { invalid: errors.password2 })}
                          hintText="Verify Password"
                          floatingLabelText="Verify Password"
                          value={this.state.password2}
                          // error={errors.password2}
                          onChange={this.onChange}
                          floatingLabelFixed
                        />
                        <br />
                        <br />
                        <Button variant="outlined" color="secondary" onClick={this.onSubmit}>
                          Sign up
                        </Button>
                      </form>
                    </div>
                  </MuiThemeProvider>
                </div>
              </Grid>
            <Grid item xs={4}>
          </Grid>
        </Grid>
      </div>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  // errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  // errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Register));

// Below is reference code, refer to it for redux related stuff
// i.e. errors and their popups

// <div className="container">
//   <div className="row">
//     <div className="col s8 offset-s2">
//       <Link to="/" className="btn-flat waves-effect">
//         <i className="material-icons left">keyboard_backspace</i> Back to
//         home
//       </Link>
//       <div className="col s12" style={{ paddingLeft: "11.250px" }}>
//         <h4>
//           <b>Register</b> below
//         </h4>
//         <p className="grey-text text-darken-1">
//           Already have an account? <Link to="/login">Log in</Link>
//         </p>
//       </div>
//       <form noValidate onSubmit={this.onSubmit}>
//         <div className="input-field col s12">
//           <input
//             onChange={this.onChange}
//             value={this.state.name}
//             error={errors.name}
//             id="name"
//             type="text"
//             className={classnames("", {
//               invalid: errors.name
//             })}
//           />
//           <label htmlFor="name">Name</label>
//           <span className="red-text">{errors.name}</span>
//         </div>
//         <div className="input-field col s12">
//           <input
//             onChange={this.onChange}
//             value={this.state.email}
//             error={errors.email}
//             id="email"
//             type="email"
//             className={classnames("", {
//               invalid: errors.email
//             })}
//           />
//           <label htmlFor="email">Email</label>
//           <span className="red-text">{errors.email}</span>
//         </div>
//         <div className="input-field col s12">
//           <input
//             onChange={this.onChange}
//             value={this.state.password}
//             error={errors.password}
//             id="password"
//             type="password"
//             className={classnames("", {
//               invalid: errors.password
//             })}
//           />
//           <label htmlFor="password">Password</label>
//           <span className="red-text">{errors.password}</span>
//         </div>
//         <div className="input-field col s12">
//           <input
//             onChange={this.onChange}
//             value={this.state.password2}
//             error={errors.password2}
//             id="password2"
//             type="password"
//             className={classnames("", {
//               invalid: errors.password2
//             })}
//           />
//           <label htmlFor="password2">Confirm Password</label>
//           <span className="red-text">{errors.password2}</span>
//         </div>
//         <div className="col s12" style={{ paddingLeft: "11.250px" }}>
//           <button
//             style={{
//               width: "150px",
//               borderRadius: "3px",
//               letterSpacing: "1.5px",
//               marginTop: "1rem"
//             }}
//             type="submit"
//             className="btn btn-large waves-effect waves-light hoverable blue accent-3"
//           >
//             Sign up
//           </button>
//         </div>
//       </form>
//     </div>
//   </div>
// </div>