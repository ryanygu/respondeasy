import React, { Component } from "react";
import { Card, CardContent, Typography, Grid, Button } from "@material-ui/core";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { setCurrentEvent } from "../actions/eventActions";
import "../styles/style.css";

class Event extends Component {
  state = {
    redirect: false
  };

  // componentDidMount() {
  //   this.props.getAllEvents();
  // }

  handleHost = () => {
    const { event } = this.props;
    const type = "host";
    const data = { event, type };
    this.props.setCurrentEvent(data);
    this.setState({ redirect: true });
  };

  handleGuest = () => {
    const { event } = this.props;
    const type = "guest";
    const data = { event, type };
    this.props.setCurrentEvent(data);
    this.setState({ redirect: true });
  };

  render() {
    const { event, type } = this.props;

    if (this.state.redirect) {
      const path = "/event/" + event._id;
      return <Redirect to={path} />;
    }

    let button;

    if (type === "host") {
      button = (
        <Button
          className={"detailButton"}
          variant="outlined"
          color="secondary"
          // href="/event/"
          //component={Link}
          onClick={this.handleHost}
          //to={"/event/" + event._id}
        >
          Edit
        </Button>
      );
    } else {
      button = (
        <Button
          className={"detailButton"}
          variant="outlined"
          color="secondary"
          // href="/event/"
          //component={Link}
          onClick={this.handleGuest}
          //to={"/event/" + event._id}
        >
          Details
        </Button>
      );
    }

    return (
      <Grid container spacing = {24}>
        <Grid item xs = {1}>
        </Grid>
        <Grid item xs = {10}>
          <Card className={"eventCard"}>
            <CardContent>
              
                  <Grid container spacing={24}>
                    <Grid item xs={2}>
                      <Typography color="textSecondary" gutterBottom>
                        A special day for:
                      </Typography>
                    </Grid>
                    <Grid item xs={5}>
                      <h1 className={"marrying"}>
                        {event.groom} & {event.bride}
                      </h1>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography color="textSecondary" gutterBottom>
                        Date:
                      </Typography>
                      <h3>{event.date}</h3>
                      <Typography color="textSecondary" gutterBottom>
                        Location:
                      </Typography>
                      <h3>{event.location}</h3>
                    </Grid>
                    <Grid item xs={2}>
                      {button}
                    </Grid>
                  </Grid>

            </CardContent>
          </Card>
        </Grid>
        <Grid item xs = {1}>
        </Grid>
      </Grid>
    );
  }
}

Event.propTypes = {
  setCurrentEvent: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  events: state.events,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { setCurrentEvent }
)(Event);
