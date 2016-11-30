import React from 'react';

import HeadRoom from 'react-headroom';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';

import {Tabbar} from './Tabbar.jsx';
import {UserRoomListPage} from '../swagchat/UserRoomListPage.jsx';

export class OfferListPage extends React.Component {
  constructor(props) {
    super(props)
		this.state = {
			talkList: null,
		};
  }

	componentWillMount() {
		async function asyncFunc(self) {
			await self.updateUserSession()
			await self.getUserRoom()
		}
		asyncFunc(this);
	}

	updateUserSession() {
		new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open('GET', '/api/user/' + sessionStorage.user.id, false); // synchronous
			xhr.onload = () => {
				if (xhr.status !== 200) {
					return;
				}
				const data = JSON.parse(xhr.responseText);
				if (!data.ok) {
					goLogin();
					return
				}
				sessionStorage.user = data.user;
			};
			xhr.send();
		});
	}

	getUserRoom() {
		new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open('GET', this.context.swagchat.config.apiBaseUrl + '/users/' + sessionStorage.user.swagchat_id + '/rooms');
			xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
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
				let talkList = [];
				for (let i = 0; i < data.rooms.length; i++) {
					if (sessionStorage.user.rooms[this.props.location.query.mentoringId].indexOf(data.rooms[i].roomId) >= 0) {
						talkList.push(data.rooms[i]);
					}
				}
				this.setState({
					talkList: talkList,
				});
			};
			xhr.send();
		});
	}

	onBack() {
		this.context.router.goBack();
	}

	render() {
		return (
			<div>
				<HeadRoom>
					<AppBar
						title="オファーリスト"
						iconElementLeft={
							<IconButton
								onTouchTap={this.onBack.bind(this)}
							>
								<NavigationArrowBack />
							</IconButton>
						}
					/>
				</HeadRoom>
				<UserRoomListPage talkList={this.state.talkList} userId={sessionStorage.user.swagchat_id} />
			</div>
		);
	}
};
OfferListPage.contextTypes = {
	router: React.PropTypes.object.isRequired,
	swagchat: React.PropTypes.object.isRequired,
}
