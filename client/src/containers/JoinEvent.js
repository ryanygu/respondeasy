import React, { Component } from "react";
import "../styles/form.css";
import { connect } from "react-redux";
import axios from "axios"

//Textfield & Form
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { TextField } from "material-ui";

//Radio button
import {
  Grid,
  Button,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel
} from "@material-ui/core";

import PropTypes from "prop-types";

import { joinEvent, getEvent } from "../actions/eventActions";

class JoinEvent extends Component {
  constructor() {
    super();
    this.state = {
      eventCode: "",
      rsvp: "",
      errors: {}
    };
  }

  // If user is not logged in, should not be able to navigate to join event
  componentDidMount() {
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push("/");
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   if (!nextProps.auth.isAuthenticated) {
  //     this.props.history.push("/");
  //   }

  //   if (nextProps.errors) {
  //     this.setState({
  //       errors: nextProps.errors
  //     });
  //   }
  // }

  // Update state when form is changed
  onChange = e => {
    e.preventDefault();
    this.setState({ [e.target.id]: e.target.value });
    console.log(this.state);
  };

  // Shitty way to fix a bug, TODO find why radio group isnt updating problerly onChange
  onRadioChange = e => {
    e.preventDefault();
    this.setState({ rsvp: e.target.value });
    console.log(this.state);
  };

  // Try to join upon form submit
  onSubmit = e => {
    e.preventDefault();

    // console.log(this.props.auth);
    const userData = {
      id: this.props.auth.user._id,
      eventCode: this.state.eventCode,
      // rsvp: this.state.rsvp
    };
    
    console.log("Userdata")
    console.log(userData);
    
    var thisEvent;
    
    axios.get(`http://localhost:5000/code/${this.state.eventCode}`)
    .then(res => {
        const input = {
          user_id: this.props.auth.user._id,
          event_id: res.data.event[0]._id
        }
        this.props.joinEvent(input, this.props.history)

    })

  };


  render() {
    // const { errors } = this.state;

    return (
      <div>
        <Grid container spacing={24}>
          <Grid item xs={3} />
          <Grid item xs={6}>
            <div className="main">
              <h1 id="mainTitle">Join an Event!</h1>
              <MuiThemeProvider>
                <div className="App">
                  <form noValidate>
                    <br />
                    <TextField
                      name="eventCode"
                      id="eventCode"
                      // className={...}
                      hintText="Event Code"
                      floatingLabelText="EventCode"
                      value={this.state.eventCode}
                      // error={errors.password}
                      onChange={this.onChange}
                      floatingLabelFixed
                    />
                    <br />
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={this.onSubmit}
                    >
                      Confirm
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


JoinEvent.propTypes = {
  joinEvent: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
  // errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
  // errors: state.errors
});

export default connect(
  mapStateToProps,
  { joinEvent }
)(JoinEvent);
