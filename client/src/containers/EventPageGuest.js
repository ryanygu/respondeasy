import React, { Component } from "react";
import "../styles/EventPage.css";
import { Grid, Button } from "@material-ui/core";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Rsvp from "./Rsvp";
import { Link } from "react-router-dom";

class EventPageGuest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {}
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

    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

  render() {
    // const { errors } = this.state;
    const event = this.props.events.currEvent;
    const user = this.props.auth.user;

    const posts = event.announcements.map((post, index) => (
      <Post key={index} value={post} />
    ));

    console.log(event);

    let rsvpButton;

    // Only show rsvp if pending
    // else if confirmed/declined, dont show
    console.log()
    if (!event.confirmedGuests.includes(user._id) || !event.declindedGuests.includes(user._id)) {
      rsvpButton =
      <Button
        className="butonn"
        variant="outlined"
        color="secondary"
        component={Link}
        to="/rsvp"
      >
        Rsvp
      </Button>;
    }

    return (
      <div>
        <Grid container spacing={24}>
          <Grid item xs={6}>
            <div id="card">
              <p className="description">
                Join us as we celebrate the wedding of
              </p>
              <h2 id="names">
                {event.bride} & {event.groom}
              </h2>
              <p className="description">
                <span>{event.date}</span> <br />
                <br />
                <span>{event.location}</span>
                <br />
                <div className="buttons">{rsvpButton}</div>
              </p>
            </div>
          </Grid>
          <Grid item xs={6}>
            <div id="announcements">
              <h1 className="announcements">Announcements</h1>
              {/* <Feed /> */}
              <div id="feed">{posts}</div>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

// class Feed extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       posts: [
//         {
//           content:
//             "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
//         },
//         {
//           content:
//             "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
//         },
//         {
//           content:
//             "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
//         },
//         {
//           content:
//             "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
//         }
//       ]
//     };
//   }
//   render() {
//     const posts = this.state.posts.map((post, index) => (
//       <Post key={index} value={post} />
//     ));
//     return <div id="feed">{posts}</div>;
//   }
// }

class Post extends React.Component {
  render() {
    return (
      <div className="post">
        {this.props.value}
        {/* <span className="content">{this.props.value.content}</span> */}
      </div>
    );
  }
}

EventPageGuest.propTypes = {
  auth: PropTypes.object.isRequired,
  events: PropTypes.object.isRequired
  // errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  events: state.events
  // errors: state.errors
});

export default connect(mapStateToProps)(EventPageGuest);
