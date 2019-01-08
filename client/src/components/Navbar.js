import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Menu,
  MenuItem,
  withStyles
} from "@material-ui/core";
import { AccountCircle } from "@material-ui/icons/";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

import MyTheme from "../styles/MyTheme.js";
import "../styles/style.css";

import { logoutUser } from "../actions/authActions";

const styles = theme => ({
  main: {
    marginBottom: "75px"
  },
  root: {
    flexGrow: 1,
    backgroundColor: "#e85c5c",
    zIndex: theme.zIndex.drawer + 1
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
});

class Navbar extends Component {
	state = {
		anchorEl: null,
	};

	handleMenu = event => {
		this.setState({ anchorEl: event.currentTarget });
	};

	handleClose = () => {
		this.setState({ anchorEl: null });
	};

	handleLogOut = () => {
		this.setState({ anchorEl: null });
		this.props.logoutUser();
	};

	render() {
		const { classes, currentUser } = this.props;
		const { anchorEl } = this.state;
		const open = Boolean(anchorEl);
		let whatToDisplay;

		if (!this.props.auth.isAuthenticated) {
			whatToDisplay =
				<Toolbar>
					<Button color="inherit" className="logoTitle" href="/">Respondez</Button>
					<Typography color="inherit" className={classes.grow}></Typography> 
					<Button color="inherit" href="/login">Login</Button>
				</Toolbar>
		} else {
			whatToDisplay =
				<Toolbar>
					<Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
					<Typography color="inherit" className={classes.grow}></Typography>
					<Button color="inherit" component={Link} to="/join">Join</Button>
					<Button color="inherit" component={Link} to="/create">Create</Button>
					<div>
						<IconButton
							aria-owns={open ? 'menu-appbar' : undefined}
							aria-haspopup="true"
							onClick={this.handleMenu}
							color="inherit"
						>
							<AccountCircle />
						</IconButton>
						<Menu
							id="menu-appbar"
							anchorEl={anchorEl}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							open={open}
							onClose={this.handleClose}
						>
							<MenuItem component={Link} to="/editprofile" onClick={this.handleClose}>Edit Profile</MenuItem>
							<MenuItem component={Link} to="/" onClick={this.handleLogOut}>Log Out</MenuItem>
						</Menu>
					</div>
					<Typography color="inherit">{this.props.auth.user.name}</Typography>
				</Toolbar>
		}

		return (
			<MuiThemeProvider theme={MyTheme}>
				<div className={classes.main}>
					<AppBar className={classes.root} position="fixed">
						{whatToDisplay}
					</AppBar>
				</div>
			</MuiThemeProvider>
		);
  	}
}

Navbar.propTypes = {
	classes: PropTypes.object.isRequired,
	logoutUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	events: state.events,
	auth: state.auth
  });

export default connect(
  mapStateToProps,
  { logoutUser }
)(withStyles(styles)(Navbar));

