import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, History, hashHistory} from 'react-router';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import {Card} from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import AppBar from 'material-ui/AppBar';
import Snackbar from 'material-ui/Snackbar';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import PeopleOutline from 'material-ui/svg-icons/social/people-outline';
import LiveTv from 'material-ui/svg-icons/notification/live-tv';

import HeadRoom from 'react-headroom';

import {ThxMessageList} from './message.jsx';
import {RatingStar} from './content.jsx';

export class Avatar extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.onAvatarTap = this.onAvatarTap.bind(this);
	}

	onAvatarTap(e) {
		this.context.router.replace('/mypage/' + this.props.uid);
	}

	render() {
		const styles = {
			avatar: {
				width: '100%',
			},
			name: {
				width: '100%',
				textAlign: 'center',
				fontSize: '0.8rem',
			},
		};

		return (
			<div style={this.props.rootStyle} onTouchTap={this.onAvatarTap}>
				<img style={styles.avatar} src={this.props.avatar} />
				<div style={styles.name}>{this.props.name}</div>
			</div>
		);
	}
};
Avatar.contextTypes = {
	router: React.PropTypes.object.isRequired
}
Avatar.propTypes = {
	uid: React.PropTypes.number.isRequired,
	avatar: React.PropTypes.string.isRequired,
	name: React.PropTypes.string.isRequired,
	rootStyle: React.PropTypes.object.isRequired,
}
Avatar.defaultProps = {
	rootStyle: {
		flexBasis: '90px',
		boxSizing: 'border-box',
	},
}

export class AvatarGrid extends React.Component {
	constructor(props, context) {
		super(props, context);
	}

	render() {
		const styles = {
			root: {
				width: '100%',
				display: 'flex',
				flexFlow: 'row wrap',
				justifyContent: 'space-around',
				alineContent: 'space-around',
			},
			countAvatar: {
				width: '100%',
				fontSize: '0.8rem',
				padding: '8px 0 0 8px',
			},
			gridItem: {
				flexBasis: '90px',
				boxSizing: 'border-box',
			},
			avatar: {
				width: '100%',
			},
			name: {
				width: '100%',
				textAlign: 'center',
				fontSize: '0.8rem',
			},
		};

		return (
			<div style={styles.root}>
				<div style={styles.countAvatar}>メンター{this.props.countAvatar}人</div>
				{this.props.avatars.map((avatar, index) => {
					const key = "avatar_" + avatar.id;
					if (index > 7) {
						return '';
					}
					return (
						<Avatar
							uid={avatar.id}
							avatar={avatar.avatar}
							name={avatar.name}
							key={key}
						/>
					);
				})}
				{(() => {
					const styles = {
						button: {
							width: '96%',
							margin: 'auto',
						},
						label: {
							letterSpacing: '-2px',
							fontSize: '0.8rem',
							fontWeight: 'bold',
						},
					};
					if (this.props.countAvatar > 8) {
						return (
							<FlatButton
								style={styles.button}
								label={'もっと見る'}
								labelStyle={styles.label}
							/>
						);
					}
				})()}
			</div>
		);
	}
};
AvatarGrid.contextTypes = {
	router: React.PropTypes.object.isRequired
}
AvatarGrid.propTypes = {
	avatars: React.PropTypes.array.isRequired,
	countAvatar: React.PropTypes.number.isRequired,
}

