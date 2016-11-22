import React from 'react';
import ReactDOM from 'react-dom';

import {Router, Route, IndexRoute, History, hashHistory} from 'react-router';
import HeadRoom from 'react-headroom';

import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Snackbar from 'material-ui/Snackbar';
import Avatar from 'material-ui/Avatar';
import AppBar from 'material-ui/AppBar';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import IconButton from 'material-ui/IconButton';
import Toggle from 'material-ui/Toggle';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

var self;
var searchContactList = null;
var myContactList = null;
var contactSearchTimerId = null;
var mentoringId;
var offerUserId;
var mentoringTitle;

export class ParticipantsListPage extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			contactList: [],
			snack: {
				open: false,
				message: '',
			},
			dialog: {
				open: false,
			},
		};
		this.onItemTap = this.onItemTap.bind(this);
		this.onBack = this.onBack.bind(this);
		this.dialogHandleClose = this.dialogHandleClose.bind(this);
		this.dialogHandleOpen = this.dialogHandleOpen.bind(this);
		this.onPostDeterminations = this.onPostDeterminations.bind(this);
		self = this;
	}

	componentWillMount() {
		offerUserId = this.props.params.userId;
		mentoringId = this.props.params.mentoringId;
		mentoringTitle = this.props.params.mentoringTitle;
		let xhr = new XMLHttpRequest();
		xhr.open('GET', '/api/offers/' + mentoringId);
		xhr.onload = () => {
			if (xhr.status !== 200) {
				this.setState({
					snack: {
						open: true,
						message: 'オファーの読み込みに失敗しました。',
					},
					refreshStyle: {
						display: 'none',
					},
				});
				return;
			}
			myContactList = [];
			let data = JSON.parse(xhr.responseText);
			console.log(data.offers);
			this.setState({
				contactList: data.offers,
			});
			if (data.offers.length == 0) {
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
		};
		xhr.send();;
	}

	onBack(e) {
		this.context.router.goBack();
	}

	onItemTap(userId) {
		console.log(userId);
	}

	onPostDeterminations(e) {
		console.log("onPostDeterminations");
		let xhr = new XMLHttpRequest();
		xhr.open('POST', '/api/mentoring/determinations', false);
		xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
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
		}
		var mentoring = {
			id: parseInt(mentoringId),
			determinations: [parseInt(this.props.location.query.targetUserId)]
		};
		const json = JSON.stringify({
			action: "all",
			mentoring:mentoring,
		});
		xhr.send(json);
		this.dialogHandleClose();
	}

	dialogHandleOpen() {
		this.setState({
			dialog: {
				open: true,
			},
		});
	}

	dialogHandleClose() {
		this.setState({
			dialog: {
				open: false,
			},
		});
	}

	render() {
		const styles = {
			contactListSection: {
				position: 'absolute',
				width: '100%',
				height: '99%',
				top: '0.2rem',
			},
			title: {
				cursor: 'pointer',
				fontSize: '1rem',
			},
			searchContactWrap: {
				position: 'absolute',
				opacity: '1.0',
				paddingBottom: '0.5rem',
				zIndex: '1',
				width: '100%',
				top: '1rem',
			},
			clearModalButton: {
				position: 'absolute',
				top: '-0.5rem',
				left: '-0.5rem',
				padding: '1rem',
				zIndex: '10001',
			},
			doneModalButton: {
				position: 'absolute',
				top: '-0.5rem',
				right: '-0.5rem',
				padding: '1rem',
				zIndex: '10001',
			},
			modalTitle: {
				textAlign: 'center',
				marginTop: '0.6rem',
				fontSize: '1rem',
			},
			searchContact: {
				padding: '0 0.4rem',
				boxSizing: 'border-box',
				width: '85%',
				margin: '1.5rem 0 0 2%',
				fontSize: '1rem',
				lineHeight: '1.5rem',
				backgroundColor: 'white',
				border: '1px solid #ccc',
				borderRadius: '5px',
			},
			headroom: {
				WebkitTransition: 'all .3s ease-in-out',
				MozTransition: 'all .3s ease-in-out',
				OTransition: 'all .3s ease-in-out',
				transition: 'all .3s ease-in-out',
			},
			title: {
				fontSize: '1rem',
			},
			time: {
				width: '2.5rem',
				textAlign: 'right',
				fontSize: '0.8em',
			},
			list: {
				marginTop: '-8px',
			},
			listItem: {
			},
			secondoryText: {
			},
			toggle: {
				position: 'absolute',
				width: '48px',
				height: '48px',
				left: '80%',
			},
		};

		const actions = [
		  <FlatButton
			label="キャンセル"
			primary={true}
			onTouchTap={this.dialogHandleClose}
		  />,
		  <FlatButton
			label="はい"
			primary={true}
			keyboardFocused={true}
			onTouchTap={this.onPostDeterminations}
		  />,
		];

		return (
			<section style={styles.contactListSection}>
				<HeadRoom
					style={styles.headroom}
				>
					<AppBar
						title="参加リスト"
						titleStyle={styles.title}
						iconElementLeft={
							<IconButton
								onTouchTap={this.onBack}
							>
							<NavigationArrowBack />
							</IconButton>
						}
						iconElementRight={
							<FlatButton
								primary={true}
								label="OK"
								onTouchTap={this.dialogHandleOpen}
							/>
						}
					/>
				</HeadRoom>
				<List style={styles.list}>
				{(() => {
					if (Array.isArray(this.state.contactList)) {
						let contactList = [];
						for (var i = 0; i < this.state.contactList.length; i++) {
							var date = new Date( this.state.contactList[i].last_modified_at);
							var hhmm = date.getHours() + ":" + ('0' + date.getMinutes()).slice( -2 );
							var message = decodeURI(this.state.contactList[i].last_message);
							contactList.push(
								<ListItem
									style={styles.listItem}
									key={i}
									primaryText={this.state.contactList[i].username}
									leftAvatar={<Avatar src={this.state.contactList[i].avatar} />}
									secondaryTextLines={2}
									disabled={true}
								>
									<Toggle
										style={styles.toggle}
										onToggle={this.onItemTap.bind(this, this.state.contactList[i].user_id)}
									/>
								</ListItem>
							);
						}
						return contactList;
					}
				})()}
				</List>
				<Dialog
					title="確認"
					actions={actions}
					modal={false}
					open={this.state.dialog.open}
					onRequestClose={this.dialogHandleClose}
				>
					このユーザとメンタリングします
				</Dialog>
				<Snackbar
					open={this.state.snack.open}
					message={this.state.snack.message}
					autoHideDuration={4000}
					onRequestClose={this.onSnackClose}
				/>
			</section>
		);
	}
};
ParticipantsListPage.contextTypes = {
	router: React.PropTypes.object.isRequired
}
