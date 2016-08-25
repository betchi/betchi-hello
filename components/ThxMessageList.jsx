import React from 'react';
import {Router, Route, hashHistory, Link} from 'react-router';

import Avatar from 'material-ui/Avatar';

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
				width: '100%',
				marginBottom: '3rem',
			},
			messages: {
				flexBasis: '320px',
				flexGrow: 1,
				color: window.textColor1,
				padding: '0 0.3rem 0 0.5rem',
			},
			title: {
				fontSize: '1rem',
				fontWeight: 'normal',
				width: '100%',
				backgroundColor: window.bgColor2,
				color: window.textColor1,
				textAlign: 'center',
				letterSpacing: '0.2rem',
				margin: 0,
			},
		};
		return (
			<section style={styles.root}>
				<h1 style={styles.title}>お礼メッセージ (21)</h1>
				{this.props.messages.map((message, index) => {
					const key = "thx-message-list_" + index;
					return (
						<div style={styles.messages} key={key}>
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
				float: 'left',
				width: '48px',
				margin: '0 0.5rem 0 0',
				borderRadius: '50%',
			},
			avatar: {
				width: '100%',
			},
			message: {
				fontSize: '0.9rem',
				margin: '-50px 0 0 50px',
			},
			clear: {
				clear: 'both',
			},
		};
		return (
			<div style={styles.root}>
				<Avatar src={this.props.avatar} onTouchTap={this.onAvatarTap} />
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
