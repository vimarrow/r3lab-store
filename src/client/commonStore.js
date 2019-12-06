import React from 'react';

const webSocket = new WebSocket('ws://localhost:3030');

function commonDispatch(action, payload) {
	console.log('Sent:\n',{type: action, payload});
	const iId = setInterval(() => {
		if(webSocket.readyState === 1) {
			try {
				webSocket.send(JSON.stringify({type: action, payload}));
			} catch(err) {
				console.log({type: action + '_FAILED'});
				console.log(err);
			}
			clearInterval(iId);
		} else if(webSocket.readyState > 1) {
			console.log({type: action + '_FAILED'});
			console.log(`Socket is in state: ${webSocket.readyState}`);
			clearInterval(iId);
		}
	}, 0);
}

export const connectRemote = (mapStateToProps, mapDispatchToProps) => Component => {
	const newPropsFromActions = mapDispatchToProps(commonDispatch);
	const derivedProps = mapStateToProps({});
	class WithProps extends React.Component {
		constructor(props) {
			super(props);
			this.state = derivedProps;
			this.processIncomingAction = this.processIncomingAction.bind(this);
		}
		processIncomingAction(ev) {
			if(ev.type === 'message') {
				const data = JSON.parse(ev.data);
				console.log('Received:\n', data);
				this.setState(data.payload);
			}
		}
		componentDidMount() {
			webSocket.addEventListener('message', this.processIncomingAction);
		}
		componentWillUnmount() {
			webSocket.removeEventListener('message', this.processIncomingAction)
		}
		render() {
			return <Component {...this.state} {...newPropsFromActions} {...this.props} />;
		}
	}
	return WithProps;
};