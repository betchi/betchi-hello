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
import Snackbar from 'material-ui/Snackbar';

import RefreshIndicator from 'material-ui/RefreshIndicator';
import SwipeableViews from 'react-swipeable-views';
import HeadRoom from 'react-headroom';

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
		let category = this.state.categories[tab];
		this.props.loadContents(category.value);

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

TopTab.propTypes = {
	loadContents: React.PropTypes.func.isRequired
}

export class TopPage extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			mentorings: [],
			snack: {
				open: false,
				message: '',
			}
		};
		this.onDrawerToggle = this.onDrawerToggle.bind(this);
		this.onSnackClose = this.onSnackClose.bind(this);
		this.loadContents = this.loadContents.bind(this);
	}

	componentDidMount() {
		this.loadContents('business');
	}

	loadContents(category) {
		let xhr = new XMLHttpRequest();
		xhr.open('GET', '/' + category + '.json');
		xhr.onload = () => {
			if (xhr.status !== 200) {
				this.setState({
					snack: {
						open: true,
						message: '通信に失敗しました。',
					}
				});
				return;
			}
			let mentorings = JSON.parse(xhr.responseText);
			this.setState({
				mentorings: mentorings,
			});
			if (mentorings.length == 0) {
				this.setState({
					snack: {
						open: true,
						message: '検索ヒット0件です。',
					}
				});
				return;
			}
			window.scrollTo(0,0);
		}
		xhr.send();
	}

	onDrawerToggle(e) {
		this.refs.drawerMenu.onToggle();
	}

	onSnackClose(e) {
		this.setState({
			snack: {
				open: false,
				message: '',
			}
		})
	}

	render() {
		const styles = {
			headroom: {
				WebkitTransition: 'all .3s ease-in-out',
				MozTransition: 'all .3s ease-in-out',
				OTransition: 'all .3s ease-in-out',
				transition: 'all .3s ease-in-out',
			},
		}
		return (
			<section>
				<DrawerMenu 
					ref='drawerMenu'
				/>
				<HeadRoom style={styles.headroom}>
					<AppBar
						title='応援し合う世界へ'
						onLeftIconButtonTouchTap={this.onDrawerToggle}
					/>
					<TopTab loadContents={this.loadContents} />
				</HeadRoom>
				<MentoringList
					mentorings={this.state.mentorings}
				/>
				<Snackbar
					open={this.state.snack.open}
					message={this.state.snack.message}
					autoHideDuration={4000}
					onRequestClose={this.onSnackClose}
				/>
			</section>
		);
	}
}
TopPage.contextTypes = {
	router: React.PropTypes.object.isRequired
}

