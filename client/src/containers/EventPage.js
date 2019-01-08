import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import EventPageGuest from './EventPageGuest';
import EventPageHost from './EventPageHost';

import '../styles/form.css';


class EventPage extends Component {

  // If user is logged in, should not be able to navigate to Login
  componentDidMount() {
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push("/");
		}
		// see if this this.props.auth.user._id is the host of the current event
		// this.props.getCurrentEvent();
  }

  render() {
		// const { errors } = this.state;

		if (this.props.events.currEvent === null || this.props.events.currEventType === null) {
			this.props.history.push("/dashboard");
		}

		let whatToRender;
		if (this.props.events.currEventType === "host") {
			console.log("Rendering Host");
			whatToRender = <EventPageHost />
		} else {
			console.log("Rendering Guest");
			whatToRender = <EventPageGuest />
		}

    return (
			<div>
				{whatToRender}
			</div>
    );
  }
}

EventPage.propTypes = {
	events: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  // errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  events: state.events,
  auth: state.auth,
  // errors: state.errors
});

export default connect(
	mapStateToProps, 
)(EventPage);

