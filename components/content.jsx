import React from 'react';
import {Router, Route, IndexRoute, History, hashHistory} from 'react-router';
import {Card} from 'material-ui/Card';
import Star from 'material-ui/svg-icons/toggle/star';
import StarHalf from 'material-ui/svg-icons/toggle/star-half';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';

import SwipeableViews from 'react-swipeable-views';

import {Pagination,PaginationDot} from './pagination.jsx';

export class MentoringCover extends React.Component {
	constructor(props, context) {
		super(props, context);
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
				top: '20%',
				color: 'white',
				fontSize: '2rem',
				fontWeight: 'bolder',
				textShadow: '1px 1px 1px rgba(0,0,0,1)',
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
			<div style={styles.root}>
				<img style={styles.cover} src={this.props.cover} />
				<img style={styles.avatar} src={this.props.avatar} />
				<div style={styles.title}>{this.props.title}</div>
				<div style={styles.price}>{this.props.duration}分間&nbsp;
					{(() => {
						return this.props.price ? '&yen;' + String(this.props.price) : 'いいね値段'
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
	title: React.PropTypes.string.isRequired,
	price: React.PropTypes.string.isRequired,
	duration: React.PropTypes.string.isRequired,
	avatar: React.PropTypes.string.isRequired,
	cover: React.PropTypes.string.isRequired,
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
				left: '5%',
				top: '20%',
				color: 'white',
				fontSize: '2rem',
				fontWeight: 'bolder',
				textShadow: '1px 1px 1px rgba(0,0,0,1)',
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
				<div style={styles.price}>{this.props.duration}分間&nbsp;
					{(() => {
						return this.props.price ? '&yen;' + String(this.props.price) : 'いいね値段'
					})()}
				</div>
			</div>
		);
	}
}
MentoringCoverSwipe.contextTypes = {
	router: React.PropTypes.object.isRequired
}
MentoringCoverSwipe.propTypes = {
	title: React.PropTypes.string.isRequired,
	price: React.PropTypes.number.isRequired,
	duration: React.PropTypes.number.isRequired,
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
				お礼{this.props.countThx}件&nbsp;
				メンター{this.props.countMentor}人&nbsp;
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
	countThx: React.PropTypes.number.isRequired,
	countMentor: React.PropTypes.number.isRequired,
	countFollower: React.PropTypes.number.isRequired,
}
ThxSummury.defaultProps = {
	rootStyle: {
	},
	countThx: 0,
	countMentor: 0,
	countFollower: 0,
}

export class MentoringDigest extends React.Component {
	constructor(props, context) {
		super(props, context);
	}

	render() {
		const styles = {
			root: {
				width: '98%',
				padding: '0 1%',
			},
			digest: {
				width: '100%',
				fontSize: '0.9rem',
				fontWeight: 'bold',
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
			thxRoot: {
				flexGrow: 2,
				boxSizing: 'border-box',
				fontSize: '0.75rem',
				lineHeight: '1.5rem',
				textAlign: 'right',
			},
		};

		return (
			<div style={styles.root}>
				<div style={styles.digest}>{this.props.digest}</div>
				<div style={styles.starBox}>
					<RatingStar
						rootStyle={styles.starRoot}
						star={this.props.star}
					/>
					<ThxSummury
						rootStyle={styles.thxRoot}
						countThx={this.props.countThx}
						countMentor={this.props.countMentor}
						countFollower={this.props.countFollower}
					/>
				</div>
			</div>
		);
	}
};
MentoringDigest.contextTypes = {
	router: React.PropTypes.object.isRequired
}
MentoringDigest.propTypes = {
	digest: React.PropTypes.string.isRequired,
	star: React.PropTypes.number.isRequired,
	countThx: React.PropTypes.number.isRequired,
	countMentor: React.PropTypes.number.isRequired,
	countFollower: React.PropTypes.number.isRequired,
}

export class MentoringDigestWithAvatar extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.onAvatarTap = this.onAvatarTap.bind(this);
	}

	onAvatarTap(e) {
		this.context.router.push('/mypage/' + this.props.uid);
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
						countThx={this.props.countThx}
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
	uid: React.PropTypes.number.isRequired,
	avatar: React.PropTypes.string.isRequired,
	star: React.PropTypes.number.isRequired,
	digest: React.PropTypes.string.isRequired,
	countThx: React.PropTypes.number.isRequired,
	countMentor: React.PropTypes.number.isRequired,
	countFollower: React.PropTypes.number.isRequired,
}

export class MentoringCard extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			shadow: 1,
		};
		this.onTap = this.onTap.bind(this);
	}

	onTap(e) {
		this.context.router.push('/mentoring/' + this.props.mentoring.id);
	}

	render() {
		const styles = {
			card: {
				position: 'relative',
				flexBasis: '320px',
				flexGrow: 1,
				boxShadow: '0 1px 2px rgba(0,0,0,0.12), 0 1px 1px rgba(0,0,0,0.24), 0 -1px 2px rgba(0,0,0,0.12), 0 -1px 1px rgba(0,0,0,0.24)',
				transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
				marginTop: '16px',
			},
		};
		return (
			<Card
				style={styles.card}
				onTouchTap={this.onTap}
			>
				<MentoringCover
					cover={this.props.mentoring.cover}
					avatar={this.props.mentoring.avatar}
					title={this.props.mentoring.title}
					duration={this.props.mentoring.duration}
					price={this.props.mentoring.price}
				/>
				<MentoringDigest
					digest={this.props.mentoring.digest}
					star={this.props.mentoring.star}
					countThx={this.props.mentoring.countThx}
					countMentor={this.props.mentoring.countMentor}
					countFollower={this.props.mentoring.countFollower}
				/>
			</Card>
		);
	}
};
MentoringCard.contextTypes = {
	router: React.PropTypes.object.isRequired
}
MentoringCard.propTypes = {
	mentoring: React.PropTypes.object.isRequired,
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
			},
		};
		return (
			<section style={styles.root}>
				{this.props.mentorings.map((mentoring, index) => {
					// Todo: change key
					//const key = "mentoring_" + mentoring.id;
					const key = "mentoring_" + index;
					return <MentoringCard key={key} mentoring={mentoring} />
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

