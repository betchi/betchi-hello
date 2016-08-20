import React from 'react';
import {Router, Route, IndexRoute, History, hashHistory, Link} from 'react-router';

import {Card} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';

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
		this.state = {
			message: '',
			email: '',
			password: '',
			errorEmail: '',
			errorPassword: '',
			snack: {
				open: false,
				message: '',
			},
		};
		this.onSnackClose = this.onSnackClose.bind(this);
		this.onTapRegister = this.onTapRegister.bind(this);
		this.onInputEmail = this.onInputEmail.bind(this);
		this.onInputPassword = this.onInputPassword.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	componentWillMount() {
		if (sessionStorage.user != null) {
			this.context.router.push('/');
		}
	}

	onSubmit(e) {
		e.preventDefault();
		this.refs.emailTextField.blur();
		this.refs.passwordTextField.blur();
		this.setState({
			errorEmail: '',
			errorPassword: ''
		})

		var error = false
		const email = this.state.email
		const password = this.state.password

		if (!email.isValidEmail()) {
			this.setState({
				errorEmail: 'メールアドレスを正しく入力してください',
			});
			error = true
		}

		if (4 > password.length) {
			this.setState({
				errorPassword: 'パスワードを4文字以上で入力してください',
			});
			error = true
		}

		if (error) {
			return
		}

		const xhr = new XMLHttpRequest();
		xhr.open('POST', '/api/login', false);
		xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
		xhr.onload = () => {
			if (xhr.status !== 200) {
				this.setState({
					snack: {
						open: true,
						message: '通信に失敗しました。',
					},
				});
				return;
			}
			let data = JSON.parse(xhr.responseText);
			if (data.ok == false) {
				this.setState({
					snack: {
						open: true,
						message: 'ログインに失敗しました。',
					},
				});
				return;
			}
			this.context.router.push('/');
		}
		xhr.send(JSON.stringify({email:this.state.email, password:this.state.password}));
		return
	}

	onTapRegister(e) {
		this.context.router.push('/register');
	}

	onInputEmail(e) {
		this.setState({
			email: e.target.value.trim()
		})
	}

	onInputPassword(e) {
		this.setState({
			password: e.target.value.trim()
		})
	}

	onSnackClose(e) {
		this.setState({
			snack: {
				open: false,
				message: '',
			}
		})
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
			<section style={styles.formBox}>
				<form style={styles.form} onSubmit={this.onSubmit}>
					<Card
						style={styles.card}
					>
						<TextField
							style={styles.text}
							hintText='メールアドレス'
							errorText={this.state.errorEmail}
							underlineShow={false}
							value={this.state.email}
							type="email"
							onChange={this.onInputEmail}
							ref='emailTextField'
						/>
						<Divider />
						<TextField
							style={styles.text}
							hintText='パスワード'
							errorText={this.state.errorPassword}
							underlineShow={false}
							type="password"
							value={this.state.password}
							onChange={this.onInputPassword}
							ref='passwordTextField'
						/>
					</Card>
					<RaisedButton label="ログイン" primary={true} style={styles.login} type="submit" />
					<RaisedButton label="新規登録" primary={true} style={styles.register} onTouchTap={this.onTapRegister} />
				</form>
				<Snackbar
					open={this.state.snack.open}
					message={this.state.snack.message}
					autoHideDuration={4000}
					onRequestClose={this.onSnackClose}
				/>
			</section>
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

