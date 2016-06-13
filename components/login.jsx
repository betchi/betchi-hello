import React from 'react';
import {Router, Route, hashHistory} from 'react-router';
import {Card} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';

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
	form: {
		width: '100%',
		maxWidth: '30rem',
		margin: 'auto',
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

export class LoginIcon extends React.Component {
	render() {
		return (
			<section style={styles.iconBox}>
				<img src="/assets/img/icon.png" style={styles.icon} />
			</section>
		);
	}
};

export class LoginForm extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {message: ''};
	}

	handleSubmit(e) {
		e.preventDefault();
		alert('LoginForm.handleSubmit()');
	}

	handleClickRegister(e) {
		e.preventDefault();
		this.context.router.push('/');
	}

	render() {
		return (
			<section style={styles.form}><form onSubmit={(event) => this.handleSubmit(event)}>
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
				<RaisedButton label="新規登録" primary={true} style={styles.register} onClick={(event) => this.handleClickRegister(event)} />
			</form></section>
		);
	}
};

LoginForm.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export class LoginPage extends React.Component {
	render() {
		return (
			<article>
				<LoginIcon />
				<LoginForm />
				{this.props.children}
			</article>
		);
	}
};

