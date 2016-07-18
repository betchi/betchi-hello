import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, History, hashHistory} from 'react-router';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import ActionHome from 'material-ui/svg-icons/action/home';
import ActionSearch from 'material-ui/svg-icons/action/search';
import IconButton from 'material-ui/IconButton';

export class DrawerMenu extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {open: false};
		this.onToggle = this.onToggle.bind(this);
		this.moveTop = this.moveTop.bind(this);
		this.moveChat1 = this.moveChat1.bind(this);
		this.moveChat2 = this.moveChat2.bind(this);
		this.moveChat3 = this.moveChat3.bind(this);
		this.moveSearch = this.moveSearch.bind(this);
		this.moveLogin = this.moveLogin.bind(this);
		this.moveLogout = this.moveLogout.bind(this);
	}

	onToggle(e) {
		this.setState({open: !this.state.open});
	}

	moveTop(e) {
		this.onToggle(e);
		this.context.router.push('/');
	}

	moveSearch(e) {
		this.onToggle(e);
		this.context.router.push('/search');
	}

	moveChat1(e) {
    this.context.router.push({ pathname: '/chat', query: {userId: 1, roomId: 1, name: "すぎえ"}});
	}

	moveChat2(e) {
    this.context.router.push({ pathname: '/chat', query: {userId: 2, roomId: 1, name: "みのべ"}});
	}

	moveChat3(e) {
    this.context.router.push({ pathname: '/chat', query: {userId: 3, roomId: 1, name: "やまだ"}});
	}

	moveLogin(e) {
		this.onToggle(e);
		this.context.router.push('/login');
	}

	moveLogout(e) {
		this.onToggle(e);
		const xhr = new XMLHttpRequest();
		xhr.open('GET', '/api/logout', false); // synchronous
		xhr.onload = () => {
			if (xhr.status !== 200) {
				return;
			}
			const data = JSON.parse(xhr.responseText);
			if (!data.ok) {
			}
		};
		xhr.send();

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
					<MenuItem onTouchTap={this.moveSearch} primaryText='Search' leftIcon={<ActionSearch />} />
					<MenuItem onTouchTap={this.moveChat1} primaryText='Chat(sugie)' leftIcon={<ActionSearch />} />
					<MenuItem onTouchTap={this.moveChat2} primaryText='Chat(minobe)' leftIcon={<ActionSearch />} />
					<MenuItem onTouchTap={this.moveChat3} primaryText='Chat(yamada)' leftIcon={<ActionSearch />} />
					{(() => {
						return this.props.loggedIn ? '' : <MenuItem onTouchTap={this.moveLogin} primaryText='Login' />
					})()}
					{(() => {
						return this.props.loggedIn ? <MenuItem onTouchTap={this.moveLogout} primaryText='Logout' /> : ''
					})()}
				</Drawer>
			</div>
		);
	}
}
DrawerMenu.contextTypes = {
	router: React.PropTypes.object.isRequired
}
DrawerMenu.propTypes = {
	loggedIn: React.PropTypes.bool.isRequired,
}

