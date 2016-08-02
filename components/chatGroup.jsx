import React from 'react';
import ReactDOM from 'react-dom';
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
				contactListWrap: {
					position: 'relative',
					top: '8rem',
					marginBottom: '0rem',
				},
			},
			snack: {
				open: false,
				message: '',
			},
			animationName: ''
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

	onItemTap(index, contact) {
		let selectedAvatarList = this.state.selectedAvatarList;
		if (index in this.state.selectedAvatarList) {
			delete selectedAvatarList[index];
		} else {
			selectedAvatarList[index] = contact;
		}
		this.setState({
			selectedAvatarList: selectedAvatarList,
		});
		this.displayAvatarBar(index);

		return;
	}

	onCancelTap(index) {
		this.clickHdl()
		let selectedAvatarList = this.state.selectedAvatarList;
		delete selectedAvatarList[index];
		this.setState({
			selectedAvatarList: selectedAvatarList,
		});
		this.displayAvatarBar();
		return;
	}

	clickHdl() {
		let styleSheet = document.styleSheets[0];
		let animationName = `animation${Math.round(Math.random() * 100)}`;
		let keyframes =
		`@-webkit-keyframes ${animationName} {
				10% {-webkit-transform:translate(${Math.random() * 300}px, ${Math.random() * 300}px)} 
				90% {-webkit-transform:translate(${Math.random() * 300}px, ${Math.random() * 300}px)}
				100% {-webkit-transform:translate(${Math.random() * 300}px, ${Math.random() * 300}px)}
		}`;
		styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
		
		this.setState({
			//			animationName: animationName
		});
	}

	displayAvatarBar(index) {
		let isNone = true;
		for (var index in this.state.selectedAvatarList) {
			isNone = false;
		}

		let stylesAvatarBar = this.state.styles.avatarBar;
		let stylesContactListWrap = this.state.styles.contactListWrap;
		if (isNone) {
			stylesAvatarBar.display = 'none';
			stylesContactListWrap.marginBottom = '0rem';
		} else {
			stylesAvatarBar.display = 'block';
			stylesContactListWrap.marginBottom = '4.5rem';
		}
		this.setState({
			styles: {
				avatarBar: stylesAvatarBar,
				contactListWrap: stylesContactListWrap,
			},
		});
		return;
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
			avatarWrap: {
			},
			avatar: {
				marginTop: '-0.2rem',
				marginLeft: '1rem',
				display: 'inline-block',
				whiteSpace: 'normal',
				verticalAlign: 'top',
      animationName: this.state.animationName,
      animationTimingFunction: 'ease-in-out',
      animationDuration: '0.6s',
      animationDelay: '0.0s',
      animationIterationCount: 1,
      animationDirection: 'normal',
      animationFillMode: 'forwards'
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
				top: '-0.6rem',
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
				<div style={this.state.styles.contactListWrap}>
					<List>
					{(() => {
						if (Array.isArray(this.state.contactList)) {
							let contactList = [];
							for (var i = 0; i < this.state.contactList.length; i++) {
								contactList.push(<Subheader>{this.state.contactList[i].list_name}</Subheader>);
								if (Array.isArray(this.state.contactList[i].list)) {
									for (var j = 0; j < this.state.contactList[i].list.length; j++) {
										var key = 'list'+this.state.contactList[i].list_id+'-user'+this.state.contactList[i].list[j].user_id;
										if (key in this.state.selectedAvatarList) {
											contactList.push(<ListItem key={key} primaryText={this.state.contactList[i].list[j].name} leftAvatar={<Avatar src={this.state.contactList[i].list[j].avatar} />} onTouchTap={this.onItemTap.bind(this, key, this.state.contactList[i].list[j])} rightIcon={<DoneButton />} />);
										} else {
											contactList.push(<ListItem key={key} primaryText={this.state.contactList[i].list[j].name} leftAvatar={<Avatar src={this.state.contactList[i].list[j].avatar} />} onTouchTap={this.onItemTap.bind(this, key, this.state.contactList[i].list[j])} />);
										}
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
