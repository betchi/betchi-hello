import React from 'react';
import {Router, Route, hashHistory, Link} from 'react-router';

import {Card} from 'material-ui/Card';
import Divider from 'material-ui/Divider';

export class ThxMessage extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.onAvatarTap = this.onAvatarTap.bind(this);
	}

	onAvatarTap(e) {
		this.context.router.push('/mypage/' + this.props.uid);
	}

	render() {
		const styles = {
			root: {
				verticalAlign: 'top',
				padding: '0.5rem 0',
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
			message: {
				fontSize: '0.9rem',
			},
			clear: {
				clear: 'both',
			},
		};
		return (
			<div style={styles.root}>
				<div style={styles.avatarBox} onTouchTap={this.onAvatarTap}>
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
	uid: React.PropTypes.number.isRequired,
	avatar: React.PropTypes.string.isRequired,
	message: React.PropTypes.string.isRequired,
}

export class ThxMessageList extends React.Component {
	constructor(props, context) {
		super(props, context);
	}

	render() {
		const styles = {
			root: {
				display: 'flex',
				flexFlow: 'row wrap',
				justifyContent: 'space-between',
				alignItems: 'flex-start',
			},
			messages: {
				flexBasis: '320px',
				flexGrow: 1,
				color: window.textColor1,
			},
		};
		return (
			<section style={styles.root}>
				{this.props.messages.map((message, index) => {
					const key = "thx-message-list_" + index;
					return (
						<div style={styles.messages} key={key}>
							<Divider />
							<ThxMessage
								uid={message.uid}
								avatar={message.avatar}
								message={message.message}
							/>
						</div>
					);
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

