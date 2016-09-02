import React from 'react';
import ReactDOM from 'react-dom';

import {Router, Route, IndexRoute, History, hashHistory} from 'react-router';

import SwipeableViews from 'react-swipeable-views';

import {Card} from 'material-ui/Card';
import Star from 'material-ui/svg-icons/toggle/star';
import StarHalf from 'material-ui/svg-icons/toggle/star-half';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import Avatar from 'material-ui/Avatar';
import PersonIcon from 'material-ui/svg-icons/social/person';
import StarIcon from 'material-ui/svg-icons/toggle/star';
import CommunicationEmailIcon from 'material-ui/svg-icons/communication/email.js';
import FlatButton from 'material-ui/FlatButton';

import {Pagination,PaginationDot} from './pagination.jsx';
import {LiveMark} from './LiveMark.jsx';

export class MentoringCover extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.onTouchTap = this.onTouchTap.bind(this);
	}

	onTouchTap() {
		this.props.onTouchTap();
	}

	render() {
		const styles = {
			root: {
				position: 'relative',
				width: '100%',
			},
			cover: {
				width: '100%',
			},
			title: {
				position: 'absolute',
				left: '5%',
				top: '5%',
				fontSize: '1.5rem',
				fontWeight: 'bold',
				textShadow: '1px 1px 1px rgba(0,0,0,1)',
				display: 'block',
				width: '90%',
				height: '4.5rem',
				overflow: 'hidden',
				opacity: 0.9,
				textOverflow: 'ellipsis',
				color: this.context.colors.text2,
			},
			avatar: {
				position: 'absolute',
				borderRadius: '50%',
				bottom: '10px',
				left: '10px',
				width: '90px',
				heifht: '90px',
			},
			price: {
				position: 'absolute',
				bottom: '6px',
				lineHeight: '1.5rem',
				backgroundColor: 'rgba(0,0,0,0.5)',
				color: this.context.colors.white,
				width: '96%',
				padding: '2%',
				opacity: 0.7,
			},
		};

		var price = this.props.price ? String.fromCharCode(165) + this.props.price.toString().replace(/(\d)(?=(\d{3})+$)/g , '$1,') : 'いいね値段';
		var datetimeString;
		if (this.props.datetime == "1970-01-01T00:00:00Z") {
			datetimeString = "開催日時未定";
		} else {
			var datetime = new Date(this.props.datetime);
			var yyyymmdd = datetime.getFullYear() + "/" + (datetime.getMonth() + 1) + "/" + datetime.getDate();
			var hhmm = datetime.getHours() + ":" + ('0' + datetime.getMinutes()).slice(-2);
			datetimeString = yyyymmdd + " " + hhmm;
		}

		var brFlg = false;

		var offersString = "";
		if (this.props.countOffers != 0) {
			offersString = "現在" + this.props.countOffers + "名の方がオファー中";
			brFlg = true;
		}

		var maxUserNumString = "";
		if (this.props.maxUserNum != 0) {
			maxUserNumString = "(募集人数は" + this.props.maxUserNum + "名です)";
			brFlg = true;
		}

		return (
			<div
				style={styles.root}
				onTouchTap={this.onTouchTap}
			>
				<img style={styles.cover} src={this.props.cover} />
				<div style={styles.title}>{this.props.title}</div>
				<div style={styles.price}>
					{offersString} {maxUserNumString}
					{(() => {
						if (brFlg) {
							return <br />
						}
					})()}
					{datetimeString} ( {this.props.duration}分間 )<br />
					{price}
					{(() => {
						if (this.props.kind == 2) {
							return <LiveMark />
						}
					})()}
				</div>
			</div>
		);
	}
};
MentoringCover.contextTypes = {
	router: React.PropTypes.object.isRequired,
	colors: React.PropTypes.object.isRequired,
}
MentoringCover.propTypes = {
	title: React.PropTypes.string.isRequired,
	duration: React.PropTypes.number.isRequired,
	datetime: React.PropTypes.string.isRequired,
	cover: React.PropTypes.string.isRequired,
	price: React.PropTypes.number.isRequired,
	maxUserNum: React.PropTypes.number.isRequired,
	countOffers: React.PropTypes.number.isRequired,
	kind: React.PropTypes.number.isRequired,
}

export class MentoringCoverSwipe extends MentoringCover {
	constructor(props, context) {
		super(props, context);
		this.state = {
			index: this.props.index,
		};
		this.onPaginationChangeIndex = this.onPaginationChangeIndex.bind(this);
		this.onSwipeableChangeIndex = this.onSwipeableChangeIndex.bind(this);
		this.onSwipeableSwitching = this.onSwipeableSwitching.bind(this);
	}
    componentWillReceiveProps() {
		this.state = {
			index: this.props.index,
		};
    }

	onSwipeableChangeIndex(index, fromIndex) {
		this.setState({
			index: index,
		});
	}

	onSwipeableSwitching(index, type) {
		//console.log("onSwipeableSwitching");
		//console.log(index);
		//console.log(type);
	}

	onPaginationChangeIndex(index) {
		this.setState({
			index: index,
		});
	}

	render() {
		const styles = {
			coverBox: {
				position: 'relative',
				width: '100%',
			},
			cover: {
				width: '100%',
			},
			title: {
				position: 'absolute',
				left: 0,
				top: 0,
				fontSize: '1.4rem',
				fontWeight: 'bolder',
				textShadow: '1px 1px 1px rgba(0,0,0,1)',
				height: '7rem',
				overflow: 'hidden',
				padding: '3.5rem 0.8rem',
				color: this.context.colors.white,
			},
			avatar: {
				position: 'absolute',
				borderRadius: '50%',
				bottom: '10px',
				left: '10px',
				width: '90px',
				heifht: '90px',
			},
			price: {
				position: 'absolute',
				right: '0px',
				bottom: '20px',
				fontSize: '0.9rem',
				lineHeight: '1.5rem',
				backgroundColor: 'rgba(0,0,0,0.75)',
				padding: '0.25rem 0.5rem',
			},
		};

		return (
			<div style={styles.coverBox}>
				<SwipeableViews
					index={this.state.index}
					onChangeIndex={this.onSwipeableChangeIndex}
					onSwitching={this.onSwipeableSwitching}
				>
					{this.props.covers.map((cover, index) => {
						let key = 'cover_' + index;
						return <div key={key} style={styles.cover}><img style={styles.cover} src={cover} /></div>
					})}
				</SwipeableViews>
				<Pagination
					dots={this.props.covers.length}
					index={this.state.index}
					onChangeIndex={this.onPaginationChangeIndex}
				/>
				<div style={styles.title}>{this.props.title}</div>
			</div>
		);
	}
}
MentoringCoverSwipe.contextTypes = {
	router: React.PropTypes.object.isRequired,
	colors: React.PropTypes.object.isRequired,
}
MentoringCoverSwipe.propTypes = {
	covers: React.PropTypes.array.isRequired,
	title: React.PropTypes.string.isRequired,
	index: React.PropTypes.number.isRequired,
}

export class SelectableCover extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			page: 1,
			covers: [],
		};
		this.onTap = this.onTap.bind(this);
		this.loadCovers();
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
				page: page,
			});
		}
		xhr.send();
	}

	onTap(cover, index) {
		if (this.props.mentoringCovers.indexOf(cover.url) < 0) {
			this.props.onTap(cover, index);
		}
	}

	render() {
		const styles = {
			root: {
				width: '100%',
				overflow: 'scroll',
			},
			covers: {
				width: '1000%',
				display: 'flex',
				flexFlow: 'row nowrap',
			},
			cover: {
				flexGrow: 1,
				width: '100%',
				flexBasis: '90px',
			},
		};

		return (
			<div style={styles.root}>
				<div style={styles.covers}>
					{this.state.covers.map((cover, index) => {
						let key = 'cover_' + cover.id;
						return <div key={key} style={styles.cover}><img style={styles.cover} src={cover.url} onTouchTap={this.onTap.bind(this, cover, index)} /></div>
					})}
				</div>
			</div>
		);
	}
}
SelectableCover.contextTypes = {
	router: React.PropTypes.object.isRequired
}
SelectableCover.propTypes = {
	onTap: React.PropTypes.func.isRequired,
	mentoringCovers: React.PropTypes.array.isRequired,
}

export class RatingStar extends React.Component {
	constructor(props, context) {
		super(props, context);
	}

	render() {
		let stars = [];
		for (var ii = 0; ii < 5; ii++) {
			if (1 <= this.props.star - ii) {
				stars.push(1);
			} else if (0 >= this.props.star - ii) {
				stars.push(0);
			} else {
				stars.push(0.5);
			}
		}
		return (
			<div style={this.props.rootStyle}>
				{stars.map((star, index) => {
					const key = "star" + index;
					if (0 == star) {
						return <StarBorder key={key} style={this.props.starStyle} />
					} else if (1 == star) {
						return <Star key={key} style={this.props.starStyle} />
					}
					return <StarHalf key={key} style={this.props.starStyle} />
				})}
			</div>
		);
	}
};
RatingStar.contextTypes = {
	router: React.PropTypes.object.isRequired
}
RatingStar.propTypes = {
	star: React.PropTypes.number.isRequired,
}
RatingStar.defaultProps = {
	rootStyle: {
	},
	starStyle: {
		width: '16px',
	},
}

export class ThxSummury extends React.Component {
	constructor(props, context) {
		super(props, context);
	}

	render() {
		return (
			<div style={this.props.rootStyle}>
				お礼{this.props.countThanx}件&nbsp;
				フォロー{this.props.countFollower}人&nbsp;
			</div>
		);
	}
};
ThxSummury.contextTypes = {
	router: React.PropTypes.object.isRequired
}
ThxSummury.propTypes = {
	rootStyle: React.PropTypes.object,
	countThanx: React.PropTypes.number.isRequired,
	countMentor: React.PropTypes.number.isRequired,
	countFollower: React.PropTypes.number.isRequired,
}
ThxSummury.defaultProps = {
	rootStyle: {
	},
	countThanx: 0,
	countMentor: 0,
	countFollower: 0,
}

export class MentoringDigest extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.onOpenProfile = this.onOpenProfile.bind(this);
	}

	onOpenProfile() {
		if (this.props.userId != sessionStorage.user.id) {
			this.context.router.push('/mypage/' + this.props.userId);
		}
	}

	render() {
		const styles = {
			root: {
				width: '100%',
				height: '2rem',
			},
			starBox: {
				display: 'flex',
				flexFlow: 'row wrap',
				justifyContent: 'space-between',
				alignItems: 'flex-start',
			},
			starRoot: {
				flexGlow: 1,
				boxSizing: 'border-box',
			},
			username: {
				float: 'left',
				margin: '0 0.5rem',
				textOverflow: 'ellipsis',
				overflow: 'hidden',
				width: '30%',
				fontSize: '1.1rem',
				height: '2rem',
			},
			avatar: {
				float: 'left',
				margin: '0 0 0 5px',
				width: '1.5rem',
				height: '1.5rem',
			},
			button: {
				float: 'right',
				minWidth: 'auto',
				height: '1.5rem',
				lineHeight: '1rem',
			},
			buttonIcon: {
				width:'1.5rem',
				height:'1.5rem',
				margin: 0,
				color: this.context.colors.text1,
			},
			buttonLabel: {
				margin: 0,
				color: this.context.colors.text1,
				padding: '0 8px',
			},
			digest: {
				float: 'left',
				fontSize: this.props.digestFontSize,
				width: '96%',
				padding: '2%',
			},
		};

		return (
			<div
				style={styles.root}
			>
				<Avatar style={styles.avatar} src={this.props.avatar} onTouchTap={this.onOpenProfile} />
				<p style={styles.username} onTouchTap={this.onOpenProfile}>{this.props.username}</p>
				{(() => {
					if (this.props.countStar != 0) {
						return <FlatButton
							style={styles.button}
							label={this.props.countStar}
							icon={<StarIcon style={styles.buttonIcon} />}
							labelStyle={styles.buttonLabel}
							onTouchTap={this.onOpenProfile}
						/>
					}
				})()}
				{(() => {
					if (this.props.countThanx != 0) {
						return <FlatButton
							style={styles.button}
							label={this.props.countThanx}
							icon={<CommunicationEmailIcon style={styles.buttonIcon} />}
							labelStyle={styles.buttonLabel}
							onTouchTap={this.onOpenProfile}
						/>
					}
				})()}
				{(() => {
					if (this.props.countFollowers != 0) {
						return <FlatButton
							style={styles.button}
							label={this.props.countFollowers}
							icon={<PersonIcon style={styles.buttonIcon} />}
							labelStyle={styles.buttonLabel}
							onTouchTap={this.onOpenProfile}
						/>
					}
				})()}
				<div style={styles.digest}>{this.props.digest}</div>
			</div>
		);
	}
};
MentoringDigest.contextTypes = {
	router: React.PropTypes.object.isRequired,
	colors: React.PropTypes.object.isRequired,
}
MentoringDigest.propTypes = {
	userId: React.PropTypes.number.isRequired,
	username: React.PropTypes.string.isRequired,
	avatar: React.PropTypes.string.isRequired,
	digest: React.PropTypes.string.isRequired,
	countThanx: React.PropTypes.number.isRequired,
	countStar: React.PropTypes.number.isRequired,
	countFollowers: React.PropTypes.number.isRequired,
	digestFontSize: React.PropTypes.string.isRequired,
}

export class MentoringDigestWithAvatar extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.onAvatarTap = this.onAvatarTap.bind(this);
	}

	onAvatarTap(e) {
		this.context.router.push('/mypage/' + this.props.userId);
	}

	render() {
		const styles = {
			root: {
				display: 'flex',
				flexFlow: 'row wrap',
				justifyContent: 'space-between',
				alignItems: 'center',
				width: '100%',
			},
			avatarBox: {
				flexBasis: '80px',
				flexGrow: 1,

				display: 'flex',
				flexFlow: 'column wrap',
				alignItems: 'center',

				boxSizing: 'border-box',
				marginLeft: '3%',
				verticalAlign: 'middle',
				borderRadius: '50%',
			},
			avatar: {
				width:  '100%',
			},
			digestBox: {
				flexBasis: '240px',
				flexGrow: 3,
				boxSizing: 'border-box',
				padding: '0 1%',
				verticalAlign: 'middle',
			},
			digest: {
				width: '100%',
				fontSize: '1rem',
				fontWeight: 'bold',
				verticalAlign: 'middle',
			},
			thxRoot: {
				width: '100%',
				fontSize: '0.75rem',
				lineHeight: '1.5rem',
				textAlign: 'right',
				marginTop: '1rem',
				verticalAlign: 'bottom',
			},
		};

		return (
			<div style={styles.root}>
				<div style={styles.avatarBox} onTouchTap={this.onAvatarTap}>
					<img src={this.props.avatar} style={styles.avatar} />
					<RatingStar star={this.props.star} />
				</div>
				<div style={styles.digestBox}>
					<div style={styles.digest}>{this.props.digest}</div>
					<ThxSummury
						rootStyle={styles.thxRoot}
						countThanx={this.props.countThanx}
						countMentor={this.props.countMentor}
						countFollower={this.props.countFollower}
					/>
				</div>
			</div>
		);
	}
};
MentoringDigestWithAvatar.contextTypes = {
	router: React.PropTypes.object.isRequired
}
MentoringDigestWithAvatar.propTypes = {
	userId: React.PropTypes.number.isRequired,
	avatar: React.PropTypes.string.isRequired,
	star: React.PropTypes.number.isRequired,
	digest: React.PropTypes.string.isRequired,
	countThanx: React.PropTypes.number.isRequired,
	countMentor: React.PropTypes.number.isRequired,
	countFollower: React.PropTypes.number.isRequired,
}

export class MentoringCard extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.onTap = this.onTap.bind(this);
	}

	onTap(e) {
		var category = "";
		for (var i = 0; i < this.context.categories.length; ++i) {
			if (this.context.categories[i].value == this.props.category) {
				console.log("here");
				category = this.context.categories[i];
				break;
			}
		}
		this.context.router.push({pathname: '/mentoring/' + this.props.id, query: {category:category.value, category_name:category.label}});
	}

	render() {
		const styles = {
			card: {
				position: 'relative',
				flexBasis: '320px',
				flexGrow: 1,
				boxShadow: '0 1px 2px rgba(0,0,0,0.12), 0 1px 1px rgba(0,0,0,0.24), 0 -1px 2px rgba(0,0,0,0.12), 0 -1px 1px rgba(0,0,0,0.24)',
				transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
				margin: '5px',
			},
		};
		return (
			<Card
				style={styles.card}
			>
				<MentoringCover
					title={this.props.title}
					duration={this.props.duration}
					datetime={this.props.datetime}
					cover={this.props.cover}
					price={this.props.price}
					maxUserNum={this.props.maxUserNum}
					countOffers={this.props.countOffers}
					kind={this.props.kind}
					onTouchTap={this.onTap}
				/>
				<MentoringDigest
					userId={this.props.userId}
					username={this.props.username}
					avatar={this.props.avatar}
					digest={this.props.digest}
					countThanx={this.props.countThanx}
					countStar={this.props.countStar}
					countFollowers={this.props.countFollowers}
					digestFontSize="1rem"
				/>
			</Card>
		);
	}
};
MentoringCard.contextTypes = {
	router: React.PropTypes.object.isRequired,
	categories: React.PropTypes.array.isRequired,
}
MentoringCard.propTypes = {
	id: React.PropTypes.number.isRequired,
	title: React.PropTypes.string.isRequired,
	digest: React.PropTypes.string.isRequired,
	datetime: React.PropTypes.string.isRequired,
	duration: React.PropTypes.number.isRequired,
	cover: React.PropTypes.string.isRequired,
	kind: React.PropTypes.number.isRequired,
	price: React.PropTypes.number.isRequired,
	maxUserNum: React.PropTypes.number.isRequired,
	countInvitations: React.PropTypes.number.isRequired,
	countOffers: React.PropTypes.number.isRequired,
	countDeterminations: React.PropTypes.number.isRequired,
	countHandclap: React.PropTypes.number.isRequired,
	countStar: React.PropTypes.number.isRequired,
	countThanx: React.PropTypes.number.isRequired,
	createdAt: React.PropTypes.string.isRequired,
	modifiedAt: React.PropTypes.string.isRequired,

	userId: React.PropTypes.number.isRequired,
	username: React.PropTypes.string.isRequired,
	avatar: React.PropTypes.string.isRequired,
	countFollowers: React.PropTypes.number.isRequired,
	countThanx: React.PropTypes.number.isRequired,
	countStar: React.PropTypes.number.isRequired,

	category: React.PropTypes.string.isRequired,
}

export class MentoringList extends React.Component {
	constructor(props, context) {
		super(props, context);
	}

	render() {
		const styles = {
			root: {
				display: 'flex',
				flexFlow: 'row wrap',
				justifyContent: 'space-between',
				alignItems: 'flex-start',
				marginBottom: '3rem',
			},
		};
		/*
						*/
		return (
			<section style={styles.root}>
				{this.props.mentorings.map((mentoring, index) => {
					const key = "mentoring_list_" + index;
					return (
						<MentoringCard
							key={key}
							id={mentoring.id}
							userId={mentoring.user_id}
							title={mentoring.title}
							digest={mentoring.digest}
							datetime={mentoring.datetime}
							duration={mentoring.duration}
							cover={mentoring.cover}
							kind={mentoring.kind}
							price={mentoring.price}
							maxUserNum={mentoring.max_user_num}
							countInvitations={mentoring.count_invitations}
							countOffers={mentoring.count_offers}
							countDeterminations={mentoring.count_determinations}
							countHandclap={mentoring.count_handclap}
							countStar={mentoring.count_star}
							countThanx={mentoring.count_thanx_messages}
							createdAt={mentoring.created_at}
							modifiedAt={mentoring.modified_at}
							username={mentoring.user.username}
							avatar={mentoring.user.avatar}
							countFollowers={mentoring.user.count_followers}
							countThanx={mentoring.user.count_thanx}
							countStar={mentoring.user.count_star}
							category={this.props.category}
						/>
					);
				})}
			</section>
		);
	}
};
MentoringList.contextTypes = {
	router: React.PropTypes.object.isRequired
}
MentoringList.propTypes = {
	mentorings: React.PropTypes.array.isRequired,
	category: React.PropTypes.string.isRequired,
}

