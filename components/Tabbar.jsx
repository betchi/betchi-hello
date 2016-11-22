import React from 'react';
import ReactDOM from 'react-dom';

import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import {Tabs, Tab} from 'material-ui/Tabs';
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import ActionAndroid from 'material-ui/svg-icons/action/android';
import HomeIcon from 'material-ui/svg-icons/action/home';
import SearchIcon from 'material-ui/svg-icons/action/search';
import QuestionAnswerIcon from 'material-ui/svg-icons/action/question-answer.js';
import NotificationNoneIcon from 'material-ui/svg-icons/social/notifications-none';
import FaceIcon from 'material-ui/svg-icons/action/face';
import {indigo500, indigo900, blue50} from 'material-ui/styles/colors';

export class Tabbar extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
	  		selectedIndex: 0,
		};
		this.onChange = this.onChange.bind(this);
	}

	onChange(value) {
		console.log(value)
		switch (value) {
		case "top":
			this.context.router.push('/top');
			break;
		case "search":
			this.context.router.push('/search');
			break;
		case "message":
			//webkit.messageHandlers.startMentorVideoChat.postMessage('hogehoge');
			break;
		case "notification":
			//webkit.messageHandlers.startFollowerVideoChat.postMessage('hogehoge');
			break;
		case "mypage":
			this.context.router.push('/mypage/' + sessionStorage.user.id);
			break;
		default:
			break;
		}
	}

	render() {
		const styles = {
			tabs: {
				position: 'fixed',
				bottom: '0',
				width: '100%',
				zIndex: '1000',
				borderTop: '1px solid ' + this.context.colors.lightGrey,
			},
			tab: {
			},
		}

		return (
			<Tabs
				style={styles.tabs}
				inkBarStyle={{backgroundColor:window.borderColor1}}
				onChange={this.onChange}
				value={this.props.value}
			>
				<Tab
					icon={<HomeIcon />}
					value={"top"}
					style={styles.tab}
				/>
				<Tab
					icon={<SearchIcon />}
					value={"search"}
					style={styles.tab}
				/>
				<Tab
					icon={<QuestionAnswerIcon />}
					value={"message"}
					style={styles.tab}
				/>
				<Tab
					icon={<NotificationNoneIcon />}
					value={"notification"}
					style={styles.tab}
				/>
				<Tab
					icon={<FaceIcon />}
					value={"mypage"}
					style={styles.tab}
				/>
			</Tabs>
		)
	}
}
Tabbar.contextTypes = {
	router: React.PropTypes.object.isRequired,
	colors: React.PropTypes.object.isRequired,
}

