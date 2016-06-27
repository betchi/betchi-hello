import React from 'react';
import {Router, Route, hashHistory, Link} from 'react-router';
import {Card} from 'material-ui/Card';
import Divider from 'material-ui/Divider';

import SwipeableViews from 'react-swipeable-views';

export class ThxMessage extends React.Component {
	constructor(props, context) {
		super(props, context);
	}

	render() {
		const styles = {
			root: {
				width: '100%',
				verticalAlign: 'top',
				padding: '0.5rem 0',
			},
			message: {
				width:  '100%',
				fontSize: '0.9rem',
			},
			avatarBox: {
				float: 'right',
				width: '48px',
				margin: '0 0.5rem 0 0',
				borderRadius: '50%',
			},
			avatar: {
				width: '100%',
			},
			clear: {
				clear: 'both',
			},
		};
		return (
			<div style={styles.root}>
				<div style={styles.avatarBox}>
					<img src={this.props.avatar} style={styles.avatar} />
				</div>
				<div style={styles.message}>{this.props.message}</div>
				<div style={styles.clear} />
			</div>
		);
	}
};
ThxMessage.contextTypes = {
	router: React.PropTypes.object.isRequired
}
ThxMessage.propTypes = {
	message: React.PropTypes.string.isRequired,
	avatar: React.PropTypes.string.isRequired,
}

export class ThxMessageList extends React.Component {
	constructor(props, context) {
		super(props, context);
	}

	render() {
		const styles = {
			root: {
			},
		};
		return (
			<section style={styles.root}>
				{this.props.messages.map((message, index) => {
					//const key = "thx-message_" + message.id;
					const key = "thx-message_" + index;
					return <div key={key}><Divider /><ThxMessage avatar={message.avatar} message={message.message} /></div>
				})}
			</section>
		);
	}
};
ThxMessageList.contextTypes = {
	router: React.PropTypes.object.isRequired
}
ThxMessageList.propTypes = {
	messages: React.PropTypes.array.isRequired,
}

