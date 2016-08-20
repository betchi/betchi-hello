import React from 'react';
import ReactDOM from 'react-dom';

import {Router, Route, IndexRoute, History, hashHistory} from 'react-router';
import HeadRoom from 'react-headroom';

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
import {indigo500, indigo900, blue50} from 'material-ui/styles/colors';

import {ThxMessageList} from './ThxMessageList.jsx';
import {RatingStar} from './content.jsx';
import {AvatarGrid} from './avatar.jsx';
import {Tabbar} from './Tabbar.jsx';

import ActionAndroid from 'material-ui/svg-icons/action/android';

export class Profile extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.onCreateMentoring = this.onCreateMentoring.bind(this);
	}

	onCreateMentoring() {
		this.context.router.push('/mentoring/0/edit');
	}

	render() {
		const styles = {
			root: {
				width: '100%',
			},
			coverRoot: {
				position: 'relative',
				width: '100%',
			},
			cover: {
				width: '100%',
			},
			username: {
				fontSize: '1.5rem',
				color: 'white',
				fontWeight: 'bolder',
				textShadow: '1px 1px 1px rgba(0,0,0,1)',
				position: 'absolute',
				top: '12rem',
				left: 0,
				right: 0,
				textAlign: 'center',
			},
			avatar: {
				position: 'absolute',
				left: 0,
				right: 0,
				top: 0,
				bottom: 0,
				margin: 'auto',
				borderRadius: '50%',
				width: '120px',
			},
			offer: {
				position: 'absolute',
				bottom: '16px',
				left: 0,
				right: 0,
				margin: 'auto',
				width: '14rem',
				color: 'white',
				fontSize: '1rem',
				textShadow: '1px 1px 1px rgba(0,0,0,1)',
				textAlign: 'center',
			},
			starBox: {
				display: 'flex',
				flexFlow: 'row wrap',
				justifyContent: 'space-between',
				alignItems: 'flex-start',
			},
			starRoot: {
				flexGlow: 1,
				boxSizing: 'border-box',
				margin: '0 0 0 8px',
			},
			summuryRoot: {
				flexGrow: 2,
				boxSizing: 'border-box',
				fontSize: '0.8rem',
				lineHeight: '1.6rem',
				textAlign: 'right',
			},
			actionRoot: {
				display: 'flex',
				flexFlow: 'row wrap',
				width: '100%',
				padding: '8px 0',
			},
			action: {
				boxSizing: 'border-box',
				flexGrow: 1,
			},
			actionLabel: {
				letterSpacing: '-2px',
				fontSize: '0.8rem',
				fontWeight: 'bold',
			},
			actionBlock: {
				height: '5rem',
				width: '100%',
				zIndex: '1000',
				overflowX: 'auto',
				overflowY: 'hidden',
				textAlign: 'center',
				justifyContent: 'space-between',
				display: 'flex',
				alignItems: 'flex-start',
			},
			actionBlockItem: {
				width: '100%',
				height: '5rem',
				display: 'block',
				whiteSpace: 'normal',
				color: window.textColor1,
				margin: '0',
				border: '1px solid',
				borderColor: window.borderColor2,
			},
			actionBlockLabelStyle: {
				fontSize: '0.7rem',
				display: 'block',
				padding: 0,
				margin: 0,
			},
			largeIcon: {
				width: '2.2rem',
				height: '2.2rem',
				position: 'relative',
				top: '-0.4rem',
				left: '-0.7rem',
				margin: '0',
			},
			listItem: {
				height: '3rem',
				width: '100%',
				zIndex: '1000',
				overflowX: 'auto',
				overflowY: 'hidden',
				textAlign: 'center',
				justifyContent: 'space-between',
				display: 'flex',
				alignItems: 'flex-start',
			},
		};

		const iconColor = blue50

		return (
			<div style={styles.root}>
				<div style={styles.coverRoot}>
					<img style={styles.cover} src={this.props.cover} />
					<img style={styles.avatar} src={this.props.avatar} />
					<div style={styles.username}>{this.props.username}</div>
					<div style={styles.offer}>フォロー 1234&nbsp;フォロワー {this.props.countOffer}</div>
				</div>
				<div style={styles.actionBlock}>
					<FlatButton
						icon={<IconButton style={{margin:'0'}} iconStyle={styles.largeIcon}><PeopleOutline style={{margin:'0'}} color={iconColor} /></IconButton>}
						style={styles.actionBlockItem}
						value={1}
						ref="tab1"
						label={'メンタリングをする'}
						labelStyle={styles.actionBlockLabelStyle}
						onTouchTap={this.onCreateMentoring}
					/>
					<FlatButton
						icon={<IconButton iconStyle={styles.largeIcon}><LiveTv color={iconColor} /></IconButton>}
						style={styles.actionBlockItem}
						value={1}
						ref="tab1"
						label={'メンターライブをする'}
						labelStyle={styles.actionBlockLabelStyle}
						onTouchTap={this.onCreateMentoring}
					/>
				</div>
				<div style={styles.actionBlock}>
					<FlatButton
						icon={<IconButton iconStyle={styles.largeIcon}><LiveTv color={iconColor} /></IconButton>}
						style={styles.actionBlockItem}
						value={1}
						ref="tab1"
						label={'フォロー'}
						labelStyle={styles.actionBlockLabelStyle}
						onTouchTap={this.onCreateMentoring}
					/>
					<FlatButton
						icon={<IconButton iconStyle={styles.largeIcon}><LiveTv color={iconColor} /></IconButton>}
						style={styles.actionBlockItem}
						value={1}
						ref="tab1"
						label={'フォロワー'}
						labelStyle={styles.actionBlockLabelStyle}
						onTouchTap={this.onCreateMentoring}
					/>
					<FlatButton
						icon={<IconButton iconStyle={styles.largeIcon}><LiveTv color={iconColor} /></IconButton>}
						style={styles.actionBlockItem}
						value={1}
						ref="tab1"
						label={'オファー'}
						labelStyle={styles.actionBlockLabelStyle}
						onTouchTap={this.onCreateMentoring}
					/>
				</div>
			</div>
		);
	}
};
Profile.contextTypes = {
	router: React.PropTypes.object.isRequired
}
Profile.propTypes = {
	cover: React.PropTypes.string.isRequired,
	avatar: React.PropTypes.string.isRequired,
	countOffer: React.PropTypes.number.isRequired,
	star: React.PropTypes.number.isRequired,
	countMentor: React.PropTypes.number.isRequired,
	countFollower: React.PropTypes.number.isRequired,
}

export class MyPage extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			messages: [],
			followers: [],
			pageUser: {
				cover: '',
				avatar: '',
				star: 0,
				mentors: [],
				followers: [],
			},
			avatars: [],
			snack: {
				open: false,
				message: '',
			},
			refreshStyle: {
				position: 'relative',
				display: 'inline-block',
			},
			page: 1,
		};
		this.onSnackClose = this.onSnackClose.bind(this);
		this.loadContents = this.loadContents.bind(this);
		this.loadMessages = this.loadMessages.bind(this);
		this.onScroll = this.onScroll.bind(this);
		this.onBack = this.onBack.bind(this);
		this.onFollow = this.onFollow.bind(this);
		this.onOffer = this.onOffer.bind(this);
	}

	componentDidMount() {
		this.loadContents(this.props.params.id);
		this.loadMessages(this.props.params.id);
	}

	componentWillReceiveProps(nextProps) {
		window.removeEventListener('scroll', this.onScroll);
		this.loadMessages(nextProps.params.id);
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.onScroll);
	}

	onBack(e) {
		this.context.router.goBack();
	}

	onFollow(e) {
	}

	onOffer(e) {
		alert('offer');
	}

	onSnackClose(e) {
		this.setState({
			snack: {
				open: false,
				message: '',
			}
		})
	}

	onScroll(e) {
		let body = window.document.body;
		let html = window.document.documentElement;
		let scrollTop = body.scrollTop || html.scrollTop;
		let bottom = html.scrollHeight - html.clientHeight - scrollTop;
		if (bottom <= 60) {
			window.removeEventListener('scroll', this.onScroll);
			this.loadMessages(this.props.params.id, this.state.page + 1);
		}
	}

	loadContents(id = 1) {
		let xhr = new XMLHttpRequest();
		xhr.open('GET', '/api/user/' + id);
		xhr.onload = () => {
			if (xhr.status !== 200) {
				this.setState({
					snack: {
						open: true,
						message: '通信に失敗しました。',
					},
					refreshStyle: {
						display: 'none',
					},
				});
				return;
			}
			let data = JSON.parse(xhr.responseText);
			this.setState({
				pageUser: data.user,
			});
		}
		xhr.send();
	}

	loadMessages(id = 1, page = 1) {
		let xhr = new XMLHttpRequest();
		xhr.open('GET', '/thxmessage_' + id + '.json?p=' + page);
		xhr.onload = () => {
			if (xhr.status !== 200) {
				this.setState({
					snack: {
						open: true,
						message: '通信に失敗しました。',
					},
					refreshStyle: {
						display: 'none',
					},
				});
				return;
			}
			let messages = [];
			let data = JSON.parse(xhr.responseText);
			if (page === 1) {
				messages = data;
			} else {
				messages = this.state.messages.slice();
				for (var ii in data) {
					messages.push(data[ii]);
				}
			}
			this.setState({
				messages: messages,
			});
			this.state.page = page;

			if (messages.length == 0) {
				this.setState({
					snack: {
						open: true,
						message: '検索ヒット0件です。',
					},
					refreshStyle: {
						display: 'none',
					},
				});
				return;
			}
			if (page === 1) {
				window.scrollTo(0,0);
			}
			window.addEventListener('scroll', this.onScroll);
		}
		this.setState({
			refreshStyle: {
				position: 'relative',
				display: 'inline-block',
			},
		});
		xhr.send();
	}

	render() {
		const styles = {
			root: {
			},
			headroom: {
				WebkitTransition: 'all .3s ease-in-out',
				MozTransition: 'all .3s ease-in-out',
				OTransition: 'all .3s ease-in-out',
				transition: 'all .3s ease-in-out',
			},
			title: {
				fontSize: '1.2rem',
				textAlign: 'center',
			},
			refreshBox: {
				position: 'relative',
				margin: '16px 0',
				padding: '0 0 43px 0',
				width: '100%',
			},
			refreshMargin: {
				width: '40px',
				margin: 'auto',
			},
		}

		return (
			<section style={styles.root}>
				<Profile
					cover={this.state.pageUser.cover}
					avatar={this.state.pageUser.avatar}
					username={this.state.pageUser.username}
					countOffer={3}
					star={this.state.pageUser.star}
					countMentor={this.state.pageUser.mentors.length}
					countFollower={this.state.pageUser.followers.length}
				/>
				<AvatarGrid
					avatars={this.state.avatars}
					countAvatar={0}
				/>
				<Snackbar
					open={this.state.snack.open}
					message={this.state.snack.message}
					autoHideDuration={4000}
					onRequestClose={this.onSnackClose}
				/>
				<Tabbar value="mypage" />
			</section>
		);
	}
}
MyPage.contextTypes = {
	router: React.PropTypes.object.isRequired
}
MyPage.propTypes = {
	params: React.PropTypes.object.isRequired
}

