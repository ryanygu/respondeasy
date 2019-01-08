import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  withStyles,
  CssBaseline,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Grid,
  TextField,
  FormControl,
  Input,
  InputLabel
} from "@material-ui/core/";

import Review from "../components/Review";

import { createEvent } from "../actions/eventActions";
import SingleColumnTable from "../components/SingleColumnTable";

const styles = theme => ({
  appBar: {
    position: "relative"
  },
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
  layout: {
    width: "auto",
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    [theme.breakpoints.up(600 + theme.spacing.unit * 2 * 2)]: {
      width: 600,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
      marginTop: theme.spacing.unit * 6,
      marginBottom: theme.spacing.unit * 6,
      padding: theme.spacing.unit * 3
    }
  },
  stepper: {
    padding: `${theme.spacing.unit * 3}px 0 ${theme.spacing.unit * 5}px`
  },
  iconContainer: {
    color: "#e85c5c"
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end"
  },
  button: {
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit,
    backgroundColor: "#e85c5c",
    color: "#ffffff"
  },
  confirmButton: {
    align: "center",
    textAlign: "center",
    position: "center",
    justifyContent: "center",
    margin: "auto"
  },
  centered: {
    textAlign: "center",
    margin: "auto",
    marginBottom: "20px"
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
  }
});

class CreateEvent extends Component {
  constructor() {
    super();
    this.state = {
      id: 0,
      bride: "",
      groom: "",
      date: "",
      location: "",
      foodOptions: [],
      newFood: ""
    };
  }

  componentDidMount() {
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push("/");
    }
  }

  onSubmit = () => {
    const convertedFoodOptions = [];
    this.state.foodOptions.map(f => {
      convertedFoodOptions.push(f[1]);
    });

    const eventData = {
      bride: this.state.bride,
      groom: this.state.groom,
      date: this.state.date,
      location: this.state.location,
      foodOptions: convertedFoodOptions, 
      code: this.state.bride+this.state.groom+this.state.location

    };
 
    this.props.createEvent(eventData, this.props.auth.user, this.props.history);
  };

  onChange = e => {
    e.preventDefault();
    this.setState({ [e.target.id]: e.target.value });
  };

  onFoodChange = e => {
    e.preventDefault();
    this.setState({ newFood: e.target.value });
  };

  onAddFood = e => {
    e.preventDefault();

    const id = this.state.id;
    const text = this.state.newFood;
    this.state.foodOptions.push([id, text]);
    this.setState({
      id: id + 1
    });
  };

  render() {
    const { classes } = this.props;
    const newEvent = this.props.events.createEvent;

    return (
      <React.Fragment>
        <CssBaseline />
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Typography component="h1" variant="h4" align="center">
              Event Creation
            </Typography>
            <React.Fragment>
              <Typography variant="h6" gutterBottom>
                Bride & Groom
              </Typography>
              <Grid container spacing={24}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    id="bride"
                    name="bride"
                    label="Bride"
                    fullWidth
                    value={this.state.bride}
                    onChange={this.onChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    id="groom"
                    name="groom"
                    label="Groom"
                    fullWidth
                    value={this.state.groom}
                    onChange={this.onChange}
                  />
                </Grid>
              </Grid>
              <h1> </h1> {/* for spacing purposes, kinda cheating */}
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
                    fullWidth
                    value={this.state.date}
                    onChange={this.onChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    id="location"
                    name="location"
                    label="Location"
                    fullWidth
                    value={this.state.location}
                    onChange={this.onChange}
                  />
                </Grid>
              </Grid>
              <h1> </h1> {/* for spacing purposes, kinda cheating */}
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
              <Button
                variant="contained"
                color="primary"
                onClick={this.onSubmit}
                className={classes.button}
              >
                Create
              </Button>
            </React.Fragment>
          </Paper>
        </main>
      </React.Fragment>
    );
  }
}

CreateEvent.propTypes = {
  classes: PropTypes.object.isRequired,
  createEvent: PropTypes.func.isRequired
  // 	auth: PropTypes.object.isRequired,
  // 	errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  events: state.events
  // errors: state.errors
});

export default connect(
  mapStateToProps,
  { createEvent }
)(withStyles(styles)(CreateEvent));
