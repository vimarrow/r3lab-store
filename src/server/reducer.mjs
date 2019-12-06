import initialState from './initialState.mjs';
import immer from 'immer';
import constants from '../appConstants.mjs';

const STATUS = {
	success: '_SUCCEEDED',
	failed: '_FAILED'
}

function reducer(state = initialState, {type, payload, ws}) {
	let status = STATUS.success;
	const alteredState = immer.produce(state, draft => {
		switch (type) {
			case constants.ACTIONS.loadInitialState: //noop
				return;
			case constants.ACTIONS.changeTaskName:
				draft.currentTask = payload;
				return;
			case constants.ACTIONS.submitTask:
				draft.tasks.push(draft.currentTask);
				draft.currentTask = '';
				return;
			case constants.ACTIONS.markComplete:
				draft.completed.push(payload);
				return;
			case constants.ACTIONS.markIncomplete:
				const index = draft.completed.indexOf(payload);
				draft.completed.splice(index, 1);
				return;
			default:
				return state;
		}
	});
	if(ws && typeof ws === 'object') {
		ws.send(JSON.stringify({type: type + status, payload: alteredState}));
	}
	return alteredState;
}

export default reducer;