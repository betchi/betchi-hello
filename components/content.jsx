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
		this.onTap = this.onTap.bind(this);
	}

	onTap(e) {
		this.context.router.push('/register');
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
				<img style={styles.cover} src={this.props.cover} />
				<img style={styles.avatar} src={this.props.avatar} />
				<div style={styles.title}>{this.props.title}</div>
				<div style={styles.price}>{this.props.duration}&nbsp;{this.props.price}</div>
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
				<div style={styles.price}>{this.props.duration}&nbsp;{this.props.price}</div>
			</div>
		);
	}
}
MentoringCoverSwipe.contextTypes = {
	router: React.PropTypes.object.isRequired
}
MentoringCoverSwipe.propTypes = {
	title: React.PropTypes.string.isRequired,
	price: React.PropTypes.string.isRequired,
	duration: React.PropTypes.string.isRequired,
	covers: React.PropTypes.array.isRequired,
}


export class MentoringDigest extends React.Component {
	constructor(props, context) {
		super(props, context);
	}

	render() {
		const styles = {
			digestBox: {
				width: '98%',
				padding: '0 1%',
			},
			digest: {
				width: '100%',
				fontSize: '0.9rem',
				fontWeight: 'bold',
			},
			starBox: {
				display: 'inline-block',
				width: '30%',
			},
			star: {
				width: '16px',
			},
			thxBox: {
				display: 'inline-block',
				width: '70%',
				fontSize: '0.75rem',
				lineHeight: '1.5rem',
				textAlign: 'right',
				verticalAlign: 'top',
			},
		};
		let stars = [];
		for (var ii = 0; ii < 5; ii++) {
			if (1 <= this.props.star - ii) {
				stars.push(1);
			} else if (0 > this.props.star - ii) {
				stars.push(0);
			} else {
				stars.push(0.5);
			}
		}
		return (
			<div style={styles.digestBox}>
				<div style={styles.digest}>{this.props.digest}</div>
				<div style={styles.starBox}>
				{stars.map((star, index) => {
					const key = "star" + index;
					if (0 == star) {
						return <StarBorder key={key} style={styles.star} />
					} else if (1 == star) {
						return <Star key={key} style={styles.star} />
					}
					return <StarHalf key={key} style={styles.star} />
				})}
				</div>
				<div style={styles.thxBox}>
					お礼{this.props.countThx}件&nbsp;
					メンター{this.props.countMentors}人&nbsp;
					フォロー{this.props.countFollowers}人&nbsp;
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
	countMentors: React.PropTypes.number.isRequired,
	countFollowers: React.PropTypes.number.isRequired,
}

export class MentoringDigestWithAvatar extends React.Component {
	constructor(props, context) {
		super(props, context);
	}

	render() {
		const styles = {
			box: {
				width: '100%',
				verticalAlign: 'middle',
			},
			avatarBox: {
				display: 'inline-block',
				boxSizing: 'border-box',
				width: '22%',
				marginLeft: '3%',
				verticalAlign: 'middle',
				borderRadius: '50%',
			},
			avatar: {
				width:  '100%',
			},
			starBox: {
				width: '100%',
			},
			star: {
				width: '16px',
			},
			digestBox: {
				display: 'inline-block',
				boxSizing: 'border-box',
				width: '73%',
				padding: '0 1%',
				verticalAlign: 'middle',
			},
			digest: {
				width: '100%',
				fontSize: '1rem',
				fontWeight: 'bold',
				verticalAlign: 'middle',
			},
			thxBox: {
				display: 'inline-block',
				width: '100%',
				fontSize: '0.75rem',
				lineHeight: '1.5rem',
				textAlign: 'right',
				marginTop: '1rem',
				verticalAlign: 'bottom',
			},
		};
		let stars = [];
		for (var ii = 0; ii < 5; ii++) {
			if (1 <= this.props.star - ii) {
				stars.push(1);
			} else if (0 > this.props.star - ii) {
				stars.push(0);
			} else {
				stars.push(0.5);
			}
		}
		return (
			<div style={styles.box}>
				<div style={styles.avatarBox}>
					<img src={this.props.avatar} style={styles.avatar} />
					<div style={styles.starBox}>
					{stars.map((star, index) => {
						const key = "star" + index;
						if (0 == star) {
							return <StarBorder key={key} style={styles.star} />
						} else if (1 == star) {
							return <Star key={key} style={styles.star} />
						}
						return <StarHalf key={key} style={styles.star} />
					})}
					</div>
				</div>
				<div style={styles.digestBox}>
					<div style={styles.digest}>{this.props.digest}</div>
					<div style={styles.thxBox}>
						お礼{this.props.countThx}件&nbsp;
						メンター{this.props.countMentors}人&nbsp;
						フォロー{this.props.countFollowers}人&nbsp;
					</div>
				</div>
			</div>
		);
	}
};
MentoringDigestWithAvatar.contextTypes = {
	router: React.PropTypes.object.isRequired
}
MentoringDigestWithAvatar.propTypes = {
	avatar: React.PropTypes.string.isRequired,
	star: React.PropTypes.number.isRequired,
	digest: React.PropTypes.string.isRequired,
	countThx: React.PropTypes.number.isRequired,
	countMentors: React.PropTypes.number.isRequired,
	countFollowers: React.PropTypes.number.isRequired,
}

export class MentoringCard extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.onTap = this.onTap.bind(this);
	}

	onTap(e) {
		this.context.router.push('/mentoring/' + this.props.mentoring.id);
	}

	render() {
		const styles = {
			card: {
				width: '100%',
				boxShadow: '0 1px 2px rgba(0,0,0,0.12), 0 1px 1px rgba(0,0,0,0.24), 0 -1px 2px rgba(0,0,0,0.12), 0 -1px 1px rgba(0,0,0,0.24)',
				transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
				marginTop: '16px',
			},
		};
		return (
			<Card style={styles.card} onTouchTap={this.onTap}>
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
					countMentors={this.props.mentoring.countMentors}
					countFollowers={this.props.mentoring.countFollowers}
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
			list: {
			},
		};
		return (
			<section style={styles.list}>
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

