import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, History, hashHistory} from 'react-router';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import {Card} from 'material-ui/Card';
import {Tabs, Tab} from 'material-ui/Tabs';
import AppBar from 'material-ui/AppBar';
import ActionSearch from 'material-ui/svg-icons/action/search';
import Snackbar from 'material-ui/Snackbar';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Avatar from 'material-ui/Avatar';
import Subheader from 'material-ui/Subheader';
import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import HeadRoom from 'react-headroom';

import {DrawerMenu} from './menu.jsx';
import {MentoringList} from './content.jsx';

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

export class ChatPage extends React.Component {
	constructor(props, context) {
		super(props, context);
	}

	componentDidMount() {
	}

	componentWillReceiveProps(nextProps) {
	}

  componentWillMount() {
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
  }

	componentWillUnmount() {
	}

	onScroll(e) {
	}

	onDrawerToggle(e) {
	}

	onSearchOpen(e) {
	}

	onSnackClose(e) {
	}

	render() {
		const styles = {
      ul: {
        paddingLeft: 0,
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
      },
      sendButton: {
        marginRight: '20',
        position: 'fixed',
        bottom: '10px',
        right: '0',
        marginRight: '10px',
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
              let messages = this.state.messages;
              for (var i = 0; i < messages.length; i++) {
                if (messages[i].user_id == 1) { // 自分のメッセージ
                  indents.push(<li><p style={styles.rightBalloon}>{messages[i].message}</p><p style={styles.clearBalloon}></p></li>);
                } else {
                  indents.push(<li><Avatar style={styles.avatar} src="avatar.jpg" /><p style={styles.senderName}>leftname</p><p style={styles.leftBalloon}>{messages[i].message}</p><p style={styles.clearBalloon}></p></li>);
                }
              }
              return indents;
            }
          })()}
        </ul>
        <TextField
          style={styles.textField}
          multiLine={true}
          rows={1}
        />
        <FloatingActionButton style={styles.sendButton}>
          <ContentAdd />
        </FloatingActionButton>
			</section>
		);
	}
}
ChatPage.contextTypes = {
	router: React.PropTypes.object.isRequired
}

