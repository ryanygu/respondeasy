import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { loginUser } from "../actions/authActions";

import { Grid, Button } from "@material-ui/core";
import { MuiThemeProvider } from "material-ui/styles";
import { TextField } from "material-ui";

import "../styles/form.css";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {}
    };
  }

  // If user is logged in, should not be able to navigate to Login
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }

    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

  // Update state when form is changed
  onChange = e => {
    e.preventDefault();
    this.setState({ [e.target.id]: e.target.value });
  };

  // Try to login user upon form submit
  onSubmit = e => {
    e.preventDefault();

    const userData = {
      email: this.state.email,
      password: this.state.password
    };

    this.props.loginUser(userData);
  };

  render() {
    // const { errors } = this.state;

    return (
      <div>
        <Grid container spacing={24}>
          <Grid item xs={4} />
          <Grid item xs={4}>
            <div className="main">
              <h1 id="mainTitle">Login</h1>
              <MuiThemeProvider>
                <div className="App">
                  <form noValidate>
                    <br />
                    <TextField
                      name="email"
                      id="email"
                      // className={...}
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
                      // className={...}
                      type="password"
                      hintText="Password"
                      floatingLabelText="Password"
                      value={this.state.password}
                      // error={errors.password}
                      onChange={this.onChange}
                      floatingLabelFixed
                    />
                    <br />
                    <br />
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={this.onSubmit}
                    >
                      Log in
                    </Button>
                  </form>
                </div>
              </MuiThemeProvider>
            </div>
          </Grid>
          <Grid item xs={4} />
        </Grid>
      </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
  // errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
  // errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser }
)(Login);

// export default class Login extends Component {
//     render() {
//         return (
//             <div>
//                 <Grid container spacing={24}>
//                     <Grid item xs={4}>
//                     </Grid>
//                     <Grid item xs={4}>
//                         <div className='main'>
//                             <h1 id='mainTitle'>Login</h1>
//                             <FormDiv handleLogin={this.props.handleLogin}/>
//                         </div>
//                     </Grid>
//                     <Grid item xs={4}>
//                     </Grid>
//                 </Grid>
//             </div>
//         )
//     }
// }

// class FormDiv extends Component {
//     state = {
//         fields: {}
//     };

//     onChange = updatedValue => {
//         this.setState({
//         fields: {
//             ...this.state.fields,
//             ...updatedValue
//         }
//         });
//     };

//     render() {
//         return (
//         <MuiThemeProvider>
//             <div className="App">
//                 <Form onChange={fields => this.onChange(fields)} handleLogin={this.props.handleLogin}/>
//             {/* <p>
//                 {JSON.stringify(this.state.fields, null, 2)}
//             </p> */}
//             </div>
//         </MuiThemeProvider>
//         );
//     }
// }

// class Form extends React.Component {
//     state = {
//         email: "",
//         password: ""
//     };

//     change = e => {
//       this.props.onChange({ [e.target.name]: e.target.value });
//       this.setState({
//         [e.target.name]: e.target.value
//       });
//     };

//     onSubmit = e => {
//       e.preventDefault();
//     };

//     render() {
//       return (
// <form>
//     <br />
//     <TextField
//     name="email"
//     hintText="E-mail"
//     floatingLabelText="E-mail"
//     value={this.state.email}
//     onChange={e => this.change(e)}
//     floatingLabelFixed
//     />
//     <TextField
//     name="password"
//     hintText="Password"
//     floatingLabelText="Password"
//     value={this.state.password}
//     onChange={e => this.change(e)}
//     floatingLabelFixed
//     />
//     <br />
//     <br />
//     {/*<RaisedButton label="Edit" onClick={e => this.onSubmit(e)} primary />*/}
//     <Button variant="outlined" color="secondary" href="/dashboard">
//       Log in
//     </Button>
// </form>
//       );
//     }
//   }

// Below is reference code, refer to it for redux related stuff
// i.e. errors and their popups

/* <div className="container">
  <div style={{ marginTop: "4rem" }} className="row">
    <div className="col s8 offset-s2">
      <Link to="/" className="btn-flat waves-effect">
        <i className="material-icons left">keyboard_backspace</i> Back to
        home
      </Link>
      <div className="col s12" style={{ paddingLeft: "11.250px" }}>
        <h4>
          <b>Login</b> below
        </h4>
        <p className="grey-text text-darken-1">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
      <form noValidate onSubmit={this.onSubmit}>
        <div className="input-field col s12">
          <input
            onChange={this.onChange}
            value={this.state.email}
            error={errors.email}
            id="email"
            type="email"
            className={classnames("", {
              invalid: errors.email || errors.emailnotfound
            })}
          />
          <label htmlFor="email">Email</label>
          <span className="red-text">
            {errors.email}
            {errors.emailnotfound}
          </span>
        </div>
        <div className="input-field col s12">
          <input
            onChange={this.onChange}
            value={this.state.password}
            error={errors.password}
            id="password"
            type="password"
            className={classnames("", {
              invalid: errors.password || errors.passwordincorrect
            })}
          />
          <label htmlFor="password">Password</label>
          <span className="red-text">
            {errors.password}
            {errors.passwordincorrect}
          </span>
        </div>
        <div className="col s12" style={{ paddingLeft: "11.250px" }}>
          <button
            style={{
              width: "150px",
              borderRadius: "3px",
              letterSpacing: "1.5px",
              marginTop: "1rem"
            }}
            type="submit"
            className="btn btn-large waves-effect waves-light hoverable blue accent-3"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  </div>
</div> */
