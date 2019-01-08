import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Drawer,
    List,
    ListItem,
    CssBaseline,
    withStyles 
} from '@material-ui/core/';

import EventOverview from '../components/EventHost/Overview';
import EventAnnouncements from '../components/EventHost/Announcements';
import EventGuestList from '../components/EventHost/GuestList';


const drawerWidth = 240;

const styles = theme => ({
	root: {
		display: 'flex',
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
	},
	drawerPaper: {
		width: drawerWidth,
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing.unit * 3,
	},
	toolbar: theme.mixins.toolbar,
});

class ClippedDrawer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 'Overview',
        };

        this.handlePageChange = this.handlePageChange.bind(this);
    };
    
    handlePageChange = (e) => {
        const text = e.target.innerText.trim();
		this.setState(state => ({
			currentPage: text,
		}));
	};

  
  render(){
		const { classes } = this.props;
		const selectedPage = this.state.currentPage;

		return (
			<div className={classes.root}>
				<CssBaseline />
				<Drawer
					className={classes.drawer}
					variant="permanent"
					classes={{
						paper: classes.drawerPaper,
					}}
				>
					<div className={classes.toolbar} />
					<List>
						{['Overview', 'Announcements', 'Guest List'].map((text, index) => (
							<ListItem button onClick={this.handlePageChange} key={index}>
							{text}
							</ListItem>
						))}
					</List>
				</Drawer>
				<main className={classes.content}>
					<React.Fragment>
						{getPageContent(selectedPage)}
					</React.Fragment>
				</main>
			</div>
		);
	}        
}

function getPageContent(page) {
	switch (page) {
		case 'Overview':
			return <EventOverview />;
		case 'Announcements':
			return <EventAnnouncements />;
    	case 'Guest List':
			return <EventGuestList />;
		default:
			throw new Error('Unknown page');
	}
}

ClippedDrawer.propTypes = {
  	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ClippedDrawer);