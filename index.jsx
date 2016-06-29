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
import {SearchPage} from './components/search.jsx';
import {MentoringPage} from './components/mentoring.jsx';
import {MyPage} from './components/mypage.jsx';

ReactDOM.render(
	<MuiThemeProvider muiTheme={getMuiTheme()}>
		<Router history={hashHistory}>
			<Route path="/" component={TopPage} />
			<Route path="/login" component={LoginPage} />
			<Route path="/register" component={RegisterPage} />
			<Route path="/search" component={SearchPage} />
			<Route path="/mentoring/:id" component={MentoringPage} />
			<Route path="/mypage/:id" component={MyPage} />
		</Router>
	</MuiThemeProvider>
	,document.getElementById("content")
);

