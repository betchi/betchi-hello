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

export class Profile extends React.Component {
	constructor(props, context) {
		super(props, context);
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
				fontWeight: 'bolder',
				textShadow: '1px 1px 1px rgba(0,0,0,1)',
			},
			starRoot: {
				display: 'inline-block',
				boxSizing: 'border-box',
				width: '50%',
				lineHeight: '2rem',
				verticalAlign: 'middle',
			},
			summuryRoot: {
				display: 'inline-block',
				boxSizing: 'border-box',
				width: '50%',
				fontSize: '0.8rem',
				lineHeight: '1.5rem',
				verticalAlign: 'top',
			},
			actionsRoot: {
				width: '100%',
			},
			action: {
				display: 'inline-block',
				boxSizing: 'border-box',
				width: '50%',
			},
			actionLabel: {
				letterSpacing: '-2px',
				fontSize: '0.8rem',
				fontWeight: 'bold',
			},
		};

		return (
			<div style={styles.root}>
				<div style={styles.coverRoot}>
					<img style={styles.cover} src={this.props.cover} />
					<img style={styles.avatar} src={this.props.avatar} />
					<div style={styles.offer}>メッセージ・オファー&nbsp;{this.props.countOffer}件</div>
				</div>
				<RatingStar
					rootStyle={styles.starRoot}
					star={this.props.star}
				/>
				<div style={styles.summuryRoot}>
					メンター{this.props.countMentors}人&nbsp;
					フォロー{this.props.countFollowers}人&nbsp;
				</div>
				<div style={styles.actionRoot}>
					<div style={styles.action}>
						<FlatButton
							label={'メンタリングをする'}
							labelStyle={styles.actionLabel}
							icon={<PeopleOutline />}
						/>
					</div>
					<div style={styles.action}>
						<FlatButton
							label={'メンターライブをする'}
							labelStyle={styles.actionLabel}
							icon={<LiveTv />}
						/>
					</div>
					<div style={styles.action}>
						<FlatButton
							label={'メンターグループをする'}
							labelStyle={styles.actionLabel}
							icon={<PeopleOutline />}
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
	star: React.PropTypes.number.isRequired,
	countMentors: React.PropTypes.number.isRequired,
	countFollowers: React.PropTypes.number.isRequired,
}

export class MyPage extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			messages: [],
			mentoring: {
				id: this.props.params.id,
				cover: '',
				covers: [],
				avatar: '',
				title: '',
				duration: '',
				price: '',
				star: 0,
				digest: '',
				countThx: 0,
				countMentors: 0,
				countFollowers: 0,
			},
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
		//this.loadContents(this.props.params.id);
		//this.loadMessages(this.props.params.id);
	}

	componentWillUnmount() {
		//window.removeEventListener('scroll', this.onScroll);
	}

	onBack(e) {
		this.context.router.goBack();
	}

	onFollow(e) {
		alert('follow');
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
		xhr.open('GET', '/mentoring_' + id + '.json');
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
			let mentoring = JSON.parse(xhr.responseText);
			this.setState({
				mentoring: mentoring,
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
				backgroundColor: 'white',
			},
			headroom: {
				WebkitTransition: 'all .3s ease-in-out',
				MozTransition: 'all .3s ease-in-out',
				OTransition: 'all .3s ease-in-out',
				transition: 'all .3s ease-in-out',
			},
			title: {
				fontSize: '1.2rem',
				fontWeight: 'bold',
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
				<HeadRoom
					style={styles.headroom}
				>
					<AppBar
						title='応援し合う世界へ'
						titleStyle={styles.title}
						iconElementLeft={
							<IconButton
								style={styles.backIcon}
								onTouchEnd={this.onBack}
							>
								<NavigationArrowBack />
							</IconButton>
						}
					/>
				</HeadRoom>
				<Profile
					cover={'/cover.jpg'}
					avatar={'/avatar.jpg'}
					countOffer={3}
					star={3.5}
					countMentors={11}
					countFollowers={40}
				/>
				<ThxMessageList
					key={'mengorings_' + this.props.params.id}
					messages={this.state.messages}
				/>
				<Divider />
				<div style={styles.refreshBox}>
					<div style={styles.refreshMargin}>
						<RefreshIndicator
							size={40}
							left={0}
							top={0}
							status="loading"
							style={this.state.refreshStyle}
						/>
					</div>
				</div>
				<Snackbar
					open={this.state.snack.open}
					message={this.state.snack.message}
					autoHideDuration={4000}
					onRequestClose={this.onSnackClose}
				/>
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
