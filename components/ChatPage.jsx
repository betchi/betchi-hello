import React from 'react';
import ReactDOM from 'react-dom';

import {Router, Route, IndexRoute, History, hashHistory} from 'react-router';
import HeadRoom from 'react-headroom';

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
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import ContentSend from 'material-ui/svg-icons/content/send';
import FlatButton from 'material-ui/FlatButton';

var ws;
var self;
var userId;
var mentoringId;
var offerUserId;
var mentoringTitle;
var name;
var isDoneFirstShow = false;
var styleUl = {
	paddingLeft: 0,
	paddingBottom: '1rem',
	marginBottom: '70px',
	listStyleType: 'none',
};
var styleTextField = {
	position: 'fixed',
	bottom: '10px',
	marginTop: '0px',
	marginLeft: '10px',
	paddingLeft: '10px',
	paddingBottom: '0',
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
	height: '4.25rem',
}
var styleSendButton = {
	position: 'fixed',
	bottom: '1.2rem',
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
		styleTextFieldWrap.backgroundColor = window.bgColor2;
		offerUserId = this.props.params.offerUserId;
		mentoringId = this.props.params.mentoringId;
		mentoringTitle = this.props.params.mentoringTitle;
		name = sessionStorage.user.username;
		isDoneFirstShow = false;

		ws = new WebSocket("wss://ws-mentor.fairway.ne.jp/room/" + mentoringId + "/user/" + sessionStorage.user.id + "/code/" + mentoringId + "-" + offerUserId);

		ws.onopen = function(e) {
			console.log("onopen");
			console.log(ws);

			if (ws.readyState == 1) {
				var wsSendMessage;

				// send Room Name
				wsSendMessage = "{\"room_name\":\""+mentoringTitle+"\"}";
				console.log(wsSendMessage);
				ws.send(wsSendMessage);

				// send Amazon SNS Endpoint Arn & Device Token
				if (snsEndpointArn != undefined && deviceToken != undefined) {
					wsSendMessage = "{\"sns_endpoint_arn\":\""+snsEndpointArn+"\",\"device_token\":\""+deviceToken+"\"}";
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
console.log(model.registerd_at);
			var date = new Date(model.registerd_at);
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
		styleUl.paddingBottom = '1rem';
		styleTextFieldWrap.backgroundColor = window.bgColor2;
		styleTextFieldWrap.height = '4.25rem';
		styleSendButton.bottom = '1.2rem';
		styleTextField.paddingBottom = '0';
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
		switch (enterCount) {
			case 0:
				styleUl.paddingBottom = '1rem';
				styleTextFieldWrap.height = '4.25rem';
				styleSendButton.bottom = '1.2rem';
				styleTextField.paddingBottom = '0';
				break;
			case 1:
				styleUl.paddingBottom = '2.4rem';
				styleTextFieldWrap.height = '5.75rem';
				styleSendButton.bottom = '2rem';
				styleTextField.paddingBottom = '0';
				break;
			case 2:
				styleUl.paddingBottom = '4rem';
				styleTextFieldWrap.height = '7.2rem';
				styleSendButton.bottom = '2.8rem';
				styleTextField.paddingBottom = '0';
				break;
			case 3:
				styleUl.paddingBottom = '6.4rem';
				styleTextFieldWrap.height = '9.7rem';
				styleSendButton.bottom = '3.6rem';
				styleTextField.paddingBottom = '1rem';
				break;
			default:
				break;
		}

		this.setState({
			textValue: e.target.value
		});
	}

	sendMessage(e) {
		styleSendButton.backgroundColor = 'rgba(255, 255, 255, 0.0)';
		styleUl.paddingBottom = '1rem';
		styleTextFieldWrap.height = '4.25rem';
		styleSendButton.bottom = '1.2rem';
		styleTextField.paddingBottom = '0';

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
			let wsSendMessage = {
				user_id: sessionStorage.user.id,
				username: name,
				type:1,
				message: encodeURI(this.state.textValue),
			}
			var wsSendJsonData = JSON.stringify(wsSendMessage);
			console.log(wsSendJsonData);
			ws.send(wsSendJsonData);
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
			color: window.textColor1,
		},
		timeRight: {
			fontSize: '0.6em',
			color: window.textColor1,
			float: 'right',
			marginTop: '10px',
		},
		timeLeft: {
			fontSize: '0.6em',
			color: window.textColor1,
			float: 'left',
			marginTop: '10px',
		},
		date: {
			fontSize: '0.6em',
			color: '#efefef',
			width: 'auto',
			wordBreak: 'break-all',
			backgroundColor: window.bgColor2,
			border: '0px solid #777',
			borderRadius: '15px',
			padding: '5px 10px',
			margin: '-12px 0 20px 43%',
			textAlign: 'center',
			clear: 'both',
			float: 'left',
		},
		dateLi: {
			marginTop: '30px',
		},
		hr: {
			width: '100%',
			borderTop: '1px solid',
			borderColor: window.bgColor2,
		},
	};
	var indents = [];
		return (
			<section>
				<HeadRoom
					style={styles.headroom}
				>
					<AppBar
						title={mentoringTitle}
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
									return <span key={"data_" + i}>{line}<br /></span>;
								});
								if (workmmdd != messages[i].registerd_mmdd) {
									indents.push(<li key={messages[i].registerd_mmdd} style={styles.dateLi}><p style={styles.date}>{messages[i].registerd_mmdd}</p><div style={styles.hr} /><p style={styles.clearBalloon}></p></li>)
								}
								workmmdd = messages[i].registerd_mmdd;
								if (messages[i].user_id == sessionStorage.user.id) {
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
				<FlatButton icon={<ContentSend color={window.textColor1} />} primary={true} style={styleSendButton} onTouchTap={this.sendMessage} />
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

