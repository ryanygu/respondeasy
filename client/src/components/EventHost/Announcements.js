import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import {
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Input,
  Button,
  withStyles
} from "@material-ui/core/";

import { addAnnouncement } from "../../actions/eventActions";

import SingleColumnTable from "../SingleColumnTable";

const styles = theme => ({
  main: {
    width: "auto",
    display: "block", // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  formAdd: {
    marginLeft: "15px",
    width: "96%", // Fix IE 11 issue.
    display: "flex",
    marginTop: theme.spacing.unit
  },
  formRemove: {
    marginLeft: "15px",
    width: "96%", // Fix IE 11 issue.
    display: "flex",
    marginTop: theme.spacing.unit
  },
  submitAdd: {
    width: "50px",
    height: "30px",
    marginLeft: "15px",
    marginTop: theme.spacing.unit * 3,
    backgroundColor: "#e85c5c",
    color: "#ffffff"
  },
  submitRemove: {
    width: "80px",
    height: "30px",
    marginLeft: "15px",
    marginTop: theme.spacing.unit * 3
  }
});

class Announcements extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newAnnouncement: "",
      announcements: [],
      errors: {}
    };
  }

  // If user is logged in, should not be able to navigate to here
  componentDidMount() {
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push("/");
    }

    // Not supposed to mutate state like this but
    // couldn't get it to work otherwise

    // Load announcements
    const event = this.props.events.currEvent;
    // event.announcements.map(e => this.state.announcements.push(e));
    this.setState({
      announcements : event.announcements
    })
    console.log("after mount");
    console.log(this.state);
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

  handleChange = e => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const newA = {
      announcement: this.state.newAnnouncement
    }

    const data = {
      eventId: this.props.events.currEvent._id,
      newA
    };

    console.log("Adding new announcement");
    this.props.addAnnouncement(data);

    //   const id = this.state.id;
    // const text = this.state.newAnnouncement;
    // this.setState({
    // 	id: this.state.id + 1,
    // 	announcements: [...this.state.announcements, {id, text}]
    // });

    // potential bug, check when api is linked
    // const event = this.props.events.currEvent;
    console.log("beofre add");
    console.log(this.state);
    this.state.announcements.push(this.state.newAnnouncement);
    this.setState({});
    console.log("after add");
    console.log(this.state);

    // Add new announcement and update append to this.state.announcements
    
  };

  render() {
    console.log("render");

    const { classes } = this.props;
    // const announcementList = this.state.announcements;
    // const event = this.props.events.currEvent;
    return (
      <React.Fragment>
        <Typography variant="h3" style={{ textAlign: "center" }}>
          Announcements
        </Typography>
        <Grid container spacing={24}>
          <Grid item xs={12} md={12}>
            <SingleColumnTable
              tableName="Current Announcements"
              items={this.state.announcements}
            />
          </Grid>

          <form className={classes.formAdd}>
            <FormControl margin="normal" fullWidth>
              <InputLabel>Post an announcement...</InputLabel>
              <Input
                name="newAnnouncement"
                id="newAnnouncement"
                value={this.state.newAnnouncement}
                onChange={this.handleChange}
                autoFocus
              />
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              className={classes.submitAdd}
              onClick={this.onSubmit}
            >
              Post
            </Button>
          </form>
        </Grid>
      </React.Fragment>
    );
  }
}

Announcements.propTypes = {
  addAnnouncement: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  events: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  events: state.events,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { addAnnouncement }
)(withStyles(styles)(Announcements));
