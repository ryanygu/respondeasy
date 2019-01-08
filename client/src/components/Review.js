import React from "react";
import PropTypes from "prop-types";
import { Typography, withStyles } from "@material-ui/core/";

// mock data
// TODO: hook up redux to keep track of user input
// and eventually send it to backend once submitted
const eventData = {
  groom: {
    firstName: "John",
    lastName: "Doe"
  },
  bride: {
    firstName: "Jane",
    lastName: "Doh"
  },
  details: {
    date: "November 9th, 2018",
    from: "3:00pm",
    to: "9:00pm",
    location: "Bahen Center for Information Technology",
    foodChoices: [
      "seared salmon and salad, ",
      "steak and potatoes, ",
      "steamed lobster with butter, ",
      "caesar salad (vegetarian)"
    ]
  }
};

const styles = theme => ({
  main: {
    width: "auto",
    display: "flex", // Fix IE 11 issue.
    align: "center",
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  dialog: {
    textAlign: "center",
    margin: "auto",
    marginBottom: "40px"
  },
  p: {
    textAlign: "center",
    marginTop: "10px"
  }
});

function Review(props) {
  const { classes } = props;
  return (
    <React.Fragment className={classes.main}>
      <Typography className={classes.dialog} variant="h6" gutterBottom>
        Take a look and see if we got everything right!
      </Typography>
      <Typography className={classes.p} variant="body1" gutterBottom>
        <span>
          <strong>Bride and Groom: </strong>
        </span>
        <span>
          {eventData.bride.firstName} and {eventData.groom.firstName}
        </span>
      </Typography>
      <Typography className={classes.p} variant="body1" gutterBottom>
        <span>
          <strong>Date: </strong>
        </span>
        <span>
          {eventData.details.date} ({eventData.details.from} -{" "}
          {eventData.details.to})
        </span>
      </Typography>
      <Typography className={classes.p} variant="body1" gutterBottom>
        <span>
          <strong>Location: </strong>
        </span>
        <span>{eventData.details.location}</span>
      </Typography>
      <Typography className={classes.p} variant="body1" gutterBottom>
        <span>
          <strong>Food Choices: </strong>
        </span>
        {eventData.details.foodChoices.map((food, index) => {
          return <span key={index}>{food}</span>;
        })}
      </Typography>
    </React.Fragment>
  );
}

Review.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Review);
