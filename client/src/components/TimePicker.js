import React from 'react';
import PropTypes from 'prop-types';
import { TextField, withStyles } from '@material-ui/core/';

const styles = theme => ({
	container: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	textField: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		width: 200,
	},
});

function TimePickers(props) {
  	const { classes, name, time } = props;

	return (
		<form className={classes.container} noValidate>
			<TextField
				id="time"
				label={name}
				type="time"
				defaultValue={time}
				className={classes.textField}
				InputLabelProps={{
					shrink: true,
				}}
				inputProps={{
					step: 300, // 5 min
				}}
			/>
		</form>
	);
}

TimePickers.propTypes = {
  	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TimePickers);