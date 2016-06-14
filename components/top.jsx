import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, History, hashHistory} from 'react-router';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';

import ActionHome from 'material-ui/svg-icons/action/home';

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

export class TopPage extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.onDrawerToggle = this.onDrawerToggle.bind(this);
	}

	onDrawerToggle(e) {
		this.refs.drawerMenu.onToggle();
	}

	render() {
		return (
			<section>
				<DrawerMenu 
					ref='drawerMenu'
				/>
				<AppBar
					title='応援し合う世界へ'
					onLeftIconButtonTouchTap={this.onDrawerToggle}
				/>
				TOP
				{this.props.children}
			</section>
		);
	}
}
TopPage.contextTypes = {
  router: React.PropTypes.object.isRequired
}

