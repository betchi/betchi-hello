import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import {Router, Route, IndexRoute, History, hashHistory} from 'react-router';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import {LoginPage} from './components/login.jsx';
import {RegisterPage} from './components/register.jsx';
import {TopPage} from './components/top.jsx';
import {ChatPage} from './components/chat.jsx';
import {SearchPage} from './components/search.jsx';
import {MentoringPage,EditMentoringPage} from './components/mentoring.jsx';
import {MyPage} from './components/mypage.jsx';
import {OffersPage} from './components/offers.jsx';
//import {MessageList} from './components/messageList.js';

Object.defineProperty(String.prototype, 'isValidEmail', {
	writable: false,
	configurable: false,
	enumerable: false,
	value: function() {
		let re = /\S+@\S+\.\S+/;
		return re.test(this);
	}
});

Object.defineProperty(Storage.prototype, 'user', {
	configurable: true,
	enumerable: false,
	set: function(user) {
		if (user == null || !user.id || !user.username) {
			this.removeItem('user');
		} else {
			this.setItem('user', JSON.stringify(user));
		}
	},
	get: function() {
		const user = this.getItem('user');
		if (user == null) {
			return null;
		}
		try {
			return JSON.parse(user);
		} catch (e) {
			this.removeItem('user');
			return null
		}
	}
});

function requireAuth(next, replace) {
	const goLogin = () => {
		sessionStorage.user = null;
		replace({
			pathname: '/login',
			state: {
				nextPathname: next.location.pathname
			}
		});
	}
	const xhr = new XMLHttpRequest();
	xhr.open('GET', '/api/user', false); // synchronous
	xhr.onload = () => {
		if (xhr.status !== 200) {
			return;
		}
		const data = JSON.parse(xhr.responseText);
		if (!data.ok) {
			goLogin();
			return
		}
		sessionStorage.user = data.user;
	};
	xhr.send();
	console.log(sessionStorage.user);
}

ReactDOM.render(
	<MuiThemeProvider muiTheme={getMuiTheme()}>
		<Router history={hashHistory}>
			<Route path="/" component={TopPage} onEnter={requireAuth} />
			<Route path="/login" component={LoginPage} />
			<Route path="/register" component={RegisterPage} />
			<Route path="/search" component={SearchPage} onEnter={requireAuth} />
			<Route path="/chat/:mentoringId/:offerUserId/:mentoringTitle" component={ChatPage} onEnter={requireAuth} />
			<Route path="/mentoring/:id" component={MentoringPage} onEnter={requireAuth} />
			<Route path="/mentoring/:id/edit" component={EditMentoringPage} onEnter={requireAuth} />
			<Route path="/mypage/:id" component={MyPage} onEnter={requireAuth} />
			<Route path="/offers/:mentoringId/:mentoringTitle" component={OffersPage} onEnter={requireAuth} />
		</Router>
	</MuiThemeProvider>
	,document.getElementById("content")
);

