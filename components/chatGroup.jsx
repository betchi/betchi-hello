import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';

import AppBar from 'material-ui/AppBar';
import HeadRoom from 'react-headroom';
import ClearButton from 'material-ui/svg-icons/content/clear';
import DoneButton from 'material-ui/svg-icons/action/done';
import CancelButton from 'material-ui/svg-icons/navigation/cancel';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';

export class ChatGroupPage extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			contactList: [],
			selectedAvatarList: [],
			styles: {
				avatarBar: {
					display: 'none',
					opacity: '0.85',
					backgroundColor: '#232323',
					width: '100%',
					height: '4.5rem',
					overflowX: 'auto',
					overflowY: 'hidden',
					whiteSpace: 'nowrap',
					marginTop: '0px',
					position: 'fixed',
					bottom: '0px',
				},
			},
			snack: {
				open: false,
				message: '',
			},
		};
		this.onItemTap = this.onItemTap.bind(this);
		this.onCancelTap = this.onCancelTap.bind(this);
		this.rightIcon = this.rightIcon.bind(this);
		this.onSnackClose = this.onSnackClose.bind(this);
	}

	componentWillMount() {
		let xhr = new XMLHttpRequest();
		xhr.open('GET', '/contactList.json');
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
			let contactList = [];
			let data = JSON.parse(xhr.responseText);
			contactList = data.contact_list;
			this.setState({
				contactList: contactList,
			});
			if (contactList.length == 0) {
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
		xhr.send();
	}

	rightIcon(e) {
		return <DoneButton />;
	}

	onItemTap(contact) {
		let selectedAvatarList = this.state.selectedAvatarList;
		selectedAvatarList.push(contact);
		let stylesAvatarBar = this.state.styles.avatarBar;
		stylesAvatarBar.display = 'block';
		this.setState({
			styles: {
				avatarBar: stylesAvatarBar,
			},
			selectedAvatarList: selectedAvatarList,
		});
	}

	onCancelTap(index) {
		let selectedAvatarList = this.state.selectedAvatarList;
		delete selectedAvatarList[index];
		this.setState({
			selectedAvatarList: selectedAvatarList,
		});

		let isNone = true;
		for (var index in selectedAvatarList) {
			isNone = false;
		}
		if (isNone) {
			let stylesAvatarBar = this.state.styles.avatarBar;
			stylesAvatarBar.display = 'none';
			this.setState({
				styles: {
					avatarBar: stylesAvatarBar,
				},
			});
		}
	}

	onSnackClose(e) {
		this.setState({
			snack: {
				open: false,
				message: '',
			}
		})
	}

	render() {
		const styles = {
			appBar: {
				position: 'fixed',
				textDecoration: 'none',
			},
			title: {
				cursor: 'pointer',
				fontSize: '1rem',
			},
			searchAvatarWrap: {
				position: 'fixed',
				opacity: '1.0',
				paddingBottom: '0.5rem',
				zIndex: '1',
				width: '100%',
				top: '3rem',
			},
			searchAvatar: {
				padding: '0 0.4rem',
				boxSizing: 'border-box',
				width: '96%',
				margin: '1.5rem 2% 0 2%',
				fontSize: '1rem',
				lineHeight: '1.5rem',
				backgroundColor: 'white',
				border: '1px solid #ccc',
				borderRadius: '5px',
			},
			contactListWrap: {
				position: 'relative',
				top: '8rem',
			},
			avatarWrap: {
			},
			avatar: {
				marginTop: '-0.3rem',
				marginLeft: '0.8rem',
				display: 'inline-block',
				whiteSpace: 'normal',
				verticalAlign: 'top',
			},
			avatarName: {
				color: 'white',
				fontSize: '0.5em',
				position: 'relative',
				top: '-1.3rem',
				left: '-0.1rem',
				overflow: 'hidden',
				textOverflow: 'ellipsis',
				width: '3rem',
			},
			avatarCancel: {
				border: '1px solid #999',
				backgroundColor: 'white',
				borderRadius: '50%',
				position: 'relative',
				top: '-0.7rem',
				left: '1.1rem',
			},
		};
		return (
			<section>
				<HeadRoom
					style={styles.headroom}
				>
					<AppBar
						style={styles.appBar}
						title='メンターグループ作成'
						titleStyle={styles.title}
						iconElementLeft={
							<IconButton
								style={styles.backIcon}
								onTouchTap={this.onBack}
							>
								<ClearButton />
							</IconButton>
						}
						iconElementRight={
							<IconButton
								onTouchTap={this.onNext}
							>
								<DoneButton />
							</IconButton>
						}
					/>
				</HeadRoom>
				<div style={styles.searchAvatarWrap}>
					<TextField
						id='searchAvatar'
						style={styles.searchAvatar}
						underlineShow={false}
						hintText="名前で検索"
					/>
				</div>
				<div style={styles.contactListWrap}>
					<List>
					{(() => {
						if (Array.isArray(this.state.contactList)) {
							let contactList = [];
							for (var i = 0; i < this.state.contactList.length; i++) {
								contactList.push(<Subheader>{this.state.contactList[i].list_name}</Subheader>);
								if (Array.isArray(this.state.contactList[i].list)) {
									for (var j = 0; j < this.state.contactList[i].list.length; j++) {
										contactList.push(<ListItem key={'list'+i+'-user'+j} primaryText={this.state.contactList[i].list[j].name} leftAvatar={<Avatar src={this.state.contactList[i].list[j].avatar} />} onTouchTap={this.onItemTap.bind(this, this.state.contactList[i].list[j])} rightIcon={<DoneButton />} />);
									}
								}
								if ((this.state.contactList.length - 1) != i) {
									contactList.push(<Divider />);
								}
							}
							return contactList;
						}
					})()}
					</List>
				</div>
				<div style={this.state.styles.avatarBar}>
					<p style={styles.avatarWrap}>
						{(() => {
							if (Array.isArray(this.state.selectedAvatarList)) {
								let selectedAvatarList = [];
								for (var index in this.state.selectedAvatarList) {
									selectedAvatarList.push(<Avatar key={this.state.selectedAvatarList[index].user_id} style={styles.avatar} src={this.state.selectedAvatarList[index].avatar}><CancelButton style={styles.avatarCancel} onTouchTap={this.onCancelTap.bind(this, index)} /><p style={styles.avatarName}>{this.state.selectedAvatarList[index].name}</p></Avatar>);
								}
								//for (var i = 0; i < this.state.selectedAvatarList.length; i++) {
								//	selectedAvatarList.push(<Avatar key={this.state.selectedAvatarList[i].user_id} style={styles.avatar} src={this.state.selectedAvatarList[i].avatar}><CancelButton style={styles.avatarCancel} onTouchTap={this.onCancelTap.bind(this, i)} /><p style={styles.avatarName}>{this.state.selectedAvatarList[i].name}</p></Avatar>);
								//};
								return selectedAvatarList;
							}
						})()}
					</p>
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
