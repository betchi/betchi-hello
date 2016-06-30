import React from 'react';
import {Router, Route, IndexRoute, History, hashHistory, Link} from 'react-router';
import {Card} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';

export class LoginIcon extends React.Component {
	render() {
		const styles = {
			iconBox: {
				display: 'display:table-cell',
				width: '42px',
				height: '200px',
				margin: 'auto',
			},
			icon: {
				width: '100%',
				marginTop: '75px',
			},
		}
		return (
			<section style={styles.iconBox}>
				<Link to={'/'}><img src="/assets/img/icon.png" style={styles.icon} /></Link>
			</section>
		);
	}
};

export class LoginForm extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {message: ''};
		this.onSubmit = this.onSubmit.bind(this);
		this.onTapRegister = this.onTapRegister.bind(this);
	}

	onSubmit(e) {
		e.preventDefault();
		alert('LoginForm.onSubmit()');
	}

	onTapRegister(e) {
		this.context.router.push('/register');
	}

	render() {
		const styles = {
			formBox: {
				width: '100%',
				maxWidth: '30rem',
				margin: 'auto',
			},
			form: {
				margin: '8px',
			},
			card: {
			},
			text: {
				fontSize: '0.8rem',
				width: '90%',
				marginLeft: '1rem',
				marginRight: '1rem',
				lineHeight: '1.5rem',
			},
			login: {
				width: '100%',
				maxWidth: '30rem',
				marginTop: '0.5rem',
			},
			register: {
				width: '100%',
				maxWidth: '30rem',
				marginTop: '0.5rem',
			},
		};

		return (
			<section style={styles.formBox}><form style={styles.form} onSubmit={this.onSubmit}>
				<Card
					style={styles.card}
				>
					<TextField
						style={styles.text}
						hintText='メールアドレス'
						underlineShow={false}
					/>
					<Divider />
					<TextField
						style={styles.text}
						hintText='パスワード'
						underlineShow={false}
					/>
				</Card>
				<RaisedButton label="ログイン" primary={true} style={styles.login} type="submit" />
				<RaisedButton label="新規登録" primary={true} style={styles.register} onTouchTap={this.onTapRegister} />
			</form></section>
		);
	}
};

LoginForm.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export class LoginPage extends React.Component {
	componentWillMount() {
		document.bgColor = '#303F9F';
	}

	componentWillUnmount() {
		document.bgColor = '#E8EAF6';
	}

	render() {
		return (
			<section>
				<LoginIcon />
				<LoginForm />
				{this.props.children}
			</section>
		);
	}
};

