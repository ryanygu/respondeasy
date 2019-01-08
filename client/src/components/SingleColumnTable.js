import React from 'react';
import PropTypes from 'prop-types';
import { 
    withStyles, 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableRow, 
    Paper, 
} from '@material-ui/core/';

const styles = theme => ({
	root: {
		width: '100%',
		marginTop: theme.spacing.unit * 3,
		overflowX: 'auto',
	},
	table: {
		minWidth: 700,
	},
});

function SingleColumnTable(props) {
	const { classes, tableName, items } = props;

	return (
		<Paper className={classes.root}>
			<Table className={classes.table}>
				<TableHead>
					<TableRow>
						<TableCell>{tableName}</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
				{items.map(item => {
					return (
						<TableRow key={item[0]}>
							<TableCell key={item[0]} component="th" scope="row">
								{(typeof item == 'string') ? item : item[1]}
							</TableCell>
						</TableRow>
					);
				})}
				</TableBody>
			</Table>
		</Paper>
	);
}

SingleColumnTable.propTypes = {
  	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SingleColumnTable);