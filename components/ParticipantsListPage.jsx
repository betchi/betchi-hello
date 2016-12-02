import React from 'react';
import ReactDOM from 'react-dom';

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
			determinations: [],
			snack: {
				open: false,
				message: '',
			},
			dialog: {
				open: false,
			},
		};
		this.onBack = this.onBack.bind(this);
		this.dialogHandleClose = this.dialogHandleClose.bind(this);
		this.dialogHandleOpen = this.dialogHandleOpen.bind(this);
		this.onPostDeterminations = this.onPostDeterminations.bind(this);
		self = this;
	}

	componentWillMount() {
		this.getDeterminations();
	}

	getDeterminations() {
		mentoringId = this.props.params.mentoringId;
		let xhr = new XMLHttpRequest();
		xhr.open('GET', '/api/determinations/' + mentoringId, false);
		xhr.send();;
		let data = JSON.parse(xhr.responseText);
		console.log(data.determinations);
		this.setState({
			determinations: data.determinations,
		});
	}

	onBack(e) {
		this.context.router.goBack();
	}

	onPostDeterminations() {
		console.log("onPostDeterminations");
		console.log(this.state.determinations);
		let determinationsInfo = {
			determinations: this.state.determinations,
		}
		console.log(determinationsInfo);
		let xhr = new XMLHttpRequest();
		xhr.open('POST', '/api/determinations/' + this.props.params.mentoringId, false);
		xhr.setRequestHeader("Content-type", "application/json");
		xhr.send(JSON.stringify(determinationsInfo));
		if (xhr.status !== 200) {
			this.setState({
				snack: {
					open: false,
					message: '送信に失敗しました。',
				},
			});
			return;
		}
		let data = JSON.parse(xhr.responseText);
		this.setState({
			mentoring: data.mentoring,
		})
		console.log(data);
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

  handleToggle(event, toggled) {
		let userId = event.target.value;
		let isBlocked = toggled ? 0 : 1;
		let determinations = this.state.determinations;
		for (let i = 0; i < determinations.length; i++) {
			if (determinations[i].user_id === parseInt(userId)) {
				determinations[i].is_blocked = isBlocked;
				determinations[i].action = "update";
				break;
			}
		}
		this.setState({
			determinations: determinations,
		})
  };

	render() {
		const styles = {
			determinationsSection: {
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
			<section style={styles.determinationsSection}>
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
				<List
					style={styles.list}
					ref="list"
				>
				{(() => {
					if (Array.isArray(this.state.determinations)) {
						let determinations = [];
						let isBlocked;
						for (var i = 0; i < this.state.determinations.length; i++) {
							if (this.state.determinations[i].is_blocked === 1) {
								isBlocked = false;
							} else {
								isBlocked = true;
							}
							determinations.push(
								<ListItem
									style={styles.listItem}
									key={i}
									primaryText={this.state.determinations[i].username}
									leftAvatar={<Avatar src={this.state.determinations[i].avatar} />}
									secondaryTextLines={2}
									disabled={true}
								>
									<Toggle
										style={styles.toggle}
										defaultToggled={isBlocked}
										value={this.state.determinations[i].user_id}
										onToggle={this.handleToggle.bind(this)}
									/>
								</ListItem>
							);
						}
						return determinations;
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
					更新します
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
