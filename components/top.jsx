import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, History, hashHistory} from 'react-router';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import {Card} from 'material-ui/Card';
import {Tabs, Tab} from 'material-ui/Tabs';
import AppBar from 'material-ui/AppBar';
import ActionSearch from 'material-ui/svg-icons/action/search';
import Snackbar from 'material-ui/Snackbar';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import IconButton from 'material-ui/IconButton';

import HeadRoom from 'react-headroom';

import {DrawerMenu} from './menu.jsx';
import {MentoringList} from './content.jsx';

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
				backgroundColor: baseTheme.palette.primary1Color,
			},
			tabsBox: {
				overflowX: 'scroll',
				WebkitOverflowScrolling: 'touch',
				WebkitTransform: 'translateZ(0px)',
			},
			tabs: {
				width: '175%',
			},
			tab: {
				fontWeight: 'bold',
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
								<Tab style={styles.tab} key={row.value} label={row.label} value={index} />
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
			},
			refreshStyle: {
				position: 'relative',
				display: 'inline-block',
			},
			searchBoxStyle: {
				position: 'fixed',
				top: 0,
				width: '100%',
				height: '64px',
				zIndex: 0,
			},
			category: 'business',
			page: 1,
		};
		this.onDrawerToggle = this.onDrawerToggle.bind(this);
		this.onSnackClose = this.onSnackClose.bind(this);
		this.loadContents = this.loadContents.bind(this);
		this.onScroll = this.onScroll.bind(this);
		this.onSearchOpen = this.onSearchOpen.bind(this);
	}

	componentDidMount() {
		this.loadContents();
	}

	componentWillReceiveProps(nextProps) {
		window.removeEventListener('scroll', this.onScroll);
		this.loadContents();
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.onScroll);
	}

	loadContents(category = 'business', page = 1) {
		let xhr = new XMLHttpRequest();
		xhr.open('GET', '/' + category + '.json?p=' + page);
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
			let mentorings = [];
			let data = JSON.parse(xhr.responseText);
			if (page === 1) {
				mentorings = data;
			} else {
				mentorings = this.state.mentorings.slice();
				for (var ii in data) {
					mentorings.push(data[ii]);
				}
			}
			this.setState({
				mentorings: mentorings,
			});
			this.state.category = category;
			this.state.page = page;

			if (mentorings.length == 0) {
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

	onScroll(e) {
		let body = window.document.body;
		let html = window.document.documentElement;
		let scrollTop = body.scrollTop || html.scrollTop;
		let bottom = html.scrollHeight - html.clientHeight - scrollTop;
		if (bottom <= 60) {
			window.removeEventListener('scroll', this.onScroll);
			this.loadContents(this.state.category, this.state.page + 1);
		}
	}

	onDrawerToggle(e) {
		this.refs.drawerMenu.onToggle();
	}

	onSearchOpen(e) {
		this.context.router.push('/search');
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
			title: {
				fontSize: '1.2rem',
				fontWeight: 'bold',
			},
			refreshBox: {
				position: 'relative',
				margin: '16px 0',
				width: '100%',
			},
			refreshMargin: {
				width: '40px',
				margin: 'auto',
			},
		}
		return (
			<section>
				<DrawerMenu 
					ref='drawerMenu'
				/>
				<HeadRoom
					style={styles.headroom}
				>
					<AppBar
						title='応援し合う世界へ'
						titleStyle={styles.title}
						onLeftIconButtonTouchTap={this.onDrawerToggle}
						iconElementRight={
							<IconButton
								onTouchTap={this.onSearchOpen}
							>
								<ActionSearch />
							</IconButton>
						}
					/>
					<TopTab loadContents={this.loadContents} />
				</HeadRoom>
				<MentoringList
					mentorings={this.state.mentorings}
				/>
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
			</section>
		);
	}
}
TopPage.contextTypes = {
	router: React.PropTypes.object.isRequired
}

