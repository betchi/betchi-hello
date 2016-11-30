import React from 'react';

import {List, ListItem} from 'material-ui/List';
import Snackbar from 'material-ui/Snackbar';
import Avatar from 'material-ui/Avatar';

import {Tabbar} from '../components/Tabbar.jsx';

export class UserRoomListPage extends React.Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			snack: {
				open: false,
				message: '',
			},
			talkList: null,
		};
	}

	componentWillReceiveProps() {
		this.setState({
			talkList: this.props.talkList,
		});
	}

	onItemTap(roomId, title) {
		let mentoringId;
		let targetUserIds = [];
		//if (this.props.mentoringId !== undefined) {
		//	mentoringId = this.props.mentoringId;
		//} else {
			let rooms = sessionStorage.user.rooms;
			for (let searchMentoringId in rooms) {
				for (let userId in rooms[searchMentoringId]) {
					if (rooms[searchMentoringId][userId] == roomId) {
						mentoringId = searchMentoringId;
						targetUserIds.push(userId);
					}
				}
			}
			//}
		let mentoring = this.getMentoring(mentoringId);
		console.log(mentoring);
		let members = this.getRoomMember(roomId);
		this.context.router.push({
			pathname: '/messages',
			state: {
				roomId: roomId,
				userId: this.props.userId,
				targetUserIds: targetUserIds,
				title: title,
				mentoring: mentoring,
				members: members,
			},
		});
	}

	getMentoring(mentoringId) {
		const xhr = new XMLHttpRequest();
		xhr.open('GET', '/api/mentoring/' + mentoringId, false);
		xhr.send();
		let data = JSON.parse(xhr.responseText);
		return data.mentoring;
	}

	getRoomMember(roomId) {
		const xhr = new XMLHttpRequest();
		xhr.open('GET', this.context.swagchat.config.apiBaseUrl + '/rooms/' + roomId + '/members', false);
		xhr.send();
		let data = JSON.parse(xhr.responseText);
		if (data.members !== undefined) {
			let members = {}
			for (var i = 0; i < data.members.length; i++) {
				members[data.members[i].userId] = data.members[i];
			}
			return members;
		}
	}

	render() {
    const styles = {
      time: {
        width: '2.5rem',
        textAlign: 'right',
        fontSize: '0.8em',
      },
    }

		return (
      <section>
				<List>
				{(() => {
					if (Array.isArray(this.props.talkList)) {
						let userRoomList = [];
						for (var i = 0; i < this.props.talkList.length; i++) {
							if (this.props.talkList[i].lastMessageUpdated === undefined) {
								continue;
							}
							var timestamp = Math.floor(this.props.talkList[i].created / 1000000) + new Date().getTimezoneOffset();
							var date = new Date(timestamp);
							var mmdd = (date.getMonth() + 1) + "/" + date.getDate();
							var hhmm = date.getHours() + ":" + ('0' + date.getMinutes()).slice( -2 );
							userRoomList.push(
								<ListItem
									key={i}
									primaryText={this.props.talkList[i].name}
									secondaryText={this.props.talkList[i].lastMessage}
									secondaryTextLines={2}
									leftAvatar={<Avatar src={this.props.talkList[i].pictureUrl} />}
									onTouchTap={this.onItemTap.bind(this, this.props.talkList[i].roomId, this.props.talkList[i].name)}
									rightIcon={<p style={styles.time}>{mmdd} {hhmm}</p>}
								/>
							);
						}
						return userRoomList;
					}
				})()}
				</List>
				<Snackbar
					open={this.state.snack.open}
					message={this.state.snack.message}
					autoHideDuration={4000}
					onRequestClose={this.onSnackClose}
				/>
			</section>
		);
	}
};
UserRoomListPage.contextTypes = {
	router: React.PropTypes.object.isRequired,
	swagchat: React.PropTypes.object.isRequired,
}
UserRoomListPage.propTypes = {
	talkList: React.PropTypes.array.isRequired,
	userId: React.PropTypes.string.isRequired,
}
