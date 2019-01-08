import React, { Component } from "react";
import { Button } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import "../styles/rsvp.css";
import PropTypes from "prop-types";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";

import { addToGuestList } from "../actions/eventActions";
import { connect } from "react-redux";



class Rsvp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rsvp: "",
      food: 0
    };
  }

  // If user is logged in, should not be able to navigate to here
  componentDidMount() {
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push("/");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.auth.isAuthenticated) {
      this.props.history.push("/");
    }
  }

  // Update state when form is changed
  onFoodChange = (e) => {
    e.preventDefault();
    this.setState({ food: e.target.value });
  };

  onRsvpChange = (e) => {
    e.preventDefault();
    this.setState({ rsvp: e.target.value });
  };

  // Try to register new user upon form submit
  onSubmit = (e) => {
    e.preventDefault();

    const event = this.props.events.currEvent;
    
    var food_i;
    for (let i = 0; i < event.foodOptions.length; i ++) {
      if (this.state.food == event.foodOptions[i]) {
        food_i = i
      }
    }

    const rsvpChoices = {
      rsvp: (this.state.rsvp === "true") ? true : false,
      food: food_i,
    };

    const data = {
      userId: this.props.auth.user._id,
      eventId: this.props.events.currEvent._id,
      rsvpChoices
    }

    console.log("Trying addToGuestList");
    console.log(data);
    this.props.addToGuestList(data);
  };

  render() {
    const event = this.props.events.currEvent;
    return (
      <div>
        <Grid className={"rsvp"} container spacing={24}>
          <Grid item xs={12}>
            <h1 className={"marryNames"}>
              {event.bride} <span>&</span> {event.groom}
            </h1>
            <h1 className={"rsvpTitle"}>RSVP:</h1>

            <div>
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="rsvp"
                  name="rsvp"
                  value={this.state.rsvp}
                  onChange={this.onRsvpChange}
                  row
                >
                  <FormControlLabel
                    value="true"
                    control={<Radio />}
                    label="Graciously Accepts"
                    labelPlacement="top"
                  />
                  <FormControlLabel
                    value="false"
                    control={<Radio />}
                    label="Regretfully Declines"
                    labelPlacement="top"
                  />
                </RadioGroup>
              </FormControl>
            </div>

            <h3 className={"helpInfo"}>Make your food choices:</h3>
            <div>
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="rsvp"
                  name="rsvp"
                  id="rsvp"
                  value={this.state.food}
                  onChange={this.onFoodChange}
                  row
                >
                  {event.foodOptions.map(f => <FormControlLabel value={f} control={<Radio />} label={f} labalPlacement="top" />) }
                </RadioGroup>
              </FormControl>
            </div>

            <h3 className={"helpInfo"}>Finalize Details:</h3>
            <Button variant="outlined" color="secondary" onClick={this.onSubmit}>
              Confirm
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

Rsvp.propTypes = {
	events: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  addToGuestList: PropTypes.func.isRequired,
  // errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  events: state.events,
  auth: state.auth,
  // errors: state.errors
});

export default connect(
  mapStateToProps, 
  { addToGuestList }
)(Rsvp);
