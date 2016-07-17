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
import {MentoringPage} from './components/mentoring.jsx';
import {MyPage} from './components/mypage.jsx';
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

Object.defineProperty(Storage.prototype, 'loggedIn', {
	configurable: true,
	enumerable: false,
	set: function(loggedIn) {
		this.setItem('loggedIn', loggedIn);
	},
	get: function() {
		return (this.getItem('loggedIn') === 'true');
	}
});

function requireAuth(next, replace) {
	const goLogin = () => {
		sessionStorage.loggedIn = false;
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
		sessionStorage.loggedIn = true;
	};
	xhr.send();
}

ReactDOM.render(
	<MuiThemeProvider muiTheme={getMuiTheme()}>
		<Router history={hashHistory}>
			<Route path="/" component={TopPage} onEnter={requireAuth} />
			<Route path="/login" component={LoginPage} />
			<Route path="/register" component={RegisterPage} />
			<Route path="/search" component={SearchPage} />
			<Route path="/chat" component={ChatPage} />
			<Route path="/mentoring/:id" component={MentoringPage} />
			<Route path="/mypage/:id" component={MyPage} />
		</Router>
	</MuiThemeProvider>
	,document.getElementById("content")
);

