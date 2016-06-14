import React from 'react';
import {Router, Route, hashHistory} from 'react-router';
import {Card} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';

import {LoginIcon} from './login.jsx';

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
	register: {
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

export class RegisterForm extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {message: ''};
		this.onSubmit = this.onSubmit.bind(this);
	}

	onSubmit(e) {
		e.preventDefault();
		alert('RegisterForm.onSubmit()');
	}

	render() {
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
					<Divider />
					<TextField
						style={styles.text}
						hintText='パスワード（確認）'
						underlineShow={false}
					/>
				</Card>
				<RaisedButton label="登録" primary={true} style={styles.register} type="submit" />
			</form></section>
		);
	}
};

RegisterForm.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export class RegisterPage extends React.Component {
	render() {
		return (
			<section>
				<LoginIcon />
				<RegisterForm />
			</section>
		);
	}
};

