import React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import { connectRemote } from './commonStore';
import constants from '../appConstants.mjs';
import { withStyles } from '@material-ui/core/styles';

const styles = {
	root: {
		display: 'flex',
		flexDirection: 'column'
	},
	container: {
		maxWidth: 300,
		padding: 16
	},
	list: {
		listStyle: 'none',
		float: 'left'
	}
};

class Home extends React.Component {
	constructor(props){
		super(props);
		this.mark = this.mark.bind(this);
		this.addClick = this.addClick.bind(this);
		this.removeClick = this.removeClick.bind(this);
		this.updateTaskName = this.updateTaskName.bind(this);
	}
	componentDidMount() {
		this.props.dLoadState();
	}
	updateTaskName({target}) {
		this.props.dUpdateCurrentTaskName(target.value);
	}
	addClick() {
		this.props.dSubmitTask();
	}
	removeClick() {
		this.props.dRemoveTasks();
	}
	mark({target}) {
		const {completed, dMarkTaskAsCompleted, dMarkTaskAsIncomplete} = this.props;
		const targetVal = Number(target.value);
		const index = completed.indexOf(targetVal);
		if(index === -1) {
			dMarkTaskAsCompleted(targetVal);
		} else {
			dMarkTaskAsIncomplete(targetVal);
		}
	}
	render() {
		const {classes, currentTask, tasks, completed, loadingFlags} = this.props;
		if(loadingFlags && loadingFlags.loaded) {
			return (
				<div className={classes.root}>
					<Typography variant="h1" gutterBottom>ToDo</Typography>
					<ul className={classes.list}>
						{tasks.map((elem, i) => (
							<li key={i}>
								<Checkbox checked={completed.includes(i)} onChange={this.mark} value={i} />
								<Typography display="inline" style={completed.includes(i) ? {textDecoration: 'line-through'} : {}} variant="body1">{elem}</Typography>
							</li>
						))}
					</ul>
					<div className={classes.container}>
						<TextField label="New Task" name="currentTask" value={currentTask} onChange={this.updateTaskName} />
					</div>
					<div className={classes.container}>
						<Button onClick={this.addClick} variant="contained">Add</Button>
						<Button onClick={this.removeClick} variant="contained">Remove completed</Button>
					</div>
				</div>
			);
		} else {
			return 'Wait a sec...'
		}
	}
}

const mapStateToProps = rootState => {
	return {
		loadingFlags: rootState.loadingFlags,
		currentTask: rootState.currentTask,
		tasks: rootState.tasks,
		completed: rootState.completed
	};
};

const mapDispatchToProps = customDispatch => {
	return {
		dUpdateCurrentTaskName: (...args) => customDispatch(constants.ACTIONS.changeTaskName, ...args),
		dSubmitTask: (...args) => customDispatch(constants.ACTIONS.submitTask, ...args),
		dMarkTaskAsCompleted: (...args) => customDispatch(constants.ACTIONS.markComplete, ...args),
		dMarkTaskAsIncomplete: (...args) => customDispatch(constants.ACTIONS.markIncomplete, ...args),
		dLoadState: (...args) => customDispatch(constants.ACTIONS.loadInitialState, ...args),
		dRemoveTasks: (...args) => customDispatch(constants.ACTIONS.removeTasks, ...args)
	};
};

export default connectRemote(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Home));