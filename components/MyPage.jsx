import React from 'react';
import ReactDOM from 'react-dom';

import {Router, Route, IndexRoute, History, hashHistory} from 'react-router';
import HeadRoom from 'react-headroom';

import {Card} from 'material-ui/Card';
import Snackbar from 'material-ui/Snackbar';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import SettingsIcon from 'material-ui/svg-icons/action/settings.js';
import EditorModeIcon from 'material-ui/svg-icons/editor/mode-edit.js';
import StarIcon from 'material-ui/svg-icons/toggle/star';
import CommunicationEmailIcon from 'material-ui/svg-icons/communication/email.js';
import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import {Tabs, Tab} from 'material-ui/Tabs';

import {ThxMessageList} from './ThxMessageList.jsx';
import {RatingStar} from './content.jsx';
import {AvatarGrid} from './avatar.jsx';
import {Tabbar} from './Tabbar.jsx';
import {MenuIcon} from './MenuIcon.jsx';
import {NumberChip} from './NumberChip.jsx';
import {PhotoEditChip} from './PhotoEditChip.jsx';
import {LiveMark} from './LiveMark.jsx';

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
				marginBottom: '3rem',
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
			list: {
				paddingTop:'1px',
				paddingBottom:0
			},
			listItem: {
				fontWeight: 'normal',
			},
			listItemDiv: {
				backgroundColor: window.bgColor2,
				backgroundImage: "url('/cover.jpg')",
				backgroundRepeat: 'no-repeat',
				backgroundSize: 'contain',
				border: '1px solid',
				borderColor: window.bgColor1,
				color: window.textColor1,
				paddingLeft: '130px',
			},
			listItemSecondary: {
				color:window.textColor1,
				fontWeight: 'normal',
			},
			listItemAvatar: {
				marginLeft: '25px',
			},
			tab: {
				fontWeight: 'normal',
				fontSize: '0.8rem',
			},
			mentoringLabelOffer: {
				backgroundColor: '#009688',
				borderRadius: '1rem',
				fontWeight: 'bold',
				display: 'inline-block',
				position: 'absolute',
				top: '75%',
				left: '2.5%',
				fontSize: '0.5rem',
				padding: '0 0.1rem',
				color: 'white',
				width: '3.3rem',
				textAlign: 'center',
				border: '1px solid',
				borderColor: window.textColor1,
				marginLeft: '23px',
			},
			mentoringLabelDecision: {
				backgroundColor: '#558B2F',
				borderRadius: '1rem',
				fontWeight: 'bold',
				display: 'inline-block',
				position: 'absolute',
				top: '75%',
				left: '2.5%',
				fontSize: '0.5rem',
				padding: '0 0.1rem',
				color: 'white',
				width: '3.3rem',
				textAlign: 'center',
				border: '1px solid',
				borderColor: window.textColor1,
				marginLeft: '23px',
			},
			mentoringLabelClose: {
				backgroundColor: '#616161',
				borderRadius: '1rem',
				fontWeight: 'bold',
				display: 'inline-block',
				position: 'absolute',
				top: '75%',
				left: '2.5%',
				fontSize: '0.5rem',
				padding: '0 0.1rem',
				color: 'white',
				width: '3.3rem',
				textAlign: 'center',
				border: '1px solid',
				borderColor: window.textColor1,
				marginLeft: '23px',
			},
			addButton: {
				position: 'fixed',
				bottom: '4rem',
				right: '5%',
			},
		}


		return (
			<section style={styles.root}>
				<Profile
					userId={this.props.params.id}
					cover={this.state.pageUser.cover}
					avatar={this.state.pageUser.avatar}
					username={this.state.pageUser.username}
					countOffer={3}
					countMentor={1}
					countFollower={2}
				/>
				<MenuIcon userId={this.props.params.id} />
				<Tabs
					inkBarStyle={{backgroundColor:window.borderColor1}}
				>
					<Tab
						label="作成したもの (2)"
						style={styles.tab}
					>
						<List
							style={styles.list}
						>
							<ListItem
								style={styles.listItem}
								innerDivStyle={styles.listItemDiv}
								leftAvatar={<Avatar src="/avatar.jpg" style={styles.listItemAvatar} />}
								primaryText="メンタリング名"
								secondaryText={
									<p style={styles.listItemSecondary}>
										<span>Brunch this weekend?</span><br />
										I&apos;ll be in your neighborhood doing errands this weekend. Do you want to grab brunch?
									</p>
								}
								secondaryTextLines={2}
							>
								<div style={styles.mentoringLabelOffer}>オファー中</div>
								<LiveMark />
							</ListItem>
							<ListItem
								style={styles.listItem}
								innerDivStyle={styles.listItemDiv}
								leftAvatar={<Avatar src="/avatar.jpg" style={styles.listItemAvatar} />}
								primaryText="メンタリング名"
								secondaryText={
									<p style={styles.listItemSecondary}>
										<span>Brunch this weekend?</span><br />
										I&apos;ll be in your neighborhood doing errands this weekend. Do you want to grab brunch?
									</p>
								}
								secondaryTextLines={2}
							>
								<div style={styles.mentoringLabelClose}>終了</div>
							</ListItem>
						</List>
					</Tab>
					<Tab
						label="参加するもの (5)"
						style={styles.tab}
					>
						<List
							style={styles.list}
						>
							<ListItem
								style={styles.listItem}
								innerDivStyle={styles.listItemDiv}
								leftAvatar={<Avatar src="http://www.material-ui.com/images/jsa-128.jpg" style={styles.listItemAvatar} />}
								primaryText="メンタリング名"
								secondaryText={
									<p style={styles.listItemSecondary}>
										<span>Brunch this weekend?</span><br />
										I&apos;ll be in your neighborhood doing errands this weekend. Do you want to grab brunch?
									</p>
								}
								secondaryTextLines={2}
							>
								<div style={styles.mentoringLabelOffer}>オファー中</div>
							</ListItem>
							<ListItem
								style={styles.listItem}
								innerDivStyle={styles.listItemDiv}
								leftAvatar={<Avatar src="http://www.material-ui.com/images/jsa-128.jpg" style={styles.listItemAvatar} />}
								primaryText="メンタリング名"
								secondaryText={
									<p style={styles.listItemSecondary}>
										<span>Brunch this weekend?</span><br />
										I&apos;ll be in your neighborhood doing errands this weekend. Do you want to grab brunch?
									</p>
								}
								secondaryTextLines={2}
							>
								<div style={styles.mentoringLabelDecision}>9/2</div>
							</ListItem>
							<ListItem
								style={styles.listItem}
								innerDivStyle={styles.listItemDiv}
								leftAvatar={<Avatar src="http://www.material-ui.com/images/jsa-128.jpg" style={styles.listItemAvatar} />}
								primaryText="メンタリング名"
								secondaryText={
									<p style={styles.listItemSecondary}>
										<span>Brunch this weekend?</span><br />
										I&apos;ll be in your neighborhood doing errands this weekend. Do you want to grab brunch?
									</p>
								}
								secondaryTextLines={2}
							>
								<div style={styles.mentoringLabelClose}>終了</div>
							</ListItem>
							<ListItem
								style={styles.listItem}
								innerDivStyle={styles.listItemDiv}
								leftAvatar={<Avatar src="http://www.material-ui.com/images/jsa-128.jpg" style={styles.listItemAvatar} />}
								primaryText="メンタリング名"
								secondaryText={
									<p style={styles.listItemSecondary}>
										<span>Brunch this weekend?</span><br />
										I&apos;ll be in your neighborhood doing errands this weekend. Do you want to grab brunch?
									</p>
								}
								secondaryTextLines={2}
							>
								<div style={styles.mentoringLabelClose}>終了</div>
							</ListItem>
							<ListItem
								style={styles.listItem}
								innerDivStyle={styles.listItemDiv}
								leftAvatar={<Avatar src="http://www.material-ui.com/images/jsa-128.jpg" style={styles.listItemAvatar} />}
								primaryText="メンタリング名"
								secondaryText={
									<p style={styles.listItemSecondary}>
										<span>Brunch this weekend?</span><br />
										I&apos;ll be in your neighborhood doing errands this weekend. Do you want to grab brunch?
									</p>
								}
								secondaryTextLines={2}
							>
								<div style={styles.mentoringLabelClose}>終了</div>
							</ListItem>
						</List>
				    </Tab>
					<Tab
						label="ブックーマーク (2)"
						style={styles.tab}
					>
						<List
							style={styles.list}
						>
							<ListItem
								style={styles.listItem}
								innerDivStyle={styles.listItemDiv}
								leftAvatar={<Avatar src="http://www.material-ui.com/images/jsa-128.jpg" style={styles.listItemAvatar} />}
								primaryText="メンタリング名"
								secondaryText={
									<p style={styles.listItemSecondary}>
										<span>Brunch this weekend?</span><br />
										I&apos;ll be in your neighborhood doing errands this weekend. Do you want to grab brunch?
									</p>
								}
								secondaryTextLines={2}
							>
								<div style={styles.mentoringLabelOffer}>オファー中</div>
								<LiveMark />
							</ListItem>
							<ListItem
								style={styles.listItem}
								innerDivStyle={styles.listItemDiv}
								leftAvatar={<Avatar src="http://www.material-ui.com/images/jsa-128.jpg" style={styles.listItemAvatar} />}
								primaryText="メンタリング名"
								secondaryText={
									<p style={styles.listItemSecondary}>
										<span>Brunch this weekend?</span><br />
										I&apos;ll be in your neighborhood doing errands this weekend. Do you want to grab brunch?
									</p>
								}
								secondaryTextLines={2}
							>
								<div style={styles.mentoringLabelClose}>終了</div>
							</ListItem>
						</List>
					</Tab>
				</Tabs>

				<Snackbar
					open={this.state.snack.open}
					message={this.state.snack.message}
					autoHideDuration={4000}
					onRequestClose={this.onSnackClose}
				/>
				{(() => {
					if (this.props.params.id == sessionStorage.user.id) {
						return <Tabbar value="mypage" />
					}
				})()}
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

export class Profile extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.onProfileEdit = this.onProfileEdit.bind(this);
		this.onFollow = this.onFollow.bind(this);
		this.onFollower = this.onFollower.bind(this);
		this.onThanx = this.onThanx.bind(this);
		this.onStar = this.onStar.bind(this);
		this.onProfilePhotoEdit = this.onProfilePhotoEdit.bind(this);
		this.onCoverPhotoEdit= this.onCoverPhotoEdit.bind(this);
	}

	onProfileEdit() {
		console.log("onProfileEdit");
	}

	onFollow() {
		console.log("onFollow");
	}

	onFollower() {
		console.log("onFollower");
	}

	onThanx() {
		console.log("onThanx");
	}

	onStar() {
		console.log("onStar");
	}

	onProfilePhotoEdit() {
		this.refs.profilePhotoFileEdit.click();
	}
	onProfilePhotoEditChange(e) {
		console.log("onProfilePhotoEditChange");
	}

	onCoverPhotoEdit() {
		this.refs.coverPhotoFileEdit.click();
	}
	onCoverPhotoEditChange(e) {
		console.log("onCoverPhotoEditChange");
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
				opacity: 0.9,
			},
			username: {
				fontSize: '1.5rem',
				color: 'white',
				fontWeight: 'bolder',
				textShadow: '1px 1px 1px rgba(0,0,0,1)',
				position: 'absolute',
				bottom: '35%',
				left: 0,
				right: 0,
				textAlign: 'center',
			},
			avatar: {
				position: 'absolute',
				left: 0,
				right: 0,
				top: "-5rem",
				bottom: 0,
				margin: 'auto',
				borderRadius: '50%',
				width: '35%'
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
			profileEditButtonWrap: {
				position: 'absolute',
				bottom: '5%',
				right: '25%',
			},
			profileEditButton: {
				border: '1px solid',
				borderColor: window.textColor1,
				display: 'inline-block',
				borderRadius: '1rem',
				color: this.props.color,
				margin: '5px',
				backgroundColor: 'white',
				opacity: 0.6,
				height: '1.5rem',
				lineHeight: '1rem',
				minWidth: 'auto',
				width: '90%',
				zIndex: 10000,
				boxShadow: '1px 1px 1px rgba(0,0,0,1)',
			},
			profileEditButtonIconStyle: {
				width: '1rem',
				height: '1rem',
			},
			followWrap: {
				position: 'absolute',
				bottom: '25%',
				left: 0,
				width: '100%',
				textAlign: 'center',
			},
			follower: {
				fontSize: '0.8rem',
				color: window.textColor1,
				width: '48%',
				float: 'left',
				marginRight: '2%',
				textAlign: 'right',
			},
			follow: {
				fontSize: '0.8rem',
				color: window.textColor1,
				width: '48%',
				float: 'left',
				marginLeft: '2%',
				textAlign: 'left',
			},
			numberChip2Wrap: {
				position: 'absolute',
				bottom: '5%',
				left: 0,
				width: '100%',
				textAlign: 'center',
			},
			profilePhotoEditChipWrap: {
				position: 'absolute',
				width: '100%',
				textAlign: 'center',
				top: '10%',
			},
			coverPhotoEditChipWrap: {
				position: 'absolute',
				top: '0.5rem',
				left: '0.5rem',
			},
			starThanx: {
				backgroundColor: window.textColor1,
				margin: '0.5rem',
				minWidth: 'auto',
				width: '25%',
				borderRadius: '5px',
				opacity: 0.9,
			},
			starThanxIcon: {
				color: window.textColor2,
				opacity: 0.8,
				marginLeft: 0,
			},
			starThanxLabel: {
				color: window.textColor2,
				opacity: 0.8,
				padding: 0,
			},
		};

		return (
			<div style={styles.root}>
				<div style={styles.coverRoot}>
					{(() => {
						if (this.props.userId == sessionStorage.user.id) {
							return (
								<div style={styles.profilePhotoEditChipWrap}>
									<PhotoEditChip name={"編集"} color={window.textColor2} backgroundColor="white" onTouchTap={this.onProfilePhotoEdit} rippleColor={window.bgColor1} />
									<input
										ref="profilePhotoFileEdit"
										type="file" 
										style={{"display": "none"}}
										onChange={this.onProfilePhotoEditChange}
									/>
								</div>
							);
						}
					})()}
					{(() => {
						if (this.props.userId == sessionStorage.user.id) {
							return (
								<div style={styles.coverPhotoEditChipWrap}>
									<PhotoEditChip name={"編集"} color={window.textColor2} backgroundColor="white" onTouchTap={this.onCoverPhotoEdit} rippleColor={window.bgColor1} />
									<input
										ref="coverPhotoFileEdit"
										type="file" 
										style={{"display": "none"}}
										onChange={this.onCoverPhotoEditChange}
									/>
								</div>
							);
						}
					})()}
					<div style={styles.username}>{this.props.username}
					{(() => {
						if (this.props.userId == sessionStorage.user.id) {
							return (
								<div style={styles.profileEditButtonWrap}>
									<FlatButton
										style={styles.profileEditButton}
										icon={<EditorModeIcon style={styles.profileEditButtonIconStyle} />}
										onTouchTap={this.onProfileEdit}
										rippleColor={window.bgColor1}
									/>
								</div>
							);
						}
					})()}
					</div>
					<img style={styles.cover} src={this.props.cover} />
					<img style={styles.avatar} src={this.props.avatar} />
					<div style={styles.followWrap}>
						<div style={styles.follower} onTouchTap={this.onFollower}>フォロワー 124,722</div>
						<div style={styles.follow} onTouchTap={this.onFollow}>フォロー中 133</div>
					</div>
					<div style={styles.numberChip2Wrap}>
						<FlatButton
							style={styles.starThanx}
							label={234}
							icon={<CommunicationEmailIcon style={styles.starThanxIcon} />}
							onTouchTap={this.onThanx}
							rippleColor={window.bgColor1}
							labelStyle={styles.starThanxLabel}
						/>
						<FlatButton
							style={styles.starThanx}
							label="213,234"
							icon={<StarIcon style={styles.starThanxIcon} />}
							onTouchTap={this.onStar}
							rippleColor={window.bgColor1}
							labelStyle={styles.starThanxLabel}
						/>
					</div>
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
	countMentor: React.PropTypes.number.isRequired,
	countFollower: React.PropTypes.number.isRequired,
}
