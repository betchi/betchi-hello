import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, History, hashHistory} from 'react-router';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import {Tabs, Tab} from 'material-ui/Tabs';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import ActionHome from 'material-ui/svg-icons/action/home';

import RefreshIndicator from 'material-ui/RefreshIndicator';
import SwipeableViews from 'react-swipeable-views';

import {MentoringList} from './contents.jsx';

export class DrawerMenu extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {open: false};
		this.onToggle = this.onToggle.bind(this);
		this.moveTop = this.moveTop.bind(this);
		this.moveLogin = this.moveLogin.bind(this);
	}

	onToggle(e) {
		this.setState({open: !this.state.open});
	}

	moveTop(e) {
		this.context.router.push('/');
	}

	moveLogin(e) {
		this.context.router.push('/login');
	}

	render() {
		const styles = {
			drawer: {
				backgroundColor: baseTheme.palette.primary1Color,
			},
			drawerItem: {
				color: baseTheme.palette.alternateTextColor,
			}
		};
		return (
			<div>
				<Drawer
					docked={false}
					width={200}
					open={this.state.open}
					onRequestChange={(open) => this.setState({open})}
				>
					<AppBar
						title='mentor'
						showMenuIconButton={false}
					/>
					<MenuItem onTouchTap={this.moveTop} primaryText='Top' leftIcon={<ActionHome />} />
					<MenuItem onTouchTap={this.moveLogin} primaryText='Login' />
				</Drawer>
			</div>
		);
	}
}
DrawerMenu.contextTypes = {
	router: React.PropTypes.object.isRequired
}

export class TopTab extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			tab: 0,
			categories: [
				{label: 'ビジネス', value: 'business'},
				{label: 'デザイン', value: 'design'},
				{label: 'プログラム', value: 'programming'},
				{label: '言語', value: 'language'},
				{label: 'スポーツ', value: 'sports'},
				{label: 'ライフ', value: 'life'},
				{label: '教育', value: 'education'},
				{label: '大学', value: 'university'},
				{label: '音楽', value: 'music'},
			],
		};
		this.onChangeTab = this.onChangeTab.bind(this);
	}

	onChangeTab(tab) {
		this.setState({
			tab: tab,
		});

		// scroll tab
		let box = document.getElementById("tab-box");
		let tabs = 9;
		let scrollLeftMax = box.scrollWidth - box.clientWidth;
		if (tab > 2) {
			let pos = (box.scrollWidth / tabs) * (tab - 2);
			if (pos > scrollLeftMax) {
				pos = scrollLeftMax;
			}
			this.scrollTab(box.scrollLeft, pos);
		} else {
			this.scrollTab(box.scrollLeft, 0);
		}
	}

	scrollTab(cur, pos) {
		if (cur == pos) {
			return;
		}

		let box = document.getElementById("tab-box");
		const step = Math.abs((Math.abs(pos) - Math.abs(cur))) / 10;
		if (pos > cur) {
			const interval = setInterval(() => {
				if (box.scrollLeft < pos) {
					box.scrollLeft += step;
				} else {
					clearInterval(interval);
				}
			}, 15);
		} else {
			const interval = setInterval(() => {
				if (box.scrollLeft > pos) {
					box.scrollLeft -= step;
				} else {
					clearInterval(interval);
				}
			}, 15);
		}
	}

	render() {
		const styles = {
			root: {
				overflow: 'hidden',
			},
			tabsBox: {
				overflowX: 'scroll',
				WebkitOverflowScrolling: 'touch',
				WebkitTransform: 'translateZ(0px)',
			},
			tabs: {
				width: '175%',
			},
		};
		return (
			<div style={styles.root}>
				<div style={styles.tabsBox} id="tab-box">
					<Tabs
						value={this.state.tab}
						onChange={this.onChangeTab}
						style={styles.tabs}
					>
						{this.state.categories.map(function(row, index) {
							return (
								<Tab key={row.value} label={row.label} value={index} />
							);
						})}
					</Tabs>
				</div>
			</div>
		);
	}
}
TopTab.contextTypes = {
	router: React.PropTypes.object.isRequired
}

export class TopPage extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.onDrawerToggle = this.onDrawerToggle.bind(this);
	}

	onDrawerToggle(e) {
		this.refs.drawerMenu.onToggle();
	}

	render() {
		let mentorings = [];
		for (var ii = 0; ii < 10; ii++) {
			mentorings.push({
				cover: '/cover.jpg',
				avatar: '/avatar.jpg',
				title: '海人の生き方教えます。',
				duration: '1時間',
				price: 'いいね値段',
				digest: '海人の杉江です。海人の生き方教えます。',
				star: 3,
				countGood: 10,
				countMentors: 5,
				countFollowers: 10,
			})
		}
		return (
			<section>
				<DrawerMenu 
					ref='drawerMenu'
				/>
				<AppBar
					title='応援し合う世界へ'
					onLeftIconButtonTouchTap={this.onDrawerToggle}
				/>
				<TopTab />
				<MentoringList
					mentorings={mentorings}
				/>
			</section>
		);
	}
}
TopPage.contextTypes = {
	router: React.PropTypes.object.isRequired
}

