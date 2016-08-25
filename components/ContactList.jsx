import React from 'react';
import ReactDOM from 'react-dom';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import CancelButton from 'material-ui/svg-icons/navigation/cancel';
import DoneButton from 'material-ui/svg-icons/action/done';
import ClearButton from 'material-ui/svg-icons/content/clear';
import TextField from 'material-ui/TextField';
import es from 'elasticsearch';

var self;
var searchContactList = null;
var myContactList = null;
var contactSearchTimerId = null;

export class ContactList extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			contactList: [],
			selectedAvatarList: this.props.selectedAvatarList,
			styles: {
				avatarBar: {
					display: 'none',
					opacity: '0.85',
					backgroundColor: '#232323',
					width: '100%',
					height: '4.5rem',
					overflowX: 'auto',
					overflowY: 'hidden',
					whiteSpace: 'nowrap',
					margin: '0',
					position: 'absolute',
					bottom: '-0.2rem',
					borderRadius: '0 0 5px 5px',
				},
				contactListWrap: {
					position: 'relative',
					marginTop: '3.5rem',
					marginBottom: '0rem',
					overflow: 'scroll',
					height: '86%',
				},
			},
		};
		this.onItemTap = this.onItemTap.bind(this);
		this.onCancelTap = this.onCancelTap.bind(this);
		this.changeText = this.changeText.bind(this);
		this.clearText = this.clearText.bind(this);
		this.onClearModal = this.onClearModal.bind(this);
		this.onDoneModal = this.onDoneModal.bind(this);
		self = this;
		this.displayAvatarBar();
	}

	componentWillMount() {
		let xhr = new XMLHttpRequest();
		xhr.open('POST', 'https://ws-mentor.fairway.ne.jp/api/v1/contact');
		xhr.onload = () => {
			if (xhr.status !== 200) {
				this.setState({
					snack: {
						open: true,
						message: 'コンタクトリストの読み込みに失敗しました。',
					},
					refreshStyle: {
						display: 'none',
					},
				});
				return;
			}
			myContactList = [];
			let data = JSON.parse(xhr.responseText);
			myContactList = data.contact_lists;
console.log(myContactList);
			this.setState({
				contactList: myContactList,
			});
			if (myContactList.length == 0) {
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
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.send("user_id=" + sessionStorage.user.id);
	}

	onClearModal() {
		this.props.onCloseModal();
	}

	onDoneModal() {
		this.props.onCloseModal(this.state.selectedAvatarList);
	}

	onItemTap(index, contact) {
		let selectedAvatarList = this.state.selectedAvatarList;
		console.log(selectedAvatarList);
		console.log(index);
		console.log(contact);
		if (index in this.state.selectedAvatarList) {
			delete selectedAvatarList[index];
		} else {
			selectedAvatarList[index] = contact;
		}
		this.setState({
			selectedAvatarList: selectedAvatarList,
		});
		this.displayAvatarBar(index);

		return;
	}

	onCancelTap(index) {
		let selectedAvatarList = this.state.selectedAvatarList;
		delete selectedAvatarList[index];
		this.setState({
			selectedAvatarList: selectedAvatarList,
		});
		this.displayAvatarBar();
		return;
	}

	changeText(e) {
		var searchText = e.target.value;
		searchText = searchText.replace(/\s+|\n/g, "");
		if (searchText == "") {
			searchContactList = null;
			this.setState({
				textValue: searchText,
				contactList: myContactList,
			});
			return;
		}
		if (contactSearchTimerId != null) {
			clearInterval(contactSearchTimerId);
		}
		if (searchContactList == null) {
			searchContactList = 
				[
					{
						"id": 3,
						"name": "検索結果",
						"contacts": []
					}
				]
			;
		}
		this.setState({
			textValue: e.target.value
		});
		contactSearchTimerId = setInterval(function() {
			var esClient = new es.Client({
				host: 'es-mentor.fairway.ne.jp',
				//				log: 'trace'
			});
			esClient.search({
				index: 'user',
				body: {
					size: 100,
					min_score: 1.0,
					query: {
						multi_match: {
							query: searchText,
							fields: [
								"username.kuromoji",
								"username.unigram"
							],
							type: "best_fields"
						}
					},
				}
			}, function (error, response) {
				if (error !== undefined) {
					console.log(error);
				}
				var contactList = [];
				response.hits.hits.forEach(function(contact){
					contactList.push(contact._source);
				})
				searchContactList[0].contacts = contactList;
				self.setState({
					contactList: searchContactList,
				});
			});
			clearInterval(contactSearchTimerId);
		}, 700, searchText);
	}

	clearText(e) {
		this.setState({
			textValue: ""
		});
		searchContactList = null;
		this.setState({
			contactList: myContactList,
		});
	}

	displayAvatarBar(index) {
		console.log("avatar bar");
		let isNone = true;
		for (var index in this.state.selectedAvatarList) {
			isNone = false;
		}

		let stylesAvatarBar = this.state.styles.avatarBar;
		let stylesContactListWrap = this.state.styles.contactListWrap;
		if (isNone) {
			stylesAvatarBar.display = 'none';
			stylesContactListWrap.marginBottom = '0rem';
		} else {
			stylesAvatarBar.display = 'block';
			stylesContactListWrap.marginBottom = '4.5rem';
		}
		this.setState({
			styles: {
				avatarBar: stylesAvatarBar,
				contactListWrap: stylesContactListWrap,
			},
		});
		return;
	}

	render() {
		const styles = {
			contactListSection: {
				position: 'absolute',
				width: '100%',
				height: '99%',
				backgroundColor: 'white',
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
			avatar: {
				marginTop: '-0.2rem',
				marginLeft: '0.5rem',
				display: 'inline-block',
				whiteSpace: 'normal',
				verticalAlign: 'top',
			},
			avatarName: {
				color: 'white',
				fontSize: '0.5em',
				position: 'relative',
				top: '-0.8rem',
				left: '-0.2rem',
				overflow: 'hidden',
				textOverflow: 'ellipsis',
				width: '3rem',
			},
			avatarCancel: {
				border: '1px solid #999',
				backgroundColor: 'white',
				borderRadius: '50%',
				position: 'relative',
				top: '-1.5rem',
				left: '-0.5rem',
			},
			textClearButton: {
				position: 'relative',
				width: '2.5rem',
				top: '0.3rem',
				color: '#ccc',
			},
		};
		return (
			<section style={styles.contactListSection}>
				<ClearButton
					style={styles.clearModalButton}
					onTouchStart={this.onClearModal}
				/>
				<h1 style={styles.modalTitle}>メンバーを選択</h1>
				<DoneButton
					style={styles.doneModalButton}
					onTouchStart={this.onDoneModal}
				/>
				<div style={styles.searchContactWrap}>
					<TextField
						id='searchContact'
						style={styles.searchContact}
						underlineShow={false}
						hintText="名前で検索"
						defaultValue={this.state.textValue}
						value={this.state.textValue}
						onChange={this.changeText}
					/>
					<CancelButton
						style={styles.textClearButton}
						onTouchTap={this.clearText}
					/>
				</div>
				<div style={this.state.styles.contactListWrap}>
					<List>
					{(() => {
						if (Array.isArray(this.state.contactList)) {
							let contactList = [];
							for (var i = 0; i < this.state.contactList.length; i++) {
								contactList.push(<Subheader key={"avatar-" + i}>{this.state.contactList[i].name}</Subheader>);
								if (Array.isArray(this.state.contactList[i].contacts)) {
									for (var j = 0; j < this.state.contactList[i].contacts.length; j++) {
										var key = this.state.contactList[i].id+'-user'+this.state.contactList[i].contacts[j].id;
										if (key in this.state.selectedAvatarList) {
											contactList.push(<ListItem key={i + "-" + j} primaryText={this.state.contactList[i].contacts[j].username} leftAvatar={<Avatar src={this.state.contactList[i].contacts[j].avatar} />} onTouchTap={this.onItemTap.bind(this, key, this.state.contactList[i].contacts[j])} rightIcon={<DoneButton />} />);
										} else {
											contactList.push(<ListItem key={i + "-" + j} primaryText={this.state.contactList[i].contacts[j].username} leftAvatar={<Avatar src={this.state.contactList[i].contacts[j].avatar} />} onTouchTap={this.onItemTap.bind(this, key, this.state.contactList[i].contacts[j])} />);
										}
									}
								}
								if ((this.state.contactList.length - 1) != i) {
									contactList.push(<Divider key={"divider" + i} />);
								}
							}
							return contactList;
						}
					})()}
					</List>
				</div>
				<div style={this.state.styles.avatarBar}>
					<p style={styles.avatarWrap}>
						{(() => {
							if (Array.isArray(this.state.selectedAvatarList)) {
								let selectedAvatarList = [];
								for (var index in this.state.selectedAvatarList) {
									selectedAvatarList.push(
										<div
											style={styles.avatar}
										>
											<Avatar
												key={index}
												src={this.state.selectedAvatarList[index].avatar}
											/>
											<CancelButton
												style={styles.avatarCancel}
												onTouchTap={this.onCancelTap.bind(this, index)}
											/>
											<p style={styles.avatarName}>{this.state.selectedAvatarList[index].username}</p>
										</div>
									);
								}
								console.log(selectedAvatarList);
								return selectedAvatarList;
							}
						})()}
					</p>
				</div>
			</section>
		);
	}
};
ContactList.contextTypes = {
	router: React.PropTypes.object.isRequired
}
