import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, History, hashHistory} from 'react-router';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import {LoginPage} from './components/login.jsx';

ReactDOM.render(
	<MuiThemeProvider muiTheme={getMuiTheme()}>
		<LoginPage />
	</MuiThemeProvider>
	,document.getElementById("content")
);

