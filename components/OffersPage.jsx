import React from 'react';
import ReactDOM from 'react-dom';

import {Router, Route, IndexRoute, History, hashHistory} from 'react-router';
import HeadRoom from 'react-headroom';

import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Snackbar from 'material-ui/Snackbar';
import Avatar from 'material-ui/Avatar';
import AppBar from 'material-ui/AppBar';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import IconButton from 'material-ui/IconButton';

var self;
var searchContactList = null;
var myContactList = null;
var contactSearchTimerId = null;
var mentoringId;
var offerUserId;
var mentoringTitle;

export class OffersPage extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			contactList: [],
			snack: {
				open: false,
				message: '',
			},
		};
		this.onItemTap = this.onItemTap.bind(this);
		this.onBack = this.onBack.bind(this);
		self = this;
	}

	componentWillMount() {
		offerUserId = this.props.params.userId;
		mentoringId = this.props.params.mentoringId;
		mentoringTitle = this.props.params.mentoringTitle;
		let xhr = new XMLHttpRequest();
		xhr.open('GET', '/api/offers/' + mentoringId);
		xhr.onload = () => {
			if (xhr.status !== 200) {
				this.setState({
					snack: {
						open: true,
						message: 'オファーの読み込みに失敗しました。',
					},
					refreshStyle: {
						display: 'none',
					},
				});
				return;
			}
			myContactList = [];
			let data = JSON.parse(xhr.responseText);
			console.log(data.offers);
			this.setState({
				contactList: data.offers,
			});
			if (data.offers.length == 0) {
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
		};
		xhr.send();;
	}

	onBack(e) {
		this.context.router.goBack();
	}

	onItemTap(userId) {
		this.context.router.push({pathname: '/chat/' + mentoringId + '/' + userId + '/' + mentoringTitle});
	}

	render() {
		const styles = {
			contactListSection: {
				position: 'absolute',
				width: '100%',
				height: '99%',
				top: '0.2rem',
			},
			title: {
				cursor: 'pointer',
				fontSize: '1rem',
			},
			searchContactWrap: {
				position: 'absolute',
				opacity: '1.0',
				paddingBottom: '0.5rem',
				zIndex: '1',
				width: '100%',
				top: '1rem',
			},
			clearModalButton: {
				position: 'absolute',
				top: '-0.5rem',
				left: '-0.5rem',
				padding: '1rem',
				zIndex: '10001',
			},
			doneModalButton: {
				position: 'absolute',
				top: '-0.5rem',
				right: '-0.5rem',
				padding: '1rem',
				zIndex: '10001',
			},
			modalTitle: {
				textAlign: 'center',
				marginTop: '0.6rem',
				fontSize: '1rem',
			},
			searchContact: {
				padding: '0 0.4rem',
				boxSizing: 'border-box',
				width: '85%',
				margin: '1.5rem 0 0 2%',
				fontSize: '1rem',
				lineHeight: '1.5rem',
				backgroundColor: 'white',
				border: '1px solid #ccc',
				borderRadius: '5px',
			},
			headroom: {
				WebkitTransition: 'all .3s ease-in-out',
				MozTransition: 'all .3s ease-in-out',
				OTransition: 'all .3s ease-in-out',
				transition: 'all .3s ease-in-out',
			},
			title: {
				fontSize: '1rem',
			},
			time: {
				width: '2.5rem',
				textAlign: 'right',
				fontSize: '0.8em',
			},
			listItem: {
			},
			secondoryText: {
			},
		};
		return (
			<section style={styles.contactListSection}>
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
					/>
				</HeadRoom>
				<List>
				{(() => {
					if (Array.isArray(this.state.contactList)) {
						let contactList = [];
						for (var i = 0; i < this.state.contactList.length; i++) {
							var date = new Date( this.state.contactList[i].last_modified_at);
							var hhmm = date.getHours() + ":" + ('0' + date.getMinutes()).slice( -2 );
							var message = decodeURI(this.state.contactList[i].last_message);
							contactList.push(<ListItem style={styles.listItem} key={i} primaryText={this.state.contactList[i].username} secondaryText={<span style={styles.secondoryText}>{message}</span>} leftAvatar={<Avatar src={this.state.contactList[i].avatar} />} onTouchTap={this.onItemTap.bind(this, this.state.contactList[i].user_id)} secondaryTextLines={2} rightIcon={<p style={styles.time}>{hhmm}</p>} />);
						}
						return contactList;
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
OffersPage.contextTypes = {
	router: React.PropTypes.object.isRequired
}
