import React, { Component } from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import {
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    Button,
    withStyles, 
} from '@material-ui/core/';

import axios from "axios";

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },
    button: {
        margin: '5px',
    },
});

let id = 0;
function createConfirmedData(name, food, email) {
    id += 1;
    return { id, name, food, email };
}
function createOtherData(name, email) {
    id += 1;
    return { id, name, email };
}

// mockdata
// these will need to be requested from the backend server
const confirmed = [
    createConfirmedData('name1', 'food1', 'name1@example.com'),
    createConfirmedData('name2', 'food2', 'name2@example.com'),
    createConfirmedData('name3', 'food3', 'name3@example.com'),
    createConfirmedData('name4', 'food4', 'name4@example.com'),
];

const pending = [
    createOtherData('name5', 'name5@example.com'),
    createOtherData('name6', 'name6@example.com'),
];

const declined = [
    createOtherData('name7', 'name7@example.com'),
];

class GuestList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            confirmed: [],
            pending: [],
            declined: [],
            user_food: {}
        }
      }

       // If user is logged in, should not be able to navigate to here
  async componentDidMount() {
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push("/");
    }

    // Not supposed to mutate state like this but
    // couldn't get it to work otherwise

    // Load guest lists
    const event = this.props.events.currEvent;

    var pending_array = []
    for (let i = 0; i < event.pendingGuests.length; i++) {
        // Get the user objects at /users/:user_id
        await axios.get(`http://localhost:5000/users/${event.pendingGuests[i]}`)
            .then(res => {
                console.log("One User");
                console.log(res.data.user)
                pending_array.push(res.data.user);
            }).catch(function (error) {
          console.log("Error in fetching market updates");
        });
    }

    var declined_array = []
    for (let i = 0; i < event.declinedGuests.length; i++) {
        // Get the user objects at /users/:user_id
        await axios.get(`http://localhost:5000/users/${event.declinedGuests[i]}`)
            .then(res => {
                console.log("One User");
                console.log(res.data.user)
                declined_array.push(res.data.user);
            }).catch(function (error) {
          console.log("Error in fetching market updates");
        });
    }

    var confirmed_array = []
    for (let i = 0; i < event.confirmedGuests.length; i++) {
        // Get the user objects at /users/:user_id
        await axios.get(`http://localhost:5000/users/${event.confirmedGuests[i]}`)
            .then(res => {
                console.log("One User");
                console.log(res.data.user)
                confirmed_array.push(res.data.user);
            }).catch(function (error) {
          console.log("Error in fetching market updates");
        });
    }

    // Use callback for debugging since setState is async
    this.setState({
        pending: pending_array,
        declined: declined_array,
        confirmed: confirmed_array,
        // user_food: food_list
    }, () => {
        console.log("Done");
        console.log(this.state);
        console.log(event)

        // Get confirmed users food options
        var food_list = {}
        const confirmed = this.state.confirmed
        for (let i = 0; i < this.state.confirmed.length; i++) {
            for (let j = 0; j < this.state.confirmed[i].upcomingEvents.length; j++) {
                if (confirmed[i].upcomingEvents[j].event == this.props.events.currEvent._id){
                    food_list[confirmed[i]._id] = confirmed[i].upcomingEvents[j].food;
                }
            }
        }

        this.setState({
            user_food: food_list
        }, () => {
            console.log("DONE")
            console.log(this.state)
        })
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

  handleChange = e => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  };

    render(){
    const classes = this.props.classes;

    return (
        <div>
            <Typography variant="h3" style={{textAlign: 'center', marginTop:'20px', marginBottom:'5px'}}>Guest List</Typography>
            <Paper className={classes.root}>
                <Typography variant="h4" style={{textAlign: 'center', marginTop:'20px', marginBottom:'5px'}}>Confirmed</Typography>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell >Email</TableCell>
                            <TableCell>Food Choice</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {this.state.confirmed.map(row => {
                        return (
                            <TableRow key={row.id}>
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell >{row.email}</TableCell>
                                <TableCell >{this.props.events.currEvent.foodOptions[this.state.user_food[row._id]]}</TableCell>
                            </TableRow>
                        );
                    })}
                    </TableBody>
                </Table>
            </Paper>

            <Paper className={classes.root}>
                <Typography variant="h4" style={{textAlign: 'center', marginTop:'20px', marginBottom:'5px'}}>Pending</Typography>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell >Email</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {this.state.pending.map(row => {
                        return (
                            <TableRow key={row.id}>
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell >{row.email}</TableCell>
                            </TableRow>
                        );
                    })}
                    </TableBody>
                </Table>
            </Paper>

            <Paper className={classes.root}>
                <Typography variant="h4" style={{textAlign: 'center', marginTop:'20px', marginBottom:'5px'}}>Declined</Typography>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell >Email</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {this.state.declined.map(row => {
                        return (
                            <TableRow key={row.id}>
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell >{row.email}</TableCell>
                            </TableRow>
                        );
                    })}
                    </TableBody>
                </Table>
            </Paper>
        </div>
    );
}
}

GuestList.propTypes = {
    classes: PropTypes.object.isRequired,
};

// export default withStyles(styles)(GuestList);

GuestList.propTypes = {
    a: PropTypes.func.isRequired,
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
//     { addAnnouncement }
  )(withStyles(styles)(GuestList));
  