import React from 'react';
import ReactDOM from 'react-dom';

import {Router, Route, IndexRoute, History, hashHistory} from 'react-router';
import HeadRoom from 'react-headroom';
import Modal from 'react-modal';

import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import {Card} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import AppBar from 'material-ui/AppBar';
import Snackbar from 'material-ui/Snackbar';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import BookmarkBorderIcon from 'material-ui/svg-icons/action/bookmark-border.js';
import BookmarkIcon from 'material-ui/svg-icons/action/bookmark.js';
import ContentCreateIcon from 'material-ui/svg-icons/content/create.js';
import CardGiftcardIcon from 'material-ui/svg-icons/action/card-giftcard.js';
import QuestionAnswerIcon from 'material-ui/svg-icons/action/question-answer.js';
import EditorModeIcon from 'material-ui/svg-icons/editor/mode-edit.js';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import SupervisorAccountButton from 'material-ui/svg-icons/action/supervisor-account';
import {List, ListItem} from 'material-ui/List';

import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';
import Toggle from 'material-ui/Toggle';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import {MentoringCoverSwipe, MentoringDigest, SelectableCover} from './content.jsx';
import {ThxMessageList} from './ThxMessageList.jsx';
import {ContactList} from './ContactList.jsx';

export class MentoringPage extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			messages: [],
			user: sessionStorage.user,
			mentoring: {
				id: this.props.params.id,
				user_id: 0,
				cover: '',
				covers: [],
				avatar: '',
				title: '',
				duration: 0,
				price: 0,
				star: 0,
				digest: '',
				countThx: 0,
				user: {
					username: '',
					avatar: '',
					count_thanx: 0,
					count_star: 0,
					count_followers: 0,
				},
			},
			snack: {
				open: false,
				message: '',
			},
			refreshStyle: {
				position: 'relative',
				display: 'inline-block',
			},
			page: 1,
		};
		this.onSnackClose = this.onSnackClose.bind(this);
		this.loadContents = this.loadContents.bind(this);
		this.loadMessages = this.loadMessages.bind(this);
		this.onScroll = this.onScroll.bind(this);
		this.onBack = this.onBack.bind(this);
		this.onFollow = this.onFollow.bind(this);
		this.onOffer = this.onOffer.bind(this);
		this.onOfferConfirm = this.onOfferConfirm.bind(this);
		this.onBookmark = this.onBookmark.bind(this);
		this.onBookmarkCancel = this.onBookmarkCancel.bind(this);
		this.onMentoringEdit = this.onMentoringEdit.bind(this);
	}

	componentDidMount() {
		this.loadContents(this.props.params.id);
		this.loadMessages(this.props.params.id);
	}

	componentWillReceiveProps(nextProps) {
		window.removeEventListener('scroll', this.onScroll);
		this.loadContents(nextProps.params.id);
		this.loadMessages(nextProps.params.id);
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.onScroll);
	}

	onBack(e) {
		this.context.router.goBack();
	}

	onFollow(e) {
	}

	onOffer(e) {
		this.context.router.push({pathname: '/chat/' + this.state.mentoring.id + '/' + sessionStorage.user.id + '/' + this.state.mentoring.title});
	}

	onOfferConfirm(e) {
		this.context.router.push({pathname: '/offers/' + this.state.mentoring.id + '/' + this.state.mentoring.title});
	}

	onBookmark(e) {
		console.log("bookmark");
	}

	onBookmarkCancel(e) {
		console.log("bookmark cancel");
	}

	onMentoringEdit(e) {
		console.log("mentoring edit");
		this.context.router.push({pathname: '/mentoring/' + this.state.mentoring.id + '/edit', query:{category: this.props.location.query.category}});
	}

	onSnackClose(e) {
		this.setState({
			snack: {
				open: false,
				message: '',
			}
		})
	}

	onScroll(e) {
		let body = window.document.body;
		let html = window.document.documentElement;
		let scrollTop = body.scrollTop || html.scrollTop;
		let bottom = html.scrollHeight - html.clientHeight - scrollTop;
		if (bottom <= 60) {
			window.removeEventListener('scroll', this.onScroll);
			this.loadMessages(this.props.params.id, this.state.page + 1);
		}
	}

	loadContents(id = 1) {
		let xhr = new XMLHttpRequest();
		xhr.open('GET', '/api/mentoring/' + id);
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
			let data = JSON.parse(xhr.responseText);
			console.log(data.mentoring)
			this.setState({
				mentoring: data.mentoring,
			});
		}
		xhr.send();
	}

	loadMessages(id = 1, page = 1) {
		let xhr = new XMLHttpRequest();
		xhr.open('GET', '/thxmessage_' + id + '.json?p=' + page);
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
			let messages = [];
			let data = JSON.parse(xhr.responseText);
			if (page === 1) {
				messages = data;
			} else {
				messages = this.state.messages.slice();
				for (var ii in data) {
					messages.push(data[ii]);
				}
			}
			this.setState({
				messages: messages,
			});
			this.state.page = page;

			if (messages.length == 0) {
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
			if (page === 1) {
				window.scrollTo(0,0);
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

	render() {
		const styles = {
			root: {
				backgroundColor: window.bgColor1,
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
			digest: {
				background: window.bgColor1,
				fontSize: '0.8rem',
				width: '96%',
				margin: 0,
				padding: '0 2% 2% 2%',
				color: window.textColor1,
			},
			refreshBox: {
				position: 'relative',
				margin: '16px 0',
				padding: '0 0 43px 0',
				width: '100%',
			},
			refreshMargin: {
				width: '40px',
				margin: 'auto',
			},
			buttons: {
				position: 'fixed',
				width: '96%',
				margin: '0 2%',
				bottom: '3px',
				left: 0,
				textAlign: 'center',
			},
			button: {
				width: '46%',
				margin: '2%',
				boxShadow: '2px 2px 2px rgba(1, 1, 1, 0.5)',
				backgroundColor: window.buttonColor1,
				border: '1px solid',
				borderColor: window.bgColor1,
				borderRadius: '0.2rem',
				height: '3rem',
				color: 'white',
			},
			buttonLabel: {
				color: 'white',
				paddingRight: 0,
			},
			buttonIcon: {
				marginLeft: 0,
			},
			backIcon: {
				position: 'fixed',
				zIndex: '200',
			},
			backIcon2: {
				color: 'white',
				boxShadow: '1px 1px 1px rgba(0,0,0,1)',
				borderRadius: '50%',
				padding: '5px',
			},
			title: {
				fontSize: '1rem',
				fontWeight: 'normal',
				width: '100%',
				backgroundColor: window.bgColor2,
				color: window.textColor1,
				textAlign: 'center',
				margin: '1rem 0 0 0',
			},
			list: {
				paddingTop: 0,
				clear: 'both',
			},
			listItem: {
				backgroundColor: window.bgColor2,
				color: window.textColor1,
				border: '1px solid',
				borderColor: window.bgColor1,
				fontSize: '0.8rem',
			},
			secondaryText: {
				color: window.textColor1,
				float: 'right',
				marginTop: '-1rem',
				fontSize: '0.8rem',
			},
		}
		var price = this.state.mentoring.price ? String.fromCharCode(165) + this.state.mentoring.price.toString().replace(/(\d)(?=(\d{3})+$)/g , '$1,') : 'いいね値段';
		var datetime = new Date(this.state.mentoring.datetime);
		var yyyymmdd = datetime.getFullYear() + "/" + (datetime.getMonth() + 1) + "/" + datetime.getDate();
		var hhmm = datetime.getHours() + ":" + ('0' + datetime.getMinutes()).slice(-2);
		var datetimeString = yyyymmdd + " " + hhmm;

		return (
			<section style={styles.root}>
				<IconButton
					style={styles.backIcon}
					iconStyle={styles.backIcon2}
					onTouchTap={this.onBack}
				>
					<NavigationArrowBack />
				</IconButton>
				<MentoringCoverSwipe
					covers={this.state.mentoring.covers}
					title={this.state.mentoring.title}
				/>
				<MentoringDigest
					userId={this.state.mentoring.user_id}
					username={this.state.mentoring.user.username}
					avatar={this.state.mentoring.user.avatar}
					digest={this.state.mentoring.digest}
					countThanx={this.state.mentoring.user.count_thanx}
					countStar={this.state.mentoring.user.count_star}
					countFollowers={this.state.mentoring.user.count_followers}
					onTouchTap={this.onOpenProfile}
					digestFontSize="1rem"
				/>
				<List style={styles.list}>
					<ListItem style={styles.listItem} disabled={true} primaryText="カテゴリ" secondaryText={<p style={styles.secondaryText}>{this.props.location.query.category}</p>} />
					<ListItem style={styles.listItem} disabled={true} primaryText="開催日時" secondaryText={<p style={styles.secondaryText}>{datetimeString}</p>} />
					<ListItem style={styles.listItem} disabled={true} primaryText="メンタリング時間" secondaryText={<p style={styles.secondaryText}>{this.state.mentoring.duration} 分</p>} />
					<ListItem style={styles.listItem} disabled={true} primaryText="金額" secondaryText={<p style={styles.secondaryText}>{price}</p>} />
					<ListItem style={styles.listItem} disabled={true} primaryText="募集人数" secondaryText={<p style={styles.secondaryText}>{this.state.mentoring.max_user_num} 人</p>} />
					<ListItem style={styles.listItem} disabled={true} primaryText="現在のオファー人数" secondaryText={<p style={styles.secondaryText}>{this.state.mentoring.count_offers} 人</p>} />
				</List>
				{(() => {
					if (this.state.messages.length != 0) {
						return (
							<ThxMessageList
								key={'thx-message_' + this.props.params.id}
								messages={this.state.messages}
							/>
						);
					}
				})()}
				<div style={styles.refreshBox}>
					<div style={styles.refreshMargin}>
						<RefreshIndicator
							size={40}
							left={0}
							top={0}
							status="loading"
							style={this.state.refreshStyle}
						/>
					</div>
				</div>
				<Snackbar
					open={this.state.snack.open}
					message={this.state.snack.message}
					autoHideDuration={4000}
					onRequestClose={this.onSnackClose}
				/>
				<div style={styles.buttons}>
				{(() => {
					if (this.state.mentoring.user_id == sessionStorage.user.id) {
						if (this.state.mentoring.count_offers != 0) {
							return <FlatButton
								style={styles.button}
								icon={<QuestionAnswerIcon style={styles.buttonIcon} />}
								label="オファーを確認"
								labelStyle={styles.buttonLabel}
								onTouchTap={this.onOfferConfirm}
							/>
						}
					} else {
						return <FlatButton
							style={styles.button}
							icon={<QuestionAnswerIcon style={styles.buttonIcon} />}
							label="オファー"
							labelStyle={styles.buttonLabel}
							onTouchTap={this.onOffer}
						/>
					}
				})()}
				{(() => {
					if (this.state.mentoring.user_id == sessionStorage.user.id) {
						return <FlatButton
							style={styles.button}
							icon={<EditorModeIcon style={styles.buttonIcon} />}
							label="編集"
							labelStyle={styles.buttonLabel}
							onTouchTap={this.onMentoringEdit}
						/>
					} else {
						if (false) {
							return <FlatButton
								style={styles.button}
								icon={<BookmarkIcon style={styles.buttonIcon} />}
								label="ブックマーク解除"
								labelStyle={styles.buttonLabel}
								onTouchTap={this.onBookmarkCancel}
							/>
						} else {
							return <FlatButton
								style={styles.button}
								icon={<BookmarkBorderIcon style={styles.buttonIcon} />}
								label="ブックマーク"
								labelStyle={styles.buttonLabel}
								onTouchTap={this.onBookmark}
							/>
						}
					}
				})()}
				</div>
			</section>
		);
	}
}
MentoringPage.contextTypes = {
	router: React.PropTypes.object.isRequired
}
MentoringPage.propTypes = {
	params: React.PropTypes.object.isRequired
}

const defaultSelectMemberLabel = "メンバーを招待する";

export class EditMentoringPage extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			messages: [],
			selectedAvatarList: [],
			mentoring: {
				id: Number(this.props.params.id),
				user_id: sessionStorage.user.id,
				title: '',
				digest: '',
				datetime: null,
				cover: '',
				covers: [],
				invitaions: [],
			},
			date: null,
			time: null,
			category: this.props.location.query.category,
			covers: [],
			snack: {
				open: false,
				message: '',
			},
			page: 1,
			selectMemberLabel: defaultSelectMemberLabel,
			modalIsOpen: false,
		};
		this.onSnackClose = this.onSnackClose.bind(this);
		this.loadContents = this.loadContents.bind(this);
		this.loadCovers = this.loadCovers.bind(this);
		this.onScroll = this.onScroll.bind(this);
		this.onBack = this.onBack.bind(this);
		this.onFollow = this.onFollow.bind(this);
		this.onCoverSelected = this.onCoverSelected.bind(this);
		this.onInputTitle = this.onInputTitle.bind(this);
		this.onInputDuration = this.onInputDuration.bind(this);
		this.onInputDigest = this.onInputDigest.bind(this);
		this.onChangeDate = this.onChangeDate.bind(this);
		this.onChangeTime = this.onChangeTime.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.onOpenModal = this.onOpenModal.bind(this);
		this.onCloseModal = this.onCloseModal.bind(this);
		this.onChangeCategory = this.onChangeCategory.bind(this);
		this.onChangeKind = this.onChangeKind.bind(this);
		self = this;
	}

	componentDidMount() {
		if (this.props.params.id != undefined) {
			this.loadContents(this.props.params.id);
		}
		this.loadCovers();
	}

	componentWillReceiveProps(nextProps) {
		window.removeEventListener('scroll', this.onScroll);
		this.loadContents(nextProps.params.id);
		this.loadMessages()
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.onScroll);
	}

	onBack(e) {
		this.context.router.goBack();
	}

	onFollow(e) {
	}

	onSnackClose(e) {
		this.setState({
			snack: {
				open: false,
				message: '',
			}
		})
	}

	onCoverSelected(img) {
		const mentoring = this.state.mentoring;
		if (mentoring.cover == '') {
			mentoring.covers.shift();
		}
		mentoring.covers.push(img);
		mentoring.cover = mentoring.covers[0];
		this.setState({
			mentoring: mentoring,
		});
	}

	onInputTitle(e) {
		const mentoring = this.state.mentoring;
		mentoring.title = e.target.value.trim();
		this.setState({
			mentoring: mentoring,
		})
	}

	onInputDuration(e) {
		const mentoring = this.state.mentoring;
		mentoring.duration = Number(e.target.value.trim());
		this.setState({
			mentoring: mentoring,
		})
	}

	onInputDigest(e) {
		const mentoring = this.state.mentoring;
		mentoring.digest = e.target.value;
		this.setState({
			mentoring: mentoring,
		})
	}

	onChangeDate(e, date) {
		this.setState({
			date: date,
		})
	}

	onChangeTime(e, time) {
		this.setState({
			time: time,
		})
	}

	onChangeCategory(event, index, value) {
		this.setState({
			category: value,
		})
	}

	onChangeKind(event, index, value) {
		const mentoring = this.state.mentoring;
		mentoring.kind = value;
		this.setState({
			mentoring: mentoring,
		})
	}

	onSubmit(e) {
		e.preventDefault();
		this.refs.titleTextField.blur();
		this.refs.durationTextField.blur();
		this.refs.digestTextField.blur();

		const xhr = new XMLHttpRequest();
		xhr.open('POST', '/api/mentoring', false);
		xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
		xhr.onload = () => {
			if (xhr.status !== 200) {
				this.setState({
					snack: {
						open: true,
						message: '通信に失敗しました。',
					},
				});
				return;
			}
			let data = JSON.parse(xhr.responseText);
			if (data.ok == false) {
				this.setState({
					snack: {
						open: true,
						message: '登録に失敗しました。',
					},
				});
				return;
			}
			this.context.router.push('/');
		}
		var yyyymmdd = this.state.date.getFullYear() + "-" + ('0' + (this.state.date.getMonth() + 1)).slice(-2) + "-" + this.state.date.getDate();
		var hhmm = ('0' + this.state.time.getHours()).slice(-2) + ":" + ('0' + this.state.time.getMinutes()).slice(-2);
		var datetimeString = yyyymmdd + " " + hhmm + ":00";
		var timestamp = Date.parse(datetimeString);
		var datetime = new Date(timestamp);
		var mentoring = {
			id: this.state.mentoring.id,
			user_id: this.state.mentoring.user_id,
			title: this.state.mentoring.title,
			digest: this.state.mentoring.digest,
			duration: this.state.mentoring.duration,
			cover: this.state.mentoring.cover,
			covers: this.state.mentoring.covers,
			kind: this.state.mentoring.kind,
			price: this.state.mentoring.price,
			datetime: datetime,
		}
		console.log(mentoring);
		const json = JSON.stringify({mentoring: mentoring, category: this.state.category});
		xhr.send(json);
		return
	}

	onOpenModal(e) {
		this.setState({
			modalIsOpen: true,
		})
	}

	onCloseModal(selectedAvatarList) {
		var selectedAvatarListCount = 0;
		if (selectedAvatarList !== undefined) {
			var invitaions = [];
			var i = 0;
			for (var index in selectedAvatarList) {
				invitaions[i] = selectedAvatarList[index].id;
				selectedAvatarListCount++;
				i++;
			}
		}

		let mentoring = this.state.mentoring;
		mentoring.invitaions = invitaions;
		console.log(mentoring);
		let selectMemberLabel;
		if (selectedAvatarListCount !== 0) {
			selectMemberLabel = selectedAvatarListCount + '名を招待しようとしています';
		} else {
			selectMemberLabel = defaultSelectMemberLabel;
		}

		this.setState({
			modalIsOpen: false,
			mentoring: mentoring,
			selectMemberLabel: selectMemberLabel,
			selectedAvatarList: selectedAvatarList,
		})
	}

	onScroll(e) {
		let body = window.document.body;
		let html = window.document.documentElement;
		let scrollTop = body.scrollTop || html.scrollTop;
		let bottom = html.scrollHeight - html.clientHeight - scrollTop;
		if (bottom <= 60) {
			window.removeEventListener('scroll', this.onScroll);
			//this.loadMessages(this.props.params.id, this.state.page + 1);
		}
	}

	loadContents(id = 0) {
		let xhr = new XMLHttpRequest();
		xhr.open('GET', '/api/mentoring/' + id);
		xhr.onload = () => {
			if (xhr.status !== 200) {
				this.setState({
					snack: {
						open: true,
						message: '通信に失敗しました。',
					},
				});
				return;
			}
			let data = JSON.parse(xhr.responseText);
console.log(data.mentoring);
			this.setState({
				mentoring: data.mentoring,
				date: new Date(data.mentoring.datetime),
				time: new Date(data.mentoring.datetime),
			});
		}
		xhr.send();
	}

	loadCovers(category = 'all', page = 1) {
		let xhr = new XMLHttpRequest();
		xhr.open('GET', '/api/cover_mentoring/' + category + '/' + page);
		xhr.onload = () => {
			if (xhr.status !== 200) {
				this.setState({
					snack: {
						open: true,
						message: '通信に失敗しました。',
					},
				});
				return;
			}
			let covers = [];
			let data = JSON.parse(xhr.responseText);
			if (page === 1) {
				covers = data.images;
			} else {
				covers = this.state.covers.slice();
				for (var ii in data.images) {
					covers.push(data.images[ii]);
				}
			}
			this.setState({
				covers: covers,
			});
			this.state.page = page;

			if (covers.length == 0) {
				this.setState({
					snack: {
						open: true,
						message: 'カバー画像が見つかりません。',
					},
				});
				return;
			}
			//window.addEventListener('scroll', this.onScroll);
		}
		xhr.send();
	}

	render() {
		const styles = {
			root: {
				backgroundColor: 'white',
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
			buttons: {
				width: '96%',
				margin: '0 2% 1rem 2%',
				left: 0,
				textAlign: 'center',
			},
			offer: {
				width: '100%',
			},
			titleText: {
				fontSize: '0.8rem',
				width: '90%',
				margin: '0 5%',
				lineHeight: '1.5rem',
			},
			dateRoot: {
				display: 'flex',
				flexFlow: 'row nowrap',
				width: '90%',
				margin: '0 5%',
			},
			dateText: {
				width: '100%',
				fontSize: '0.8rem',
				lineHeight: '1.5rem',
				flexGrow: 1,
			},
			digestText: {
				width: '90%',
				margin: '0 5%',
				fontSize: '0.8rem',
				lineHeight: '1.5rem',
			},
		}
		const modalStyles = {
			overlay : {
				zIndex: "9999",
				position: "fixed",
				top: "0",
				bottom: "0",
				left: "0",
				right: "0",
				backgroundColor: "gray",
			},
			content : {
				zIndex: "10000",
				position: "fixed",
				top: "1%",
				bottom: "1%",
				left: "3%",
				right: "3%",
				padding: "0",
				backgroundColor: "white",
				borderRadius: '5px',
				overflowX: 'hidden',
			}
		}

		var appBarTitle;
		if (this.props.params.id == undefined) {
			appBarTitle = "メンタリング登録";
		} else {
			appBarTitle = "メンタリング編集";
		}

		return (
			<section style={styles.root}>
				<HeadRoom
					style={styles.headroom}
				>
					<AppBar
						title={appBarTitle}
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
				<MentoringCoverSwipe
					covers={this.state.mentoring.covers}
					title={this.state.mentoring.title}
				/>
				<SelectableCover
					images={this.state.covers}
					onTap={this.onCoverSelected}
				/>
				<form onSubmit={this.onSubmit}>
					<TextField
						style={styles.titleText}
						hintText='教えたいこと（40文字）'
      					floatingLabelText="教えたいこと（40文字）"
						floatingLabelFixed={true}
						errorText={this.state.errorTitle}
						value={this.state.mentoring.title}
						onChange={this.onInputTitle}
						ref='titleTextField'
					/>
					<div style={styles.dateRoot}>
						<DatePicker
      						floatingLabelText="開催日"
							floatingLabelFixed={true}
							hintText="選択"
							textFieldStyle={styles.dateText}
							value={this.state.date}
							minDate={new Date()}
							onChange={this.onChangeDate}
						/>
						<TimePicker
      						floatingLabelText="開催時刻"
							floatingLabelFixed={true}
							hintText="選択"
							textFieldStyle={styles.dateText}
							format="24hr"
							value={this.state.time}
							onChange={this.onChangeTime}
						/>
						<TextField
							style={styles.dateText}
      						floatingLabelText="メンタリング時間(分)"
							floatingLabelFixed={true}
							hintText=""
							errorText={this.state.errorDuration}
							value={this.state.mentoring.duration}
							type="number"
							onChange={this.onInputDuration}
							ref='durationTextField'
						/>
					</div>
					<div style={styles.dateRoot}>
						<TextField
							style={styles.dateText}
      						floatingLabelText="金額"
							floatingLabelFixed={true}
							hintText=""
							errorText={this.state.errorPrice}
							value={this.state.mentoring.price}
							type="number"
							onChange={this.onInputPrice}
							ref='priceTextField'
						/>
						<TextField
							style={styles.dateText}
      						floatingLabelText="募集人数"
							floatingLabelFixed={true}
							hintText=''
							errorText={this.state.errorMaxUserNum}
							value={this.state.mentoring.max_user_num}
							type="number"
							onChange={this.onInputMaxUserNum}
							ref='maxUserNumTextField'
						/>
					</div>
					<div style={styles.dateRoot}>
						<SelectField
							value={this.state.category}
							onChange={this.onChangeCategory}
							floatingLabelText="カテゴリ"
							floatingLabelFixed={true}
							hintText="選択"
							fullWidth={true}
						>
							<MenuItem value="business" primaryText="ビジネス" />
							<MenuItem value="design" primaryText="デザイン" />
							<MenuItem value="programming" primaryText="プログラム" />
							<MenuItem value="language" primaryText="言語" />
							<MenuItem value="sports" primaryText="スポーツ" />
							<MenuItem value="life" primaryText="ライフ" />
							<MenuItem value="education" primaryText="教育" />
							<MenuItem value="university" primaryText="大学" />
							<MenuItem value="music" primaryText="音楽" />
						</SelectField>
					</div>
					<div style={styles.dateRoot}>
						<SelectField
							value={this.state.mentoring.kind}
							onChange={this.onChangeKind}
							floatingLabelText="メンタリングタイプ"
							floatingLabelFixed={true}
							hintText="選択"
							fullWidth={true}
						>
							<MenuItem key={1} value={1} primaryText="通常" />
							<MenuItem key={2} value={2} primaryText="ライブ配信" />
						</SelectField>
					</div>
					<TextField
						style={styles.digestText}
						hintText=""
      					floatingLabelText="事前メッセージ・告知"
						floatingLabelFixed={true}
						errorText={this.state.errorDigest}
						value={this.state.mentoring.digest}
						onChange={this.onInputDigest}
						ref='digestTextField'
						rows={10}
						multiLine={true}
					/>
					<div style={styles.buttons}>
						<RaisedButton
							style={styles.offer}
							label={this.state.selectMemberLabel}
							icon={<SupervisorAccountButton />}
							onTouchTap={this.onOpenModal}
						/>
					</div>
					<div style={styles.buttons}>
						<RaisedButton
							style={styles.offer}
							primary={true}
							label="登録する"
							onTouchTap={this.onSubmit}
						/>
					</div>
				</form>
				<Divider />
				<Snackbar
					open={this.state.snack.open}
					message={this.state.snack.message}
					autoHideDuration={4000}
					onRequestClose={this.onSnackClose}
				/>
				<Modal
					isOpen={this.state.modalIsOpen}
					onRequestClose={this.onCloseModal}
					style={modalStyles}
				>
					<ContactList onCloseModal={this.onCloseModal} selectedAvatarList={this.state.selectedAvatarList} />
				</Modal>
			</section>
		);
	}
}
EditMentoringPage.contextTypes = {
	router: React.PropTypes.object.isRequired
}
EditMentoringPage.propTypes = {
	params: React.PropTypes.object.isRequired
}

