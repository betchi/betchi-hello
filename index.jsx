import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import {Router, Route, IndexRoute, History, hashHistory} from 'react-router';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import {FirstPage} from './components/FirstPage.jsx';
import {TopPage} from './components/TopPage.jsx';
import {LoginPage} from './components/LoginPage.jsx';
import {RegisterPage} from './components/RegisterPage.jsx';
import {MentoringPage,EditMentoringPage} from './components/MentoringPage.jsx';
import {ChatPage} from './components/ChatPage.jsx';
import {SearchPage} from './components/SearchPage.jsx';
import {MyPage} from './components/MyPage.jsx';
import {OffersPage} from './components/OffersPage.jsx';
import {ParticipantsListPage} from './components/ParticipantsListPage.jsx';

var _colorManipulator = require('material-ui/utils/colorManipulator');

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
			pathname: '/first',
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
}

var muiTheme = getMuiTheme();

var Parent = React.createClass({
    childContextTypes: {
        categories: React.PropTypes.array,
        colors: React.PropTypes.object,
    },

    getChildContext: function () {
		let xhr = new XMLHttpRequest();
		xhr.open('GET', '/categories.json', false);
		xhr.send();
		let data = JSON.parse(xhr.responseText);

		let childContext = {
			categories: data.categories,
			colors: {
				/*
				bg1:"#303f9f",
				bg2:"#3f51b5",
				bg3: "#1976d2",
				text1: "#FAFAFA",
				text2: "#F5F5F5",
				black1: "#212121",
				fluorescent1: "#536dfe",
				*/
				bg1:"#FAFAFA",
				bg2:"#3f51b5",
				bg3: "#1976d2",
				text1: "#424242",
				text2: "#F5F5F5",
				white: "#F5F5F5",
				black: "#212121",
				grey: "#9E9E9E",
				lightGrey: "#E0E0E0",
				fluorescent1: "#303f9f",
				error: "#F06292",
			},
		}
		muiTheme.textField.focusColor = childContext.colors.grey;
		muiTheme.textField.textColor = childContext.colors.grey;
		muiTheme.textField.borderColor = childContext.colors.lightGrey;
		muiTheme.textField.borderColor = childContext.colors.lightGrey;
		muiTheme.tabs.backgroundColor = childContext.colors.white;
		muiTheme.tabs.textColor = (0, _colorManipulator.fade)(childContext.colors.bg2, 0.7);
		muiTheme.tabs.selectedTextColor = childContext.colors.bg2;
		//muiTheme.textField.textColor = childContext.colors.black;
		//muiTheme.textField.floatingLabelColor = childContext.colors.black;
		muiTheme.textField.errorColor = childContext.colors.error;
		return childContext;
    },

    render: function () {
        return (
			<MuiThemeProvider muiTheme={muiTheme}>
				<Router history={hashHistory}>
					<Route path="/" component={TopPage} onEnter={requireAuth} />
					<Route path="/first" component={FirstPage} />
					<Route path="/top" component={TopPage} onEnter={requireAuth} />
					<Route path="/login" component={LoginPage} />
					<Route path="/register" component={RegisterPage} />
					<Route path="/search" component={SearchPage} onEnter={requireAuth} />
					<Route path="/mentoring/new" component={EditMentoringPage} onEnter={requireAuth} />
					<Route path="/mentoring/:id" component={MentoringPage} onEnter={requireAuth} />
					<Route path="/mentoring/:id/edit" component={EditMentoringPage} onEnter={requireAuth} />
					<Route path="/mypage/:id" component={MyPage} onEnter={requireAuth} />
					<Route path="/chat/:mentoringId/:offerUserId/:mentoringTitle" component={ChatPage} onEnter={requireAuth} />
					<Route path="/offers/:mentoringId/:mentoringTitle" component={OffersPage} onEnter={requireAuth} />
					<Route path="/participantsList/:mentoringId/:mentoringTitle" component={ParticipantsListPage} onEnter={requireAuth} />
				</Router>
			</MuiThemeProvider>
		);
    }
});

ReactDOM.render(
	<Parent />, document.getElementById("content")
);

