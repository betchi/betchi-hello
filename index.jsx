import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, History, hashHistory} from 'react-router';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import {LoginPage} from './components/login.jsx';

export class Top extends React.Component {
	render() {
		return (
			<div>
				top
				{this.props.children}
			</div>
		);
	}
};

ReactDOM.render(
	<MuiThemeProvider muiTheme={getMuiTheme()}>
		<Router history={hashHistory}>
			<Route path="/" component={Top} />
			<Route path="/login" component={LoginPage} />
		</Router>
	</MuiThemeProvider>
	,document.getElementById("content")
);

