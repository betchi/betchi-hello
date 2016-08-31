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
import ExitToAppIcon from 'material-ui/svg-icons/action/exit-to-app.js';
import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import {Tabs, Tab} from 'material-ui/Tabs';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

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
				cover: '/assets/img/defaultCover.png',
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
				backgroundImage: "url('/cover.jpg')",
				backgroundRepeat: 'no-repeat',
				backgroundSize: 'contain',
				borderBottom: '1px solid ' + this.context.colors.lightGrey,
				paddingLeft: '130px',
			},
			listItemSecondary: {
				fontWeight: 'normal',
			},
			listItemAvatar: {
				marginLeft: '25px',
			},
			tabs: {
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
				color: this.context.colors.white,
				width: '3.3rem',
				textAlign: 'center',
				marginLeft: '23px',
				border: '1px solid ' + this.context.colors.white,
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
				color: this.context.colors.white,
				width: '3.3rem',
				textAlign: 'center',
				marginLeft: '23px',
				border: '1px solid ' + this.context.colors.white,
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
				color: this.context.colors.white,
				width: '3.3rem',
				textAlign: 'center',
				marginLeft: '23px',
				border: '1px solid ' + this.context.colors.white,
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
					countFollowers={this.state.pageUser.count_followers}
					countFollows={this.state.pageUser.count_follows}
					countThanx={this.state.pageUser.count_thanx}
					countStar={this.state.pageUser.count_star}
				/>
				<MenuIcon userId={this.props.params.id} />
				<Tabs
					inkBarStyle={{backgroundColor:this.context.colors.fluorescent1}}
					style={styles.tabs}
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
	router: React.PropTypes.object.isRequired,
	colors: React.PropTypes.object.isRequired,
}
MyPage.propTypes = {
	params: React.PropTypes.object.isRequired
}

export class Profile extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			profileEditDialog: {
				open: false,
			},
			user: {
				username: this.props.username,
			},
		};
		this.onProfileEditOpen = this.onProfileEditOpen.bind(this);
		this.onProfileEditClose = this.onProfileEditClose.bind(this);
		this.onFollow = this.onFollow.bind(this);
		this.onFollower = this.onFollower.bind(this);
		this.onThanx = this.onThanx.bind(this);
		this.onStar = this.onStar.bind(this);
		this.onProfilePhotoEdit = this.onProfilePhotoEdit.bind(this);
		this.onCoverPhotoEdit= this.onCoverPhotoEdit.bind(this);
		this.onBack = this.onBack.bind(this);
		this.onLogout = this.onLogout.bind(this);
	}

	componentDidMount() {
	}

	onProfileEditOpen() {
		console.log("onProfileEditOpen");
			/*
		this.state = {
			profileEditDialog: {
				open: true,
			}
		};
			 */
	}

	onProfileEditClose() {
		console.log("onProfileEditClose");
			/*
		this.state = {
			profileEditDialog: {
				open: false,
			}
		};
			 */
	}

	onLogout(e) {
		const xhr = new XMLHttpRequest();
		xhr.open('GET', '/api/logout', false); // synchronous
		xhr.onload = () => {
			if (xhr.status !== 200) {
				return;
			}   
			const data = JSON.parse(xhr.responseText);
			if (!data.ok) {
			}   
		};  
		xhr.send();
		this.context.router.push('/login');
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

	onBack(e) {
		this.context.router.goBack();
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
				color: this.context.colors.white,
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
				width: '35%',
				border: '1px solid ' + this.context.colors.grey,
				boxShadow: '1px 1px 1px rgba(200,200,200,1)',
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
				borderColor: this.context.colors.white,
				display: 'inline-block',
				borderRadius: '1rem',
				margin: '5px',
				backgroundColor: this.context.colors.white,
				opacity: 0.6,
				height: '1.5rem',
				lineHeight: '1rem',
				minWidth: 'auto',
				width: '90%',
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
				color: this.context.colors.white,
				width: '48%',
				float: 'left',
				marginRight: '2%',
				textAlign: 'right',
			},
			follow: {
				color: this.context.colors.white,
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
				backgroundColor: this.context.colors.white,
				margin: '0.5rem',
				minWidth: 'auto',
				width: '25%',
				borderRadius: '5px',
				opacity: 0.9,
			},
			starThanxIcon: {
				opacity: 0.8,
				marginLeft: 0,
			},
			starThanxLabel: {
				opacity: 0.8,
				padding: 0,
			},
			backIcon: {
				position: 'fixed',
				zIndex: '200',
			},
			backIcon2: {
				backgroundColor: this.context.colors.white,
				boxShadow: '1px 1px 1px rgba(0,0,0,1)',
				borderRadius: '50%',
				padding: '5px',
			},
			/*
			exitButton: {
				backgroundColor: this.context.colors.white,
				opacity: 0.6,
				boxShadow: '1px 1px 1px rgba(0,0,0,1)',
				borderRadius: '1rem',
				border: '1px solid ' + this.context.colors.grey,
				position: 'absolute',
				top: '1%',
				right: '1%',
				zIndex: '200',
			},
			exitIcon: {
				color: this.context.colors.grey,
			},
			*/
			exitButtonWrap: {
				position: 'absolute',
				top: '0.5rem',
				right: '0.5rem',
			},
			exitButton: {
				border: '1px solid ' + this.context.colors.grey,
				display: 'inline-block',
				borderRadius: '1rem',
				color: this.props.color,
				margin: '5px',
				backgroundColor: this.context.colors.white,
				opacity: 0.6,
				height: '2rem',
				lineHeight: '1rem',
				minWidth: 'auto',
				zIndex: 2,
				boxShadow: '1px 1px 1px rgba(0,0,0,1)',
			},
			exitButtonIconStyle: {
				width: '1rem',
				height: '1rem',
				margin: '0.2rem 0.5rem',
			},
			exitButtonLabelStyle: {
				fontSize:'0.7rem',
				padding:'0 0.2rem',
			},
		};

		return (
			<div style={styles.root}>
				<div style={styles.coverRoot}>
					{(() => {
						if (this.props.userId == sessionStorage.user.id) {
							return (
								<div style={styles.exitButtonWrap}>
									<FlatButton
										style={styles.exitButton}
										label={this.props.name}
										icon={<ExitToAppIcon style={styles.exitButtonIconStyle} />}
										onTouchTap={this.onLogout}
										rippleColor={this.props.rippleColor}
										labelStyle={styles.exitButtonLabelStyle}
									/>
								</div>
							);
						}
					})()}
					{(() => {
						if (this.props.userId != sessionStorage.user.id) {
							return (
								<IconButton
									style={styles.backIcon}
									iconStyle={styles.backIcon2}
									onTouchTap={this.onBack}
								>
									<NavigationArrowBack />
								</IconButton>
							);
						}
					})()}
					{(() => {
						if (this.props.userId == sessionStorage.user.id) {
							return (
								<div style={styles.profilePhotoEditChipWrap}>
									<PhotoEditChip name={"編集"} color={this.context.colors.text1} backgroundColor={this.context.colors.white} onTouchTap={this.onProfilePhotoEdit} />
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
									<PhotoEditChip name={"編集"} color={this.context.colors.text1} backgroundColor={this.context.colors.white} onTouchTap={this.onCoverPhotoEdit} />
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
					<img style={styles.cover} src={this.props.cover} />
					<img style={styles.avatar} src={this.props.avatar} />
					<div style={styles.username}>{this.props.username}
						{(() => {
							console.log(this.state);
							if (this.props.userId == sessionStorage.user.id) {
								return (
									<div style={styles.profileEditButtonWrap}>
										<FlatButton
											style={styles.profileEditButton}
											icon={<EditorModeIcon style={styles.profileEditButtonIconStyle} />}
											onTouchTap={this.onProfileEditOpen}
										/>
<Dialog
	title="名前を変更"
	actions={<FlatButton
		label="Ok"
		primary={true}
		keyboardFocused={true}
		onTouchTap={this.onProfileEditClose}
	/>}
	modal={false}
	open={this.state.profileEditDialog.open}
	onRequestClose={this.onProfileEditClose}
>
	<TextField
          id="text-field-controlled"
          value={this.state.user.username}
	/>
</Dialog>
									</div>
								);
							}
						})()}
					</div>
					<div style={styles.followWrap}>
						<div style={styles.follower} onTouchTap={this.onFollower}>フォロワー {this.props.countFollowers}</div>
						<div style={styles.follow} onTouchTap={this.onFollow}>フォロー中 {this.props.countFollows}</div>
					</div>
					<div style={styles.numberChip2Wrap}>
						<FlatButton
							style={styles.starThanx}
							label={this.props.countStar}
							icon={<CommunicationEmailIcon style={styles.starThanxIcon} />}
							onTouchTap={this.onThanx}
							labelStyle={styles.starThanxLabel}
						/>
						<FlatButton
							style={styles.starThanx}
							label={this.props.countThanx}
							icon={<StarIcon style={styles.starThanxIcon} />}
							onTouchTap={this.onStar}
							labelStyle={styles.starThanxLabel}
						/>
					</div>
				</div>
			</div>
		);
	}
};
Profile.contextTypes = {
	router: React.PropTypes.object.isRequired,
	colors: React.PropTypes.object.isRequired,
}
Profile.propTypes = {
	userId: React.PropTypes.number.isRequired,
	cover: React.PropTypes.string.isRequired,
	avatar: React.PropTypes.string.isRequired,
	username: React.PropTypes.string.isRequired,
	countFollowers: React.PropTypes.number.isRequired,
	countFollows: React.PropTypes.number.isRequired,
	countThanx: React.PropTypes.number.isRequired,
	countStar: React.PropTypes.number.isRequired,
}
