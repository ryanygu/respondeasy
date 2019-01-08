import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { updateUser } from "../actions/profileActions";

import { Grid, Button } from "@material-ui/core";
import { MuiThemeProvider } from "material-ui/styles";
import { TextField } from "material-ui";

import "../styles/form.css";

class EditProfile extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      errors: {}
    };
  }

  componentDidMount() {
    // If user is not logged on, should not be able to access this page
    if (!this.props.auth.isAuthenticated) { 
      this.props.history.push("/");
		}
		
		// Get user info and load it into state
		const { user } = this.props.auth;
    this.setState({
      ...this.state,
      name: user.name,
      email: user.email,
      password: user.password
    });
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

  // Try to update user info upon form submit
  onSubmit = (e) => {
    e.preventDefault();

    const userData = {
      name: this.state.name
      // email: this.props.auth.user.email,
      // password: this.state.password
    };
    console.log("This props", this.props)
    console.log("User Data", userData)
    this.props.updateUser(userData, this.props);
    console.log("updated")
  };

  render() {
    return (
      <div>
        <Grid container spacing={24}>
          <Grid item xs={3} />
          <Grid item xs={6}>
            <div className="main">
              <h1 id="mainTitle">Edit Profile</h1>
              <MuiThemeProvider>
                <div className="App">
                  <form noValidate>
                    <br />
                    <TextField
                      name="name"
                      id="name"
                      // className={...}
                      hintText="Name"
                      floatingLabelText="Name"
                      value={this.state.name}
                      // error={errors.name}
                      onChange={this.onChange}
                      floatingLabelFixed
                    />
                    {/* <TextField
                      name="email"
                      id="email"
                      // className={...}
                      hintText="E-mail"
                      floatingLabelText="E-mail"
                      value={this.state.email}
                      // error={errors.name}
                      onChange={this.onChange}
                      floatingLabelFixed
                    /> */}
                    {/* <TextField
                      name="password"
                      id="password"
                      // className={...}
                      hintText="Password"
                      floatingLabelText="Password"
                      // value={this.state.password}
                      // error={errors.name}
                      onChange={this.onChange}
                      floatingLabelFixed
                    /> */}
                    <br />
                    <br />
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={this.onSubmit}
                    >
                      Edit
                    </Button>
                  </form>
                </div>
              </MuiThemeProvider>
            </div>
          </Grid>
          <Grid item xs={3} />
        </Grid>
      </div>
    );
  }
}

EditProfile.propTypes = {
  updateUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { updateUser }
)(withRouter(EditProfile));
