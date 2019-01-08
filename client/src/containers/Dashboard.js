import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Grid from "@material-ui/core/Grid";
import "../styles/dashboard.css";
import Event from "../components/Event";
import { getAllEvents } from "../actions/eventActions";

import axios from "axios";

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      upcomingEvents: [],
      myEvents: []
    }
  }

  // If user is logged in, should not be able to navigate to Login
  async componentDidMount() {
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push("/");
    }

    // Get all upcoming events
    var event_array = [];
    for (let i = 0; i < this.props.auth.user.upcomingEvents.length; i++) {
      await axios.get(`http://localhost:5000/events/${this.props.auth.user.upcomingEvents[i].event}`)
        .then(res => {
          const current_event = res.data.event;
          event_array.push(current_event);
        }).catch(function (error) {
          console.log("Error in fetching upcoming events");
      });
    }
    this.setState({ upcomingEvents: event_array })

    // Get all upcoming events
    var my_array = [];
    console.log("HEre");
    console.log(this.props.auth.user.myEvents.length);
    for (let i = 0; i < this.props.auth.user.myEvents.length; i++) {
      await axios.get(`http://localhost:5000/events/${this.props.auth.user.myEvents[i]}`)
        .then(res => {
          const current_event = res.data.event;
          my_array.push(current_event);
        }).catch(function (error) {
          console.log("Error in fetching my events");
      });
    }
    this.setState({ myEvents: my_array })
  }

  render() {
    return (
      <div id="dashboard">
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <h1 className={"mainTitle"}>
              <span>Event</span> Dashboard
            </h1>
            <br />
            <h1 className={"subTitle"}>Upcoming Events</h1>
            {(this.state.upcomingEvents.length) 
              ? this.state.upcomingEvents.map(e => <Event event={e} type="guest" />) 
              : "You don't have any upcoming events. Join one!"}
            <h1 className={"subTitle"}>My Events</h1>
            {(this.state.myEvents.length) 
              ? this.state.myEvents.map(e => <Event event={e} type="host" />) 
              : "You're not hosting any events. Create one!"}
          </Grid>
          <Grid item xs={1} />
        </Grid>
      </div>
    );
  }
}

Dashboard.propTypes = {
  // getEvent: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  events: state.events,
  auth: state.auth
});

export default connect(
  mapStateToProps
  // { getEvent }
)(Dashboard);
