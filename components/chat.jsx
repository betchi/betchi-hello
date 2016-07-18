import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, History, hashHistory} from 'react-router';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import AppBar from 'material-ui/AppBar';
import Snackbar from 'material-ui/Snackbar';
import ActionSearch from 'material-ui/svg-icons/action/search';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Avatar from 'material-ui/Avatar';
import Subheader from 'material-ui/Subheader';
import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';
import TextField from 'material-ui/TextField';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Time from 'react-time';
import Scroll from 'react-scroll';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';

import HeadRoom from 'react-headroom';

import {DrawerMenu} from './menu.jsx';

const iconButtonElement = (
  <IconButton
    touch={true}
    tooltip="more"
    tooltipPosition="bottom-left"
  >
    <MoreVertIcon color={grey400} />
  </IconButton>
);

const rightIconMenu = (
  <IconMenu iconButtonElement={iconButtonElement}>
    <MenuItem>Reply</MenuItem>
    <MenuItem>Forward</MenuItem>
    <MenuItem>Delete</MenuItem>
  </IconMenu>
);

var ws;
var self;

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
    self = this;
	}

	componentDidMount() {
	}

	componentWillReceiveProps(nextProps) {
	}

  componentWillMount() {
    ws = new WebSocket("wss://ws-mentor.fairway.ne.jp/entry");

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
    };

    ws.onmessage = function(e) {
      var model = eval("("+e.data+")")
      console.log(model);
      var newMessages = self.state.messages.slice();    
      newMessages.push({user_id: model.user_id, name: model.name, message: model.message, registerd_at: model.registerd_at});
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
	}

	onScroll(e) {
	}

	onDrawerToggle(e) {
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
      let wsSendMessage = "{\"user_id\":1,\"name\":\"みのべ\",\"message\":\""+this.state.textValue+"\"}";
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

	render() {
		const styles = {
      ul: {
        paddingLeft: 0,
        marginBottom: '70px',
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
        margin: '5px 50px 5px 60px',
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
      textFieldWrap: {
        margin: '10px',
      },
		};
    var indents = [];
		return (
			<section>
				<HeadRoom
					style={styles.headroom}
				>
					<AppBar
						title='チャット'
						titleStyle={styles.title}
						iconElementRight={
							<IconButton
								onTouchTap={this.onSearchOpen}
							>
								<ActionSearch />
							</IconButton>
						}
					/>
				</HeadRoom>
        <ul style={styles.ul}>
          {(() => {
            if (Array.isArray(this.state.messages)) {
              let indents = [];
              let messages = this.state.messages;
              for (var i = 0; i < messages.length; i++) {
                if (messages[i].user_id == 1) { // 自分のメッセージ
                  indents.push(<li><p style={styles.rightBalloon}>{messages[i].message}</p><div style={styles.timeRight}><Time value={messages[i].registerd_at} format="hh:mm" /></div><p style={styles.clearBalloon}></p></li>);
                } else {
                  indents.push(<li><Avatar style={styles.avatar} src={messages[i].avatar_url} /><p style={styles.senderName}>{messages[i].name}</p><p style={styles.leftBalloon}>{messages[i].message}</p><div style={styles.timeLeft}><Time value={messages[i].registerd_at} format="hh:mm" /></div><p style={styles.clearBalloon}></p></li>);
                }
              }
              Scroll.animateScroll.scrollToBottom({duration: 0});
              return indents;
            }
          })()}
        </ul>
        <TextField
          style={styles.textField}
          multiLine={true}
          rows={1}
          value={this.state.textValue}
          onChange={this.changeText}
        />
        <RaisedButton
          icon={<i class="material-icons">send</i>}
          style={styles.sendButton}
          onTouchTap={this.sendMessage}
        />
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

