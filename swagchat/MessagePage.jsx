import React from 'react';
import ReactDOM from 'react-dom';

import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import ContentSend from 'material-ui/svg-icons/content/send';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ArrowDownward from 'material-ui/svg-icons/navigation/arrow-downward';
import InsertEmotion from 'material-ui/svg-icons/editor/insert-emoticon';
import ViewModule from 'material-ui/svg-icons/action/view-module';
import Avatar from 'material-ui/Avatar';
import HeadRoom from 'react-headroom';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import Scroll from 'react-scroll';
import {Menu} from './component/Menu.jsx';

var self;
var ws;

const textFieldStyleBottom = '10px';
const styleUlPaddingBottom = '1rem';
const textFieldStyleWrapHeight = '68px';
const buttonStyleBottom = '1.2rem';

export class MessagePage extends React.Component {
	constructor(props, context) {
		super(props, context);

		self = this;

   	ws = new WebSocket(this.context.swagchat.config.wsBaseUrl);

		ws.onopen = function(e) {
			console.log("onopen");
			console.log(ws);

			if (ws.readyState === 1) {
				let postJson = {
					roomId: self.props.location.state.roomId
				};
				ws.send(JSON.stringify(postJson));
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
		};

		ws.onerror = function(e) {
			console.log("onerror");
			console.log(ws);
		};

    ws.onclose = function(e) {
      console.log("onclose");
		}

    ws.onmessage = function(e) {
      console.log("onmessage");
			let message = JSON.parse(e.data);
			let newMessages = self.state.messages;
			newMessages[message.messageId] = message;
			self.setState({
				messages: newMessages,
			});
		}

		this.state = {
			messages: [],
			snack: {
				open: false,
				message: '',
			},
			isDoneFirstShow: false,
			isContentAddOpen: false,
			isMenuDisplay: false,
			isInsertEmotionOpen: false,
			isStickerDisplay: false,
			styles: {
				styleUl: {
					paddingLeft: 0,
					paddingBottom: '1rem',
					marginBottom: '70px',
					listStyleType: 'none',
				},
				textFieldStyleWrap: {
					position: 'fixed',
					bottom: '0',
					width: '100%',
					height: textFieldStyleWrapHeight,
					backgroundColor: '#efefef',
				},
				textFieldStyle: {
					position: 'fixed',
					bottom: textFieldStyleBottom,
					marginTop: '0px',
					marginLeft: '40px',
					backgroundColor: 'rgb(245, 245, 245)',
					width: '77%',
					clear: 'both',
					border: '0px solid #777',
					borderRadius: '5px',
					color: '#212121',
				},
				contentAddStyle: {
					position: 'fixed',
					bottom: buttonStyleBottom,
					left: '0',
					minWidth: '40px',
					height: '2rem',
					lineHeight: '2rem',
				},
				insertEmotionStyle: {
					position: 'fixed',
					bottom: buttonStyleBottom,
					left: '78%',
					minWidth: '40px',
					height: '2rem',
					lineHeight: '2rem',
				},
				contentSendStyle: {
					position: 'fixed',
					bottom: buttonStyleBottom,
					right: '0',
					minWidth: '40px',
					height: '2rem',
					lineHeight: '2rem',
				},
			},
		};

		this.changeText = this.changeText.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
		this.insertEmotion = this.insertEmotion.bind(this);
		this.contentAdd = this.contentAdd.bind(this);
		this.fileuploadComplete = this.fileuploadComplete.bind(this);
		this.onBack = this.onBack.bind(this);
	}

  componentWillMount() {
		console.log("componentWillMount");
		async function asyncFunc(self) {
			await self.getMessage();
			await self.getStickers();
		}
		asyncFunc(this);
	}

	getMessage() {
		new Promise((resolve, reject) => {
			let xhr = new XMLHttpRequest();
			xhr.open('GET', this.context.swagchat.config.apiBaseUrl + '/rooms/' + this.props.location.state.roomId + '/messages');
			xhr.onload = () => {
				if (xhr.status !== 200) {
					this.setState({
						snack: {
							open: true,
							message: '読み込みに失敗しました。',
						},
					});
					return;
				}
				let data = JSON.parse(xhr.responseText);
				if (data.messages !== undefined) {
					let mapMessages = {}
					for (var i = 0; i < data.messages.length; i++) {
						mapMessages[data.messages[i].messageId] = data.messages[i];
					}
					let messages = data.messages;
					this.setState({
						messages: mapMessages,
						isDoneFirstShow: true,
					});
				}
			};
			xhr.send();
		});
	}

	getStickers() {
		new Promise((resolve, reject) => {
			let xhr = new XMLHttpRequest();
			xhr.open('GET', this.context.swagchat.config.apiBaseUrl + '/stickers');
			xhr.onload = () => {
				if (xhr.status !== 200) {
					this.setState({
						snack: {
							open: true,
							message: '読み込みに失敗しました。',
						},
					});
					return;
				}
				let data = JSON.parse(xhr.responseText);
				let sticker;
				if (data.stickers !== undefined) {
					for (var i = 0; i < data.stickers.length; i++) {
						this.getSticker(data.stickers[i].stickerId);
						sticker = JSON.parse(localStorage.getItem("sticker-" + data.stickers[i].stickerId));
						for (var j = 0; j < sticker.items.length; j++) {
							localStorage.setItem("sticker-item-" + sticker.items[j].stickerItemId, sticker.items[j].base64Encode);
						}
					}
				}
			};
			xhr.send();
		});
  }

	getSticker(stickerId) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', this.context.swagchat.config.apiBaseUrl + '/stickers/' + stickerId, false);
    xhr.onload = () => {
      if (xhr.status !== 200) {
        this.setState({
          snack: {
            open: true,
            message: '読み込みに失敗しました。',
          },
        });
        return;
      }
      let data = JSON.parse(xhr.responseText);
			if (data !== undefined) {
				localStorage.setItem("sticker-" + stickerId, JSON.stringify(data));
			}
    };
		xhr.send();
	}

  componentWillUnmount() {
		console.log("componentWillUnmount");
    ws.close();

		let styles = this.state.styles;
    styles.styleUl.paddingBottom = styleUlPaddingBottom;
    styles.textFieldStyleWrap.height = textFieldStyleWrapHeight;
    styles.contentSendStyle.bottom = buttonStyleBottom;
    self.setState({
      textValue: "",
			styles: styles,
    });
  }

  componentDidMount() {
		Scroll.animateScroll.scrollToBottom({duration: 0});
	}

	componentDidUpdate() {
		Scroll.animateScroll.scrollToBottom({duration: 0});
	}

	sendMessage(e) {
		async function asyncFunc(self) {
			var message = self.state.textValue.replace(/\s|\n|　/g, "");
			if (message === "") {
				return;
			}

			let messageInfo = {
				roomId: self.props.location.state.roomId,
				userId: self.props.location.state.userId,
				messages: [
					{
						type: "text",
						payload: {
							text: self.state.textValue,
						}
					}
				]
			};
			await self.postMessage(messageInfo);

			if (self.props.location.state.mentoring.id !== undefined &&
					self.props.location.state.mentoring.user_id !== sessionStorage.user.id) {
				let offerInfo = {
					user_id: sessionStorage.user.id,
					message: self.state.textValue
				}
				await self.postOffer(offerInfo);
			}
		}
		asyncFunc(self);
	}

	postMessage(messageInfo) {
		console.log("postMessage");
		new Promise((resolve, reject) => {
			let styles = self.state.styles;
			styles.contentSendStyle.backgroundColor = 'rgba(255, 255, 255, 0.0)';
			styles.styleUl.paddingBottom = styleUlPaddingBottom;
			styles.textFieldStyleWrap.height = textFieldStyleWrapHeight;
			styles.contentAddStyle.bottom = buttonStyleBottom;
			styles.contentSendStyle.bottom = buttonStyleBottom;

			let xhr = new XMLHttpRequest();
			xhr.open('POST', this.context.swagchat.config.apiBaseUrl + '/messages');
			xhr.onload = () => {
				if (xhr.status !== 201) {
					this.setState({
						snack: {
							open: false,
							message: '送信に失敗しました。',
						},
					});
					return;
				}
				let data = JSON.parse(xhr.responseText);

				var newMessages = this.state.messages;	
				let messageId = data.messageIds[0];
				let json = {
					messageId: messageId,
					userId: this.props.location.state.userId,
					type: "text",
					payload: {
						text: this.state.textValue,
					},
					created: new Date().getTime() * 1000000
				};
				newMessages[messageId] = json;
				this.setState({
					messages: newMessages,
					textValue: "",
					styles: styles,
				});
			};
			xhr.onerror = function() {
				console.log(xhr);
			};
			xhr.setRequestHeader("Content-type", "application/json");
			xhr.send(JSON.stringify(messageInfo));
		});
	}

	postOffer(offerInfo) {
		console.log("postOffer");
		new Promise((resolve, reject) => {
			let xhr = new XMLHttpRequest();
			xhr.open('POST', '/api/offers/' + this.props.location.state.mentoring.id);
			xhr.onload = () => {
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
			}
			xhr.onerror = function() {
				console.log(xhr);
			};
			xhr.setRequestHeader("Content-type", "application/json");
			xhr.send(JSON.stringify(offerInfo));
		});
	}

	contentAdd() {
		let styles = this.state.styles;
		styles.contentAddStyle.backgroundColor = 'rgba(255, 255, 255, 0.0)';
		this.heightUp(this.state.isContentAddOpen, 80);
    self.setState({
			isContentAddOpen: !this.state.isContentAddOpen,
			isMenuDisplay: !this.state.isMenuDisplay,
			isInsertEmotionOpen: false,
			isStickerDisplay: false,
    });
	}

	insertEmotion(e) {
		let styles = this.state.styles;
		styles.insertEmotionStyle.backgroundColor = 'rgba(255, 255, 255, 0.0)';
		this.heightUp(this.state.isInsertEmotionOpen, 200);
    self.setState({
			isContentAddOpen: false,
			isMenuDisplay: false,
			isInsertEmotionOpen: !this.state.isInsertEmotionOpen,
			isStickerDisplay: !this.state.isStickerDisplay,
    });
	}

	heightUp(isOpen, baseHeight) {
		let styles = this.state.styles;
		if (isOpen) {
			styles.textFieldStyle.bottom = textFieldStyleBottom;
			styles.styleUl.paddingBottom = styleUlPaddingBottom;
			styles.textFieldStyleWrap.height = textFieldStyleWrapHeight;
			styles.contentAddStyle.bottom = buttonStyleBottom;
			styles.insertEmotionStyle.bottom = buttonStyleBottom;
			styles.contentSendStyle.bottom = buttonStyleBottom;
		} else {
			styles.textFieldStyle.bottom = baseHeight + 'px';
			styles.styleUl.paddingBottom = (baseHeight + 22) + 'px';
			styles.textFieldStyleWrap.height = (baseHeight + 60) + 'px';
			styles.contentAddStyle.bottom = (baseHeight + 9) + 'px';
			styles.insertEmotionStyle.bottom = (baseHeight + 9) + 'px';
			styles.contentSendStyle.bottom = (baseHeight + 9) + 'px';
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

	changeText(e) {
		let heightString = ReactDOM.findDOMNode(this.refs.textField).style.height;
		let heightInt = parseInt(heightString.replace(/px/g, ''), 10);
		let styles = this.state.styles;
		styles.textFieldStyle.bottom = textFieldStyleBottom;
		styles.textFieldStyleWrap.height = (heightInt + 20) + 'px';
		styles.styleUl.paddingBottom = heightString;
		styles.contentAddStyle.bottom = (heightInt / 2 - 5) + 'px';
		styles.insertEmotionStyle.bottom = (heightInt / 2 - 5) + 'px';
		styles.contentSendStyle.bottom = (heightInt / 2 - 5) + 'px';
		this.setState({
			styles: styles,
			isContentAddOpen: false,
			isMenuDisplay: false,
			isInsertEmotionOpen: false,
			isStickerDisplay: false,
			textValue: e.target.value,
		});
	}

	fileuploadComplete() {
		console.log("fileuploadComplete");
		this.contentAdd();

		/*
		var newMessages = this.state.messages;	
		let json = {
      userId: this.props.params.userId,
			type: "image",
			payload: {
				assetId: "",
			},
      created: new Date().getTime() * 1000000,
      userName: "minobe",
      userPictureUrl: "http://www.material-ui.com/images/adhamdannaway-128.jpg"
    };
		newMessages.push(json);
		console.log(newMessages);
		this.setState({
			messages: newMessages,
		});
		*/
	}

	onBack() {
		this.context.router.goBack();
	}

  render() {
		const styles = {
			textFieldInputStyle: {
				backgroundColor: 'white',
			},
			textFieldTextareaStyle: {
				backgroundColor: 'white',
				paddingLeft: '5px',
				paddingRight: '30px',
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
				color: '#F5F5F5',
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
				marginBottom: '30px',
			},
			senderName: {
				fontSize: '0.6em',
				marginTop: '-40px',
				marginLeft: '70px',
				marginBottom: '-5px',
				color: '#212121',
			},
			messageLeft: {
				float: 'left',
			},
			messageRight: {
				float: 'right',
			},
			timeLeft: {
				fontSize: '0.6em',
				color: '#212121',
				marginTop: '10px',
				float: 'left',
			},
			timeRight: {
				fontSize: '0.6em',
				color: '#212121',
				marginTop: '10px',
				float: 'right',
			},
			date: {
				fontSize: '0.6em',
				color: '#212121',
				width: 'auto',
				wordBreak: 'break-all',
				backgroundColor: '#E0E0E0',
				border: '0px solid #E0E0E0',
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
				borderColor: '#E0E0E0',
			},
			messageSticker: {
				marginTop: '20px',
				marginLeft: '20px',
				width: '40%',
				clear: 'both',
				float: 'left',
			},
			leftImage: {
				maxWidth: '45%',
				margin: '-20px 10px 5px 60px',
				borderRadius: '15px',
				clear: 'both',
				float: 'left',
			},
			rightImage: {
				maxWidth: '45%',
				margin: '20px 10px 5px 30px',
				borderRadius: '15px',
				clear: 'both',
				float: 'right',
			},
		}
    return (
      <section>
				<HeadRoom
					style={styles.headroom}
				>
					<AppBar
						title={this.props.location.state.title}
						titleStyle={styles.title}
						iconElementLeft={
							<IconButton
								style={styles.backIcon}
								onTouchTap={this.onBack}
							>
								<NavigationArrowBack />
							</IconButton>
						}
					/>
				</HeadRoom>
				<ul style={this.state.styles.styleUl}>
					{(() => {
						//if (Array.isArray(this.state.messages) && this.state.messages !== undefined) {
						if (this.state.messages !== undefined) {
							let indents = [];
							let messages = this.state.messages;
							let workmmdd = "";
							//for (var i = 0; i < messages.length; i++) {
							for (var key in messages) {
								let j = 1;

								// timestamp
								var timestamp = Math.floor(messages[key].created / 1000000) + new Date().getTimezoneOffset();
								var date = new Date(timestamp);
								var mmdd = (date.getMonth() + 1) + "/" + date.getDate();
								var hhmm = date.getHours() + ":" + ('0' + date.getMinutes()).slice( -2 );
								if (workmmdd !== mmdd) {
									indents.push(
										<li key={"mmdd_" + key} style={styles.dateLi}>
											<p style={styles.date}>{mmdd}</p>
											<div style={styles.hr} />
											<p style={styles.clearBalloon}></p>
										</li>
									);
								}
								workmmdd = mmdd;

								// message
								if (messages[key].type === "text") {
									let textMessage = "";
									if (this.props.location.state.mentoring.user_id === sessionStorage.user.id && messages[key].payload.textForMemtor !== undefined) {
										textMessage = messages[key].payload.textForMemtor;
									} else {
										textMessage = messages[key].payload.text;
									}

									var message = textMessage.split('\n').map(function(line) {
										return <span key={"data_" + j++}>{line}<br /></span>;
									});
									if (messages[key].userId === this.props.location.state.userId) {
										indents.push(
											<li key={key}>
												<p style={styles.rightBalloon}>{message}</p>
												<div style={styles.timeRight}>{hhmm}</div>
												<p style={styles.clearBalloon}></p>
											</li>
										);
									} else {
										indents.push(
											<li key={key}>
												<Avatar style={styles.avatar} src={this.props.location.state.members[messages[key].userId].pictureUrl} />
												<p style={styles.senderName}>{this.props.location.state.members[messages[key].userId].name}</p>
												<div style={styles.leftBalloon}>{message}</div>
												<div style={styles.timeLeft}>{hhmm}</div>
												<p style={styles.clearBalloon}></p>
											</li>
										);
									}
								} else if (messages[key].type === "image") {
									let imageSrc;
/*
									let imgObj = new Image();
									imgObj.onload = function() {
										let reader = new FileReader();
										reader.onload = (function() {
											return function(e) {
												console.log(e.target.result);
											}
										})
										reader.readAsDataURL(imgObj);
									}
									imgObj.src = this.context.swagchat.config.imageBaseUrl + messages[key].payload.assetId;
*/

									imageSrc = this.context.swagchat.config.imageBaseUrl + messages[key].payload.assetId;
									if (messages[key].userId === this.props.location.state.userId) {
										indents.push(
											<li key={key}>
												<img role="presentation" src={imageSrc} style={styles.rightImage} />
												<div style={styles.timeRight}>{hhmm}</div>
												<p style={styles.clearBalloon}></p>
											</li>
										);
									} else {
										indents.push(
											<li key={key}>
												<Avatar style={styles.avatar} src={this.props.location.state.members[messages[key].userId].pictureUrl} />
												<p style={styles.senderName}>{this.props.location.state.members[messages[key].userId].name}</p>
												<p style={styles.clearBalloon}></p>
												<img role="presentation" src={imageSrc} style={styles.leftImage} />
												<div style={styles.timeLeft}>{hhmm}</div>
												<p style={styles.clearBalloon}></p>
											</li>
										);
									}
								} else {
								}
							}
							if (this.state.isDoneFirstShow) {
								Scroll.animateScroll.scrollToBottom({duration: 1500});
							} else {
								Scroll.animateScroll.scrollToBottom({duration: 0});
							}
							return indents;
						}
					})()}
				</ul>
				<div style={this.state.styles.textFieldStyleWrap} ref="textFieldWrap">
					{(() => {
						if (!this.context.swagchat.config.isUseMenu) {
							return;
						}
						if (this.state.isContentAddOpen) {
							return (
								<FlatButton
									icon={<ArrowDownward color="#454545" />}
									style={this.state.styles.contentAddStyle}
									primary={true}
									onTouchTap={this.contentAdd}
								/>
							)
						} else {
							return (
								<FlatButton
									icon={<ContentAdd color="#454545" />}
									style={this.state.styles.contentAddStyle}
									primary={true}
									onTouchTap={this.contentAdd}
								/>
							)
						}
					})()}
					<TextField
						id='textField'
						style={this.state.styles.textFieldStyle}
						multiLine={true}
						underlineShow={false}
						rows={1}
						rowsMax={4}
						defaultValue={this.state.textValue}
						value={this.state.textValue}
						onChange={this.changeText}
						textareaStyle={styles.textFieldTextareaStyle}
						inputStyle={styles.textFieldInputStyle}
						ref="textField"
					/>
					{(() => {
						if (!this.context.swagchat.config.isUseSticker) {
							return;
						}
						if (this.state.isInsertEmotionOpen) {
							return (
								<FlatButton
									icon={<ViewModule color="#454545" />}
									style={this.state.styles.insertEmotionStyle}
									primary={true}
									onTouchTap={this.insertEmotion}
								/>
							)
						} else {
							return (
								<FlatButton
									icon={<InsertEmotion color="#454545" />}
									primary={true}
									style={this.state.styles.insertEmotionStyle}
									onTouchTap={this.insertEmotion}
								/>
							)
						}
					})()}
					<FlatButton
						icon={<ContentSend color="#454545" />}
						primary={true}
						style={this.state.styles.contentSendStyle}
						onTouchTap={this.sendMessage}
					/>
          <Menu
            isMenuDisplay={this.state.isMenuDisplay}
            userId={this.props.location.state.userId}
            roomId={this.props.location.state.roomId}
						mentoring={this.props.location.state.mentoring}
						targetUserIds={this.props.location.state.targetUserIds}
            onTouchTap={this.fileuploadComplete}
          />
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
MessagePage.contextTypes = {
	router: React.PropTypes.object.isRequired,
	swagchat: React.PropTypes.object.isRequired,
	mentoring: React.PropTypes.object.isRequired,
	members: React.PropTypes.array.isRequired,
}
