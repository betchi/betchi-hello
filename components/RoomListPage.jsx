import React from 'react';

import HeadRoom from 'react-headroom';
import AppBar from 'material-ui/AppBar';

import {Tabbar} from './Tabbar.jsx';
import {UserRoomListPage} from '../swagchat/UserRoomListPage.jsx';

export class RoomListPage extends React.Component {

  constructor(props) {
    super(props)
		this.state = {
			talkList: null,
		};
  }

	componentWillMount() {
		this.getUserRoom()
		this.updateUserSession();
	}

	updateUserSession() {
		const xhr = new XMLHttpRequest();
		xhr.open('GET', '/api/user/' + sessionStorage.user.id, false); // synchronous
		xhr.send();
		if (xhr.status !== 200) {
			return;
		}
		const data = JSON.parse(xhr.responseText);
		if (!data.ok) {
			goLogin();
			return
		}
		sessionStorage.user = data.user;
	}

	getUserRoom() {
		let xhr = new XMLHttpRequest();
		xhr.open('GET', this.context.swagchat.config.apiBaseUrl + '/users/' + sessionStorage.user.swagchat_id + '/rooms');
		xhr.onload = () => {
			if (xhr.status !== 200) {
				this.setState({
					snack: {
						open: true,
						message: 'オファーの読み込みに失敗しました。',
					},
				});
				return;
			}
			let data = JSON.parse(xhr.responseText);
			if (data.rooms.length === 0) {
				this.setState({
					snack: {
						open: true,
						message: '検索ヒット0件です。',
					},
				});
				return;
			}
			this.setState({
				talkList: data.rooms,
			});
		};
		xhr.send();
	}

	render() {
		return (
			<div>
				<HeadRoom>
					<AppBar
						title="メッセージ"
						showMenuIconButton={false}
						titleStyle={{textAlign: 'center'}}
					/>
				</HeadRoom>
				<UserRoomListPage talkList={this.state.talkList} userId={sessionStorage.user.swagchat_id} />
				<Tabbar value={"message"} />
			</div>
		);
	}
};
RoomListPage.contextTypes = {
	router: React.PropTypes.object.isRequired,
	swagchat: React.PropTypes.object.isRequired,
}
