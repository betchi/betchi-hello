import React from 'react';
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
	}

	render() {
		const styles = {
			root: {
				position: 'relative',
				width: '100%',
				backgroundColor: window.bgColor1,
			},
			cover: {
				width: '100%',
			},
			title: {
				position: 'absolute',
				left: '5%',
				top: '5%',
				color: 'white',
				fontSize: '1.5rem',
				fontWeight: 'bold',
				textShadow: '1px 1px 1px rgba(0,0,0,1)',
				display: 'block',
				width: '90%',
				height: '4.5rem',
				overflow: 'hidden',
				opacity: 0.9,
				textOverflow: 'ellipsis',
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
				fontSize: '0.7rem',
				lineHeight: '1.5rem',
				backgroundColor: 'rgba(0,0,0,0.5)',
				color: 'white',
				width: '96%',
				padding: '2%',
				opacity: 0.7,
			},
		};

		return (
			<div style={styles.root}>
				<img style={styles.cover} src={this.props.cover} />
				<div style={styles.title}>{this.props.title}</div>
				<div style={styles.price}>
					{this.props.datetime}({this.props.duration}分間)<br />
					現在のオファー{this.props.offerCount}名(募集人数{this.props.limitUserCount}名)<br />
					{(() => {
						return this.props.price ? String.fromCharCode(165) + this.props.price.toString().replace(/(\d)(?=(\d{3})+$)/g , '$1,') : 'いいね値段'
					})()}
					{(() => {
						if (this.props.kind == 1) {
							return <LiveMark />
						}
					})()}
				</div>
			</div>
		);
	}
};
MentoringCover.contextTypes = {
	router: React.PropTypes.object.isRequired
}
MentoringCover.propTypes = {
	cover: React.PropTypes.string.isRequired,
	title: React.PropTypes.string.isRequired,
	duration: React.PropTypes.number.isRequired,
	price: React.PropTypes.number.isRequired,
	datetime: React.PropTypes.string.isRequired,
	limitUserCount: React.PropTypes.number.isRequired,
	offerCount: React.PropTypes.number.isRequired,
}

export class MentoringCoverSwipe extends MentoringCover {
	constructor(props, context) {
		super(props, context);
		this.state = {
			index: 0,
		};
		this.onChangeIndex = this.onChangeIndex.bind(this);
	}

	onChangeIndex(index) {
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
				color: window.textColor1,
				fontSize: '1.4rem',
				fontWeight: 'bolder',
				textShadow: '1px 1px 1px rgba(0,0,0,1)',
				height: '7rem',
				overflow: 'hidden',
				padding: '3.5rem 0.8rem',
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
				color: 'white',
				padding: '0.25rem 0.5rem',
			},
		};

		return (
			<div style={styles.coverBox}>
				<SwipeableViews
					index={this.state.index}
					onChangeIndex={this.onChangeIndex}
				>
					{this.props.covers.map((cover, index) => {
						let key = 'cover_' + index;
						return <div key={key} style={styles.cover}><img style={styles.cover} src={cover} /></div>
					})}
				</SwipeableViews>
				<Pagination
					dots={this.props.covers.length}
					index={this.state.index}
					onChangeIndex={this.onChangeIndex}
				/>
				<div style={styles.title}>{this.props.title}</div>
			</div>
		);
	}
}
MentoringCoverSwipe.contextTypes = {
	router: React.PropTypes.object.isRequired
}
MentoringCoverSwipe.propTypes = {
	title: React.PropTypes.string.isRequired,
	covers: React.PropTypes.array.isRequired,
}

export class SelectableCover extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
		};
		this.onTap = this.onTap.bind(this);
	}

	onTap(e) {
		const src = e.target.src;
		this.props.onTap(src);
	}

	render() {
		const styles = {
			root: {
				width: '100%',
				overflow: 'scroll',
			},
			covers: {
				width: '200%',
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
					{this.props.images.map((cover, index) => {
						let key = 'cover_' + cover.id;
						return <div key={key} style={styles.cover}><img style={styles.cover} src={cover.url} onTouchTap={this.onTap} /></div>
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
	images: React.PropTypes.array.isRequired,
	onTap: React.PropTypes.func.isRequired,
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
		console.log("open profile");
		this.context.router.push('/mypage/' + this.props.userId);
	}

	render() {
		const styles = {
			root: {
				width: '100%',
				height: '25px',
				lineHeight: '25px',
				backgroundColor: window.bgColor1,
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
				fontSize: '14px',
				margin: '0 0.5rem',
				textOverflow: 'ellipsis',
				overflow: 'hidden',
				width: '30%',
				color: window.textColor1,
				opacity: 0.7,
				height: '20px',
				lineHeight: '20px',
			},
			avatar: {
				float: 'left',
				margin: '0 0 5px 5px',
				width: '20px',
				height: '20px',
			},
			button: {
				float: 'right',
				fontSize: '0.8rem',
				color: window.textColor1,
				minWidth: 'auto',
				height: '18px',
				lineHeight: '18px',
			},
			buttonIcon: {
				width:'14px',
				height:'14px',
				margin: '0 5px',
				opacity: 0.7,
			},
			buttonLabel: {
				padding: 0,
				fontSize: '12px',
				opacity: 0.7,
			},
			digest: {
				float: 'left',
				background: window.bgColor1,
				fontSize: '0.7rem',
				width: '96%',
				margin: 0,
				padding: '0 2%',
			},
		};

		return (
			<div
				style={styles.root}
				onTouchTap={this.onOpenProfile}
			>
				<Avatar style={styles.avatar} src={this.props.avatar} />
				<p style={styles.username}>{this.props.username}</p>
				{(() => {
					if (this.props.countStar != 0) {
						return <FlatButton
							style={styles.button}
							label={this.props.countStar}
							icon={<StarIcon style={styles.buttonIcon} />}
							disabled={true}
							labelStyle={styles.buttonLabel}
						/>
					}
				})()}
				{(() => {
					if (this.props.countThanx != 0) {
						return <FlatButton
							style={styles.button}
							label={this.props.countThanx}
							icon={<CommunicationEmailIcon style={styles.buttonIcon} />}
							disabled={true}
							labelStyle={styles.buttonLabel}
						/>
					}
				})()}
				{(() => {
					if (this.props.countFollower != 0) {
						return <FlatButton
							style={styles.button}
							label={this.props.countFollower}
							icon={<PersonIcon style={styles.buttonIcon} />}
							disabled={true}
							labelStyle={styles.buttonLabel}
						/>
					}
				})()}
				<div style={styles.digest}>{this.props.digest}</div>
			</div>
		);
	}
};
MentoringDigest.contextTypes = {
	router: React.PropTypes.object.isRequired
}
MentoringDigest.propTypes = {
	//	userId: React.PropTypes.number.isRequired,
	avatar: React.PropTypes.string.isRequired,
	username: React.PropTypes.string.isRequired,
	digest: React.PropTypes.string.isRequired,
	star: React.PropTypes.number.isRequired,
	countThanx: React.PropTypes.number.isRequired,
	countFollower: React.PropTypes.number.isRequired,
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
		this.context.router.push('/mentoring/' + this.props.id);
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
				backgroundColor: window.bgColor2,
				color: window.textColor1,
			},
		};
		return (
			<Card
				style={styles.card}
				onTouchTap={this.onTap}
			>
				<MentoringCover
					cover={this.props.cover}
					title={this.props.title}
					duration={this.props.duration}
					price={this.props.price}
					datetime={this.props.datetime}
					limitUserCount={this.props.limitUserCount}
					offerCount={this.props.offerCount}
					kind={this.props.kind}
				/>
				<MentoringDigest
					avatar={this.props.avatar}
					username={this.props.username}
					digest={this.props.digest}
					countThanx={this.props.countThanx}
					countStar={this.props.countStar}
					countFollower={this.props.countFollower}
				/>
			</Card>
		);
	}
};
MentoringCard.contextTypes = {
	router: React.PropTypes.object.isRequired
}
MentoringCard.propTypes = {
	id: React.PropTypes.number.isRequired,
	cover: React.PropTypes.string.isRequired,
	title: React.PropTypes.string.isRequired,
	digest: React.PropTypes.string.isRequired,
	duration: React.PropTypes.number.isRequired,
	price: React.PropTypes.number.isRequired,
	datetime: React.PropTypes.string.isRequired,
	limitUserCount: React.PropTypes.number.isRequired,
	offerCount: React.PropTypes.number.isRequired,
	avatar: React.PropTypes.string.isRequired,
	countThanx: React.PropTypes.number.isRequired,
	countFollower: React.PropTypes.number.isRequired,
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
				backgroundColor: window.bgColor1,
				marginBottom: '3rem',
			},
		};
		/*
						*/
		return (
			<section style={styles.root}>
				{this.props.mentorings.map((mentoring, index) => {
					const key = "mentoring_list_" + index;
					return <MentoringCard
						key={key}
						id={mentoring.id}
						cover={mentoring.cover}
						title={mentoring.title}
						digest={mentoring.digest}
						price={mentoring.price}
						duration={mentoring.duration}
						datetime={mentoring.day}
						limitUserCount={10}
						offerCount={10}
						avatar={mentoring.avatar}
						username="ヤマダ太郎"
						kind={1}
						countThanx={sessionStorage.user.count_thanx}
						countStar={sessionStorage.user.count_star}
						countFollower={sessionStorage.count_follower}
					/>
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
}

