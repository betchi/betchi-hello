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
var isDoneFirstShow = false;
var styleUl = {
	paddingLeft: 0,
	marginBottom: '70px',
	listStyleType: 'none',
};
var styleTextField = {
	position: 'fixed',
	bottom: '10',
	marginTop: '0px',
	marginLeft: '10px',
	paddingLeft: '10px',
	backgroundColor: '#eeeeee',
	width: '85%',
	clear: 'both',
	backgroundColor: 'white',
	border: '0px solid #777',
	borderRadius: '5px',
};
var styleTextFieldWrap = {
	position: 'fixed',
	bottom: '0',
	width: '100%',
	height: '70px',
	backgroundColor: '#ededed',
}
var styleSendButton = {
	position: 'fixed',
	bottom: '20px',
	left: '84%',
	width: '50px',
	fontSize: '2em',
};

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

			if (ws.readyState == 1) {
				var wsSendMessage;

				// send Room Name
				wsSendMessage = "{\"room_name\":\""+roomName+"\"}";
				console.log(wsSendMessage);
				ws.send(wsSendMessage);

				// send Amazon SNS Endpoint Arn & Device Token
				if (snsEndpointArn != undefined && deviceToken != undefined) {
					wsSendMessage = "{\"sns_endpoint_arn\":\""+snsEndpointArn+"\",\"device_token\":\""+deviceToken+"\"}";
					console.log(wsSendMessage);
					ws.send(wsSendMessage);
				}
			} else {
				self.setState({
					snack: {
						open: true,
						message: '送信に失敗しました。',
					},
					refreshStyle: {
						display: 'none',
					},
				});
			}
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
			var model = JSON.parse(e.data);
			var date = new Date( model.registerd_at * 1000 );
			var mmdd = (date.getMonth() + 1) + "/" + date.getDate();
			var hhmm = date.getHours() + ":" + ('0' + date.getMinutes()).slice( -2 );

			var decodeMessage = decodeURI(model.message);

			var newMessages = self.state.messages.slice();	
			newMessages.push({user_id: model.user_id, username: model.username, message: decodeMessage, registerd_mmdd: mmdd, registerd_hhmm: hhmm, avatar: model.avatar});
			self.setState({
				messages: newMessages,
				textValue: ""
			});
		};
	}

	componentWillUnmount() {
		ws.close();
		self.setState({
			textValue: ""
		});
	}

	onDrawerToggle(e) {
		this.refs.drawerMenu.onToggle();
	}

	changeText(e) {
		var str = e.target.value;
		var enterCount = (str.match(new RegExp("\n", "g")) || []).length;
		var ulPaddingBottom = enterCount * 30;
		var sendButtonBottom = enterCount * 21;
		if (enterCount == 0) {
			styleTextFieldWrap.height = '70px';
			styleSendButton.bottom = '20px';
		} else if (enterCount < 3) {
			styleUl.paddingBottom = ulPaddingBottom + 'px';
			styleTextField.paddingBottom = '0px';
			styleTextFieldWrap.height = (ulPaddingBottom + 60) + 'px';
			styleSendButton.bottom = (sendButtonBottom + 10) + 'px';
		} else if (enterCount == 3) {
			styleTextField.paddingBottom = '15px';
			styleUl.paddingBottom = (ulPaddingBottom + 10) + 'px';
			styleTextFieldWrap.height = (ulPaddingBottom + 70) + 'px';
			styleSendButton.bottom = (sendButtonBottom * 1) + 'px';
		}
		this.setState({
			textValue: e.target.value
		});
	}

	sendMessage(e) {
		styleSendButton.backgroundColor = 'rgba(255, 255, 255, 0.0)';
		var message = this.state.textValue.replace(/\s|\n|　/g, "");
		if (message == "") {
			return;
		}
		/*  まずはReactでwriteする
		var newMessages = this.state.messages.slice();	
		newMessages.push({user_id: 1, message: this.state.textValue});
			this.setState({
				messages: newMessages,
		  textValue: ""
			});
		*/
		if (ws.readyState == 1) {
			isDoneFirstShow = true;
			let wsSendMessage = "{\"user_id\":"+userId+",\"name\":\""+name+"\",\"message\":\""+encodeURI(this.state.textValue)+"\"}";
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
			borderRadius: '15px',
			padding: '5px 10px',
			margin: '-12px 0 20px 43%',
			textAlign: 'center',
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
				<ul style={styleUl}>
					{(() => {
						if (Array.isArray(this.state.messages)) {
							let indents = [];
							let messages = this.state.messages;
							let workmmdd = "";
							for (var i = 0; i < messages.length; i++) {
								var message = messages[i].message.split('\n').map(function(line) {
									return <span>{line}<br /></span>;
								});
								if (workmmdd != messages[i].registerd_mmdd) {
									indents.push(<li key={messages[i].registerd_mmdd} style={styles.dateLi}><p style={styles.date}>{messages[i].registerd_mmdd}</p><div style={styles.hr} /><p style={styles.clearBalloon}></p></li>)
								}
								workmmdd = messages[i].registerd_mmdd;
								if (messages[i].user_id == userId) {
									indents.push(<li key={i}><p style={styles.rightBalloon}>{message}</p><div style={styles.timeRight}>{messages[i].registerd_hhmm}</div><p style={styles.clearBalloon}></p></li>);
								} else {
									indents.push(<li key={i}><Avatar style={styles.avatar} src={messages[i].avatar} /><p style={styles.senderName}>{messages[i].username}</p><div style={styles.leftBalloon}>{message}</div><div style={styles.timeLeft}>{messages[i].registerd_hhmm}</div><p style={styles.clearBalloon}></p></li>);
								}
							}
							if (isDoneFirstShow) {
								Scroll.animateScroll.scrollToBottom({duration: 1500});
							} else {
								Scroll.animateScroll.scrollToBottom({duration: 0});
							}
							return indents;
						}
					})()}
				</ul>
				<div style={styleTextFieldWrap}>
					<TextField
						id='textField'
						style={styleTextField}
						multiLine={true}
						underlineShow={false}
						rows={1}
						rowsMax={4}
						defaultValue={this.state.textValue}
						value={this.state.textValue}
						onChange={this.changeText}
					/>
				</div>
				<FlatButton icon={<ContentSend />} primary={true} style={styleSendButton} onTouchTap={this.sendMessage} />
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

