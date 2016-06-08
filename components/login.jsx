import React from 'react';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
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
	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.state = {message: ''};
	}

	handleSubmit() {
		console.log('LoginForm.handleSubmit()');
	}

	render() {
		return (
			<section style={styles.form}><form>
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
				<RaisedButton label="ログイン" primary={true} style={styles.login}/>
				<RaisedButton label="新規登録" primary={true} style={styles.register}/>
			</form></section>
		);
	}
};

export class LoginPage extends React.Component {
	render() {
		return (
			<article>
				<LoginIcon />
				<LoginForm />
			</article>
		);
	}
};

