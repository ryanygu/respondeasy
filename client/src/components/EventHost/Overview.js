import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  Typography,
  Grid,
  TextField,
  Paper,
  Button,
  withStyles,
  FormControl,
  Input,
  InputLabel
} from "@material-ui/core/";

import { updateEvent } from "../../actions/eventActions";
import SingleColumnTable from "../SingleColumnTable";

// TODO: keep track of TimePicker (from, to) using state
// TODO: add food list to overview
// TODO: popup for submit

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
    // marginTop: theme.spacing.unit * 8,
    display: "flex",
    flexDirection: "column",
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
    marginTop: theme.spacing.unit * 3
  },
  submitRemove: {
    width: "80px",
    height: "30px",
    marginLeft: "15px",
    marginTop: theme.spacing.unit * 3
  },
  button: {
    display: "flex",
    justifyContent: "flex-end",
    float: "right",
    backgroundColor: "#e85c5c",
    color: "#ffffff"
  }
});

class Overview extends Component {
  constructor(props) {
    super(props);

    this.state = {
		id: 0,
      groom: "John Doe",
      bride: "Jane Doe",
      date: "November 9th, 2018",
	  location: "Bahen Center for Information Technology",
	  foodOptions: [],
	  newFood: "",
	  code: "123456",
      errors: {}
    };
  }

  // If user is logged in, should not be able to navigate to here
  componentDidMount() {
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push("/");
    }

    const event = this.props.events.currEvent;
    this.setState({
      code: event.code,
      bride: event.bride,
      groom: event.groom,
      date: event.date,
	  location: event.location,
	  foodOptions: event.foodOptions,
	  code: event.code
    });
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

  onFoodChange = e => {
    e.preventDefault();
    this.setState({ newFood: e.target.value });
  };

  onAddFood = e => {
    e.preventDefault();

    const id = this.state.id;
    const text = this.state.newFood;
    this.state.foodOptions.push(text);
    this.setState({
	  id: id + 1,
	  foodoptions: [this.state.foodOptions, text]
    });
  };

  handleChange = e => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const updatedData = {
      code: this.state.code,
      bride: this.state.bride,
      groom: this.state.groom,
      date: this.state.date,
	  location: this.state.location,
	  foodOptions: this.state.foodOptions
      // time, address
    };

    const data = {
      eventId: this.props.events.currEvent._id,
      updatedData
    };

    console.log("Updating event info");
    this.props.updateEvent(data);
  };

  render() {
    const { classes } = this.props;
    // const { errors } = this.state;
    // const data = this.state;
	const event = this.props.events.currEvent;
	
	console.log("HELLOOOOOOOOOO")
	console.log(this.state.foodOptions);

    return (
      <React.Fragment>
        <Paper className={classes.paper}>
          <form onSubmit={this.handleFormSubmit}>
            <Typography
              style={{ textAlign: "center" }}
              variant="h3"
              gutterBottom
            >
              Overview
            </Typography>
            <Typography
              style={{ textAlign: "center" }}
              variant="h6"
              gutterBottom
            >
              Event Code: {event.code}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Bride & Groom
            </Typography>
            <Grid container spacing={24}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="bride"
                  name="bride"
                  label="Bride's name"
                  value={this.state.bride}
                  onChange={this.handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="groom"
                  name="groom"
                  label="Groom's name"
                  value={this.state.groom}
                  onChange={this.handleChange}
                  fullWidth
                />
              </Grid>
            </Grid>
            <h1> </h1> {/* for spacing purposes, kinda cheating */}
            <Typography variant="h6" gutterBottom>
              Date & Location
            </Typography>
            <Grid container spacing={24}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="date"
                  name="date"
                  label="Date"
                  value={this.state.date}
                  onChange={this.handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="location"
                  name="location"
                  label="Location"
                  value={this.state.location}
                  onChange={this.handleChange}
                  fullWidth
                />
              </Grid>
            </Grid>
            <h1> </h1> {/* for spacing purposes, kinda cheating */}
            <Typography variant="h6" gutterBottom>
              Food Options
            </Typography>
            <Grid container spacing={24}>
              <Grid container spacing={24}>
                <Grid item xs={12} md={12}>
                  <SingleColumnTable
                    tableName="Food Options"
                    items={this.state.foodOptions}
                  />
                </Grid>

                <form className={classes.formAdd}>
                  <FormControl margin="normal" fullWidth>
                    <InputLabel>Add food option...</InputLabel>
                    <Input
                      name="newFoodInput"
                      value={this.state.newFood}
                      onChange={this.onFoodChange}
                      autoFocus
                    />
                  </FormControl>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    className={classes.submitAdd}
                    onClick={this.onAddFood}
                  >
                    Add
                  </Button>
                </form>
              </Grid>
            </Grid>
            <Button className={classes.button} onClick={this.onSubmit} primary>
              Save
            </Button>
          </form>
        </Paper>
      </React.Fragment>
    );
  }
}
Overview.propTypes = {
  updateEvent: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  events: PropTypes.object.isRequired,
  // errors: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  events: state.events,
  // errors: state.errors
});

export default connect(
  mapStateToProps,
  { updateEvent }
)(withStyles(styles)(Overview));