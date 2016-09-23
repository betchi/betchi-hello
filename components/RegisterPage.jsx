import React from 'react';
import {Router, Route, IndexRoute, History, hashHistory} from 'react-router';

import {Card} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';

import {LoginIcon} from './LoginPage.jsx';

export class RegisterForm extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			message: '',
			email: '',
			password: '',
			passwordConfirm: '',
			errorEmail: '',
			errorPassword: '',
			errorPasswordConfirm: '',
			snack: {
				open: false,
				message: '',
			},
		};
		this.onSnackClose = this.onSnackClose.bind(this);
		this.onTapLogin = this.onTapLogin.bind(this);
		this.onInputEmail = this.onInputEmail.bind(this);
		this.onInputPassword = this.onInputPassword.bind(this);
		this.onInputPasswordConfirm = this.onInputPasswordConfirm.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.onBack = this.onBack.bind(this);
	}

	componentWillMount() {
		if (sessionStorage.user != null) {
			this.context.router.push('/');
		}
	}

	onBack(e) {
		this.context.router.goBack();
	}

	onSubmit(e) {
		e.preventDefault();
		this.refs.emailTextField.blur();
		this.refs.passwordTextField.blur();
		this.setState({
			errorEmail: '',
			errorPassword: '',
			errorPasswordConfirm: '',
		})

		var error = false
		const email = this.state.email
		const password = this.state.password
		const passwordConfirm = this.state.passwordConfirm

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

		if (password !== passwordConfirm) {
			this.setState({
				errorPasswordConfirm: '上記と同じパスワードをもう一度入力してください',
			});
			error = true
		}

		const xhr = new XMLHttpRequest();
		xhr.open('POST', '/api/register', false);
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
						message: data.message,
					},
				});
				return;
			}
			this.context.router.push('/');
		}
		xhr.send(JSON.stringify({email:this.state.email, password:this.state.password}));
		return
	}

	onTapLogin(e) {
		this.context.router.push('/login');
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

	onInputPasswordConfirm(e) {
		this.setState({
			passwordConfirm: e.target.value.trim()
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
			register: {
				width: '100%',
				maxWidth: '30rem',
				marginTop: '0.5rem',
			},
			login: {
				width: '100%',
				maxWidth: '30rem',
				marginTop: '0.5rem',
			},
			backIcon: {
				position: 'fixed',
				top: '0.2rem',
				zIndex: '200',
			},
			backIcon2: {
				color: 'white',
				boxShadow: '1px 1px 1px rgba(0,0,0,1)',
				borderRadius: '50%',
				padding: '5px',
				backgroundColor: this.context.colors.bg2,
			},
		};

		return (
			<section style={styles.formBox}>
				<IconButton
					style={styles.backIcon}
					iconStyle={styles.backIcon2}
					onTouchTap={this.onBack}
				>
					<NavigationArrowBack />
				</IconButton>
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
						<Divider />
						<TextField
							style={styles.text}
							hintText='パスワード（確認）'
							errorText={this.state.errorPasswordConfirm}
							underlineShow={false}
							type="password"
							value={this.state.passwordConfirm}
							onChange={this.onInputPasswordConfirm}
							ref='passwordConfirmTextField'
						/>
					</Card>
					<RaisedButton
						label="アカウント作成"
						style={styles.register}
						backgroundColor={this.context.colors.bg2}
						labelColor={this.context.colors.lightGrey}type="submit" />
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

RegisterForm.contextTypes = {
	router: React.PropTypes.object.isRequired,
	colors: React.PropTypes.object.isRequired,
}

export class RegisterPage extends React.Component {
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
				<RegisterForm />
			</section>
		);
	}
};

