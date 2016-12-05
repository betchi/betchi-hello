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
import QuestionAnswerIcon from 'material-ui/svg-icons/action/question-answer';
import ContentAddBoxIcon from 'material-ui/svg-icons/content/add-box';
import FaceIcon from 'material-ui/svg-icons/action/face';
import VideoCallIcon from 'material-ui/svg-icons/av/video-call';
import VideoCamIcon from 'material-ui/svg-icons/av/videocam';
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
		switch (value) {
		case "top":
			this.context.router.push('/top');
			break;
		case "search":
			this.context.router.push('/search');
			break;
		case "add":
			this.context.router.push('/mentoring/new');
			break;
		case "message":
			this.context.router.push('/roomList');
			break;
		case "mypage":
			this.context.router.push('/mypage/' + sessionStorage.user.id);
			break;
		case "videoCall":
			webkit.messageHandlers.startMentorVideoChat.postMessage('hogehoge');
			break;
		case "videoCam":
			webkit.messageHandlers.startFollowerVideoChat.postMessage('hogehoge');
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
			tabContentAdd: {
			},
			iconContentAdd: {
			},
		}
		/*
				<Tab
					icon={<SearchIcon />}
					value={"search"}
					style={styles.tab}
				/>
		*/

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
					icon={<ContentAddBoxIcon iconStyle={styles.iconContentAdd} />}
					value={"add"}
					style={styles.tabContentAdd}
				/>
				<Tab
					icon={<QuestionAnswerIcon />}
					value={"message"}
					style={styles.tab}
				/>
				<Tab
					icon={<FaceIcon />}
					value={"mypage"}
					style={styles.tab}
				/>
				<Tab
					icon={<VideoCallIcon />}
					value={"videoCall"}
					style={styles.tab}
				/>
				<Tab
					icon={<VideoCamIcon />}
					value={"videoCam"}
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
