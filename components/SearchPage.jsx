import React from 'react';
import ReactDOM from 'react-dom';

import HeadRoom from 'react-headroom';
import {Router, Route, IndexRoute, History, hashHistory} from 'react-router';
import SwipeableViews from 'react-swipeable-views';

import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import {Card} from 'material-ui/Card';
import {Tabs, Tab} from 'material-ui/Tabs';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import ContentClear from 'material-ui/svg-icons/content/clear';
import Snackbar from 'material-ui/Snackbar';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';

import {MentoringList} from './content.jsx';
import {Tabbar} from './Tabbar.jsx';

export class SearchPage extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			mentorings: [],
			snack: {
				open: false,
				message: '',
			},
			refreshStyle: {
				display: 'none',
			},
			clearIconStyle: {
				position: 'absolute',
				width: '48px',
				top: 8,
				right: 4,
				display: 'none',
			},
			page: 1,
			q: '',
		};
		this.onSnackClose = this.onSnackClose.bind(this);
		this.searchContents = this.searchContents.bind(this);
		this.onScroll = this.onScroll.bind(this);
		this.onBack = this.onBack.bind(this);
		this.onClear = this.onClear.bind(this);
		this.onSearchChange = this.onSearchChange.bind(this);
		this.onSearch = this.onSearch.bind(this);
	}

	componentDidMount() {
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.onScroll);
	}

	searchContents(q = '', page = 1) {
		if (q === '') {
			this.setState({
				snack: {
					open: true,
					message: '検索キーワードを入力してください。',
				},
				refreshStyle: {
					display: 'none',
				},
			});
			return;
		}

		let xhr = new XMLHttpRequest();
		xhr.open('GET', '/api/mentorings/business/' + page);
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
				mentorings = data.mentorings;
			} else {
				mentorings = this.state.mentorings.slice();
				for (var ii in data.mentorings) {
					mentorings.push(data.mentorings[ii]);
				}
			}
			this.setState({
				mentorings: mentorings,
				page: page,
			});

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

			if (!data.hasNext) {
				this.setState({
					refreshStyle: {
						display: 'none',
					},
				});
			} else {
				window.addEventListener('scroll', this.onScroll);
			}
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
			this.searchContents(this.state.q, this.state.page + 1);
		}
	}

	onClear(e) {
		this.setState({
			q: '',
			mentorings: [],
			refreshStyle: {
				display: 'none',
			},
		});
	}

	onBack(e) {
		this.context.router.goBack();
	}

	onSearchChange(e) {
		let value = e.target.value.trimLeft();
		if (0 < value.length) {
			this.setState({
				q: value,
				clearIconStyle: {
					position: 'absolute',
					width: '48px',
					top: 8,
					right: '2%',
					display: 'inline-block',
				},
			});
		}
		this.setState({
			q: value
		});
	}

	onSearch(e) {
		e.preventDefault();
		this.setState({
			mentorings: [],
		});
		this.refs.searchTextField.blur();
		this.searchContents(this.state.q, this.state.page);
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
			searchBoxStyle: {
				//	position: 'fixed',
				top: 0,
				width: '97%',
				height: '64px',
				zIndex: 9999,
			},
			backIcon: {
				position: 'absolute',
				width: '48px',
				top: 8,
				left: '2%',
			},
			searchText: {
				boxSizing: 'border-box',
				width: '100%',
				margin: '8px 5px 0 5px',
				padding: '0 10px',
				fontSize: '1rem',
				lineHeight: '1.5rem',
				backgroundColor: 'white',
				border: '1px solid #ececec',
			},
			topMargin: {
				marginTop: '64px',
			},
			refreshBox: {
				position: 'relative',
				width: '100%',
			},
			refreshMargin: {
				width: '40px',
				margin: 'auto',
			},
		}
		return (
			<section>
				<div style={styles.searchBoxStyle}>
					<form onSubmit={this.onSearch}>
						<TextField
							style={styles.searchText}
							hintText='メンタリングを検索'
							underlineShow={false}
							value={this.state.q}
							onChange={this.onSearchChange}
							ref='searchTextField'
						/>
						<IconButton
							style={this.state.clearIconStyle}
							onTouchTap={this.onClear}
						>
							<ContentClear />
						</IconButton>
					</form>
				</div>
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
				<Tabbar value={"search"} />
			</section>
		);
	}
}
SearchPage.contextTypes = {
	router: React.PropTypes.object.isRequired
}

