import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, History, hashHistory} from 'react-router';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import AppBar from 'material-ui/AppBar';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Avatar from 'material-ui/Avatar';
import Subheader from 'material-ui/Subheader';
import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';
import TextField from 'material-ui/TextField';
import Scroll from 'react-scroll';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import HeadRoom from 'react-headroom';
import {DrawerMenu} from './menu.jsx';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import ContentSend from 'material-ui/svg-icons/content/send';
import FlatButton from 'material-ui/FlatButton';

var ws;
var self;
var userId;
var roomId;
var roomName;
var name;

export class ChatPage extends React.Component {

	constructor(props, context) {
		super(props, context);
		this.state = {
			messages: [],
			snack: {
				open: false,
				message: '',
			},
		};
		this.onSnackClose = this.onSnackClose.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
		this.changeText = this.changeText.bind(this);
		this.onBack = this.onBack.bind(this);
		this.onOffer = this.onOffer.bind(this);
		self = this;
	}

	componentWillMount() {
		userId = sessionStorage.user.id;
		roomId = this.props.location.query.roomId;
		roomName = this.props.location.query.roomName;
		name = sessionStorage.user.username;

		ws = new WebSocket("wss://ws-mentor.fairway.ne.jp/room/" + roomId + "/user/" + userId);

		ws.onopen = function(e) {
			console.log("onopen");
			console.log(e);
			console.log(ws);
		};

		ws.onerror = function(e) {
			console.log("onerror");
			console.log(e);
			console.log(ws);
		};

		ws.onclose = function(e) {
			console.log("onclose");
			console.log(e);
			console.log(ws);
			self.setState({
				snack: {
					open: true,
					message: '通信に失敗しました。',
				},
				refreshStyle: {
					display: 'none',
				},
			});
		};

		ws.onmessage = function(e) {
			var model = eval("("+e.data+")")
			var date = new Date( model.registerd_at * 1000 );
			var mmdd = (date.getMonth() + 1) + "/" + date.getDate();
			var hhmm = date.getHours() + ":" + ('0' + date.getMinutes()).slice( -2 );

			var newMessages = self.state.messages.slice();	
			newMessages.push({user_id: model.user_id, username: model.username, message: model.message, registerd_mmdd: mmdd, registerd_hhmm: hhmm, avatar: model.avatar});
			self.setState({
				messages: newMessages,
				textValue: ""
			});
		};

		/*
		let xhr = new XMLHttpRequest();
		xhr.open('GET', '/messages.json');
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
			let mentorings = [];
			let data = JSON.parse(xhr.responseText);
			console.log(data);
			this.setState({
				messages: data.message_list,
			});

			if (data.message_list.length == 0) {
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
			window.addEventListener('scroll', this.onScroll);
		}
		this.setState({
			refreshStyle: {
				position: 'relative',
				display: 'inline-block',
			},
		});
		xhr.send();
		*/
	}

	componentWillUnmount() {
		ws.close();
	}

	onDrawerToggle(e) {
		this.refs.drawerMenu.onToggle();
	}

	changeText(e) {
		this.setState({
			textValue: e.target.value
		});
	}

	sendMessage(e) {
		console.log("sendMessage");
		/*  まずはReactでwriteする
		var newMessages = this.state.messages.slice();	
		newMessages.push({user_id: 1, message: this.state.textValue});
			this.setState({
				messages: newMessages,
		  textValue: ""
			});
		*/
		if (ws.readyState == 1) {
			let wsSendMessage = "{\"user_id\":"+userId+",\"name\":\""+name+"\",\"message\":\""+this.state.textValue+"\"}";
			console.log(wsSendMessage);
			ws.send(wsSendMessage);
		} else {
			this.setState({
				snack: {
					open: true,
					message: '送信に失敗しました。',
				},
				refreshStyle: {
					display: 'none',
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

	onBack(e) {
		this.context.router.goBack();
	}

	onOffer(e) {
		console.log("onOffer");
	}

	render() {
		const styles = {
		ul: {
			paddingLeft: 0,
			marginBottom: '70px',
			listStyleType: 'none',
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
		avatar: {
			marginLeft: '10px',
		},
		leftBalloon: {
			width: 'auto',
			maxWidth: '60%',
			wordBreak: 'break-all',
			background: '#f1f0f0',
			border: '0px solid #777',
			padding: '5px 10px',
			margin: '5px 10px 5px 60px',
			borderRadius: '15px',
			clear: 'both',
			float: 'left',
		},
		rightBalloon: {
			width: 'auto',
			maxWidth: '70%',
			wordBreak: 'break-all',
			color: '#fff',
			position: 'relative',
			background: '#0084ff',
			border: '0px solid #777',
			padding: '5px 10px',
			margin: '5px 10px 5px 10px',
			borderRadius: '15px',
			clear: 'both',
			float: 'right',
		},
		clearBalloon: {
			clear: 'both',
		},
		senderName: {
			fontSize: '0.6em',
			marginTop: '-30px',
			marginLeft: '70px',
			marginBottom: '-5px',
			color: 'rgba(0, 0, 0, .40)',
		},
		textField: {
			position: 'fixed',
			bottom: '0',
			marginBottom: '0',
			borderTop: '1px solid #eeeeee',
			backgroundColor: '#eeeeee',
			width: '100%',
			clear: 'both',
		},
		sendButton: {
			marginRight: '20',
			position: 'fixed',
			bottom: '10px',
			right: '0',
			marginRight: '10px',
			backgroundColor: '#3f51b5',
		},
		timeRight: {
			fontSize: '0.6em',
			color: '#666',
			float: 'right',
			marginTop: '10px',
		},
		timeLeft: {
			fontSize: '0.6em',
			color: '#666',
			float: 'left',
			marginTop: '10px',
		},
		date: {
			fontSize: '0.6em',
			color: '#efefef',
			width: 'auto',
			wordBreak: 'break-all',
			background: '#9a9a9a',
			border: '0px solid #777',
			padding: '5px 10px',
			margin: '-12px 0 20px 43%',
			textAlign: 'center',
			borderRadius: '15px',
			clear: 'both',
			float: 'left',
		},
		textFieldWrap: {
			margin: '10px',
		},
		dateLi: {
			marginTop: '30px',
		},
		hr: {
			width: '100%',
			borderTop: '1px solid #cecece',
		},
	};
	var indents = [];
		return (
			<section>
				<HeadRoom
					style={styles.headroom}
				>
					<AppBar
						title={roomName}
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
								label="オファー"
								icon={<PersonAdd />}
								onTouchTap={this.onOffer}
							/>
						}
					/>
				</HeadRoom>
				<ul style={styles.ul}>
					{(() => {
						if (Array.isArray(this.state.messages)) {
							let indents = [];
							let messages = this.state.messages;
							let workmmdd = "";
							for (var i = 0; i < messages.length; i++) {
								if (workmmdd != messages[i].registerd_mmdd) {
									indents.push(<li style={styles.dateLi}><p style={styles.date}>{messages[i].registerd_mmdd}</p><div style={styles.hr} /><p style={styles.clearBalloon}></p></li>)
								}
								workmmdd = messages[i].registerd_mmdd;
								if (messages[i].user_id == userId) {
								  indents.push(<li key={i}><p style={styles.rightBalloon}>{messages[i].message}</p><div style={styles.timeRight}>{messages[i].registerd_hhmm}</div><p style={styles.clearBalloon}></p></li>);
								} else {
								  indents.push(<li key={i}><Avatar style={styles.avatar} src={messages[i].avatar} /><p style={styles.senderName}>{messages[i].username}</p><p style={styles.leftBalloon}>{messages[i].message}</p><div style={styles.timeLeft}>{messages[i].registerd_hhmm}</div><p style={styles.clearBalloon}></p></li>);
								}
							}
							Scroll.animateScroll.scrollToBottom({duration: 0});
							return indents;
						}
					})()}
				</ul>
				<TextField
					id='textField'
					style={styles.textField}
					multiLine={true}
					rows={1}
					value={this.state.textValue}
					onChange={this.changeText}
				/>
				<RaisedButton icon={<ContentSend />} primary={true} style={styles.sendButton} onTouchTap={this.sendMessage} />
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
ChatPage.contextTypes = {
	router: React.PropTypes.object.isRequired
}

