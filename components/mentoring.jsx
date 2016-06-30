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

import HeadRoom from 'react-headroom';

import {MentoringCoverSwipe, MentoringDigestWithAvatar} from './content.jsx';
import {ThxMessageList} from './message.jsx';

export class MentoringPage extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			messages: [],
			mentoring: {
				id: this.props.params.id,
				uid: 0,
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
		this.loadContents(this.props.params.id);
		this.loadMessages(this.props.params.id);
	}

	componentWillReceiveProps(nextProps) {
		window.removeEventListener('scroll', this.onScroll);
		this.loadContents(nextProps.params.id);
		this.loadMessages(nextProps.params.id);
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.onScroll);
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
			buttons: {
				position: 'fixed',
				width: '96%',
				margin: '0 2%',
				bottom: '3px',
				left: 0,
				textAlign: 'center',
			},
			offer: {
				width: '100%',
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
								onTouchTap={this.onBack}
							>
								<NavigationArrowBack />
							</IconButton>
						}
						iconElementRight={
							<FlatButton
								primary={true}
								label="フォロー"
								icon={<PersonAdd />}
								onTouchTap={this.onFollow}
							/>
						}
					/>
				</HeadRoom>
				<MentoringCoverSwipe
					covers={this.state.mentoring.covers}
					title={this.state.mentoring.title}
					duration={this.state.mentoring.duration}
					price={this.state.mentoring.price}
				/>
				<MentoringDigestWithAvatar
					uid={this.state.mentoring.uid}
					avatar={this.state.mentoring.avatar}
					star={this.state.mentoring.star}
					digest={this.state.mentoring.digest}
					countThx={this.state.mentoring.countThx}
					countMentors={this.state.mentoring.countMentors}
					countFollowers={this.state.mentoring.countFollowers}
				/>
				<ThxMessageList
					key={'thx-message_' + this.props.params.id}
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
				<div style={styles.buttons}>
					<RaisedButton
						style={styles.offer}
						primary={true}
						label="オファーする・メッセージを送る"
						onTouchTap={this.onOffer}
					/>
				</div>
			</section>
		);
	}
}
MentoringPage.contextTypes = {
	router: React.PropTypes.object.isRequired
}
MentoringPage.propTypes = {
	params: React.PropTypes.object.isRequired
}

