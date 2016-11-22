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
import ContentSend from 'material-ui/svg-icons/content/send';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

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
	color: '#212121',
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
var mentoring;
var rightIconTitleOk = "このユーザに決定";
var rightIconTitleCancel = "このユーザをキャンセル";
var dialogMessageOk = "このユーザとメンタリングしますか？";
var dialogMessageCancel = "このユーザとのメンタリングをキャンセルしますか？";

export class ChatPage extends React.Component {

	constructor(props, context) {
		super(props, context);

		this.state = {
			messages: [],
			snack: {
				open: false,
				message: '',
			},
			dialog: {
				open: false,
			},
		};
		this.onSnackClose = this.onSnackClose.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
		this.changeText = this.changeText.bind(this);
		this.onBack = this.onBack.bind(this);
		this.onOffer = this.onOffer.bind(this);
		this.dialogHandleClose = this.dialogHandleClose.bind(this);
		this.dialogHandleOpen = this.dialogHandleOpen.bind(this);

		self = this;
	}

	componentWillMount() {
		styleTextFieldWrap.backgroundColor = this.context.colors.bg2;
		offerUserId = this.props.params.offerUserId;
		mentoringId = this.props.params.mentoringId;
		mentoringTitle = this.props.params.mentoringTitle;

		this.getMentoring(mentoringId);

		name = sessionStorage.user.username;
		isDoneFirstShow = false;
		var wsDomain = "ws-mentor.fairway.ne.jp";
		if (process.env.NODE_ENV == "staging") {
			wsDomain = "minobe-ws-mentor.fairway.ne.jp";
		}
		ws = new WebSocket("wss://" + wsDomain + "/room/" + mentoringId + "/user/" + sessionStorage.user.id + "/code/" + mentoringId + "-" + offerUserId);

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
		styleTextFieldWrap.backgroundColor = this.context.colors.bg2,
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

	onOffer(action) {
		console.log("onOffer");
		console.log(action);
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
			if (data.mentoring.determinations !== null &&
				data.mentoring.determinations.indexOf(parseInt(this.props.location.query.targetUserId)) >= 0) {
				this.setState({
					rightIconMessage: rightIconTitleCancel,
					rightIconAction: "remove",
					dialogMessage: dialogMessageCancel,
				});
			} else {
				this.setState({
					rightIconMessage: rightIconTitleOk,
					rightIconAction: "all",
					dialogMessage: dialogMessageOk,
				});
			}
		}
		var mentoring = {
			id: parseInt(mentoringId),
			determinations: [parseInt(this.props.location.query.targetUserId)]
		};
		const json = JSON.stringify({
			action: action,
			mentoring:mentoring
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

	getMentoring(id) {
		let xhr = new XMLHttpRequest();
		xhr.open('GET', '/api/mentoring/' + id, false);
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
			mentoring = data.mentoring;
			if (data.mentoring.determinations !== null &&
				data.mentoring.determinations.indexOf(parseInt(this.props.location.query.targetUserId)) >= 0) {
				this.setState({
					rightIconMessage: rightIconTitleCancel,
					rightIconAction: "remove",
					dialogMessage: dialogMessageCancel,
				});
			} else {
				this.setState({
					rightIconMessage: rightIconTitleOk,
					rightIconAction: "all",
					dialogMessage: dialogMessageOk,
				});
			}
		}
		xhr.send();
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
			personAdd: {
				marginTop: '0.4rem',
				fontWeight: '1000',
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
				color: this.context.colors.white,
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
				color: this.context.colors.black,
			},
			timeRight: {
				fontSize: '0.6em',
				color: this.context.colors.black,
				float: 'right',
				marginTop: '10px',
			},
			timeLeft: {
				fontSize: '0.6em',
				color: this.context.colors.black,
				float: 'left',
				marginTop: '10px',
			},
			date: {
				fontSize: '0.6em',
				color: this.context.colors.black,
				width: 'auto',
				wordBreak: 'break-all',
				backgroundColor: this.context.colors.lightGrey,
				border: '0px solid ' + this.context.colors.lightGrey,
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
				borderColor: this.context.colors.lightGrey,
			},
		};

		var rightIcon = null;
		if (this.props.location.query.mentoringUserId == sessionStorage.user.id) {
			rightIcon = <FlatButton
				style={styles.personAdd}
				primary={true}
				label={this.state.rightIconMessage}
				onTouchTap={this.dialogHandleOpen}
			/>;
		}
		var indents = [];

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
			onTouchTap={this.onOffer.bind(this, this.state.rightIconAction)}
		  />,
		];

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
						iconElementRight={rightIcon}
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
				<FlatButton icon={<ContentSend color={this.context.colors.white} />} primary={true} style={styleSendButton} onTouchTap={this.sendMessage} />
				<Dialog
					title="確認"
					actions={actions}
					modal={false}
					open={this.state.dialog.open}
					onRequestClose={this.dialogHandleClose}
				>
					{this.state.dialogMessage}
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
}
ChatPage.contextTypes = {
	router: React.PropTypes.object.isRequired,
	colors: React.PropTypes.object.isRequired,
	targetUserId: React.PropTypes.number.isRequired,
	mentoringUserId: React.PropTypes.number.isRequired,
}

