import React from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import MailOutlineIcon from 'material-ui/svg-icons/communication/mail-outline.js';
import Dialog from 'material-ui/Dialog';
import CircularProgress from 'material-ui/CircularProgress';

import FacebookLogin from 'react-facebook-login';

export class FirstPage extends React.Component {
    
    constructor(props, context) {
        super(props, context);
		this.state = {
			styles: {
				dialog: {
					position: 'fixed',
					height: '100%',
					width: '100%',
					top: 0,
					left: 0,
					opacity: 1,
					willChange: 'opacity',
					transform: 'translateZ(0px)',
					transition: 'left 0ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, opacity 400ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
					transitionProperty: 'left, opacity',
					transitionDuration: '0ms, 400ms',
					transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1), cubic-bezier(0.23, 1, 0.32, 1)',
					transitionDelay: '0ms, 0ms',
					backgroundColor: 'rgba(0, 0, 0, 0.541176)',
					zIndex: 1400,
					display: 'none',
				},
				progressWrap: {
					display: 'none',
					position: 'absolute',
					width: '100%',
					textAlign: 'center',
					top: '45%',
				},
			}
		};
		this.onCreateEmailAccount = this.onCreateEmailAccount.bind(this);
		this.onLogin = this.onLogin.bind(this);
    }

    componentDidMount() {
/*
		var video = this.refs.video;
		var canvas = this.refs.canvas;
		var ctx = canvas.getContext("2d");
		var ctime = 0;
		var lastTime;
        video.addEventListener('canplay',function(){
            lastTime = Date.now();
            setInterval(function(){
                var curTime = Date.now();
                var diff = Date.now() - lastTime;
                lastTime = curTime;
                ctime += diff/1000;
                video.currentTime = ctime;
                ctx.drawImage(video, 0, 0, window.innerWidth, window.innerHeight);
                if(video.duration <= video.currentTime){
                    ctime = 0;
                }
            }, 1000/30);
        },false);
		video.load();


				<video ref="video" autoPlay={true} muted={true} loop={true} poster="/assets/img/splash.png" style={styles.video}>
					<source src="/assets/video/halongbaypennproductionsmp4.mp4" type="video/mp4" />
				</video>
				<canvas ref="canvas" style={styles.canvas}></canvas>
*/
    }

	onCreateEmailAccount(e) {
		this.context.router.push({pathname: '/register/'});
	}

	onLogin(e) {
		this.context.router.push({pathname: '/login/'});
	}

    render() {
		const styles = {
			root: {
				background: 'url(/assets/img/splash.png) no-repeat',
				backgroundSize: 'cover',
			},
			video: {
				position: 'fixed',
				right: 0,
				bottom: 0,
				minWidth: '100%',
				minHeight: '100%',
/*
				width: window.innerWidth,
				height: window.innerHeight,
				display: 'none',
*/
				zIndex: '-100',
				background: 'url(/assets/img/halongbaypennproductionsmp4.jpg) no-repeat',
				backgroundSize: 'cover',
			},
			canvas: {
				width: window.innerWidth,
				height: window.innerHeight,
			},
			facebookLoginWrap: {
				position: 'fixed',
				bottom: '22%',
				width: '100%',
			},
			createEmailAccountWrap: {
				position: 'fixed',
				bottom: '12%',
				width: '100%',
			},
			createEmailAccount: {
				display: 'block',
				width: '90%',
				height: '3rem',
				margin: '0 auto',
				borderRadius: '5px',
  				//boxShadow: '1px 1px 1px #F44336',
			},
			createEmailAccountLabel: {
  				fontSize: '0.9rem',
				display: 'inline-block',
				lineHeight: '3rem',
  				letterSpacing: '2px',
			},
			createEmailAccountIcon: {
				marginTop: '-1px',
				width: '18px',
				height: '18px',
			},
			loginWrap: {
				position: 'fixed',
				bottom: '2%',
				width: '100%',
			},
			login: {
				display: 'block',
				width: '90%',
				height: '3rem',
				margin: '0 auto',
				borderRadius: '5px',
  				//boxShadow: '1px 1px 1px #E0E0E0',
			},
			loginLabel: {
  				fontSize: '0.9rem',
				display: 'inline-block',
				lineHeight: '3rem',
  				letterSpacing: '2px',
			},
		}

		const responseFacebook = (response) => {
			console.log(response);
			if (response.status != "unknown") {
				let dialogStyle = this.state.styles.dialog;
				let progressWrapStyle = this.state.styles.progressWrap;
				dialogStyle.display = "block";
				progressWrapStyle.display = "block";
				this.setState({
					styles: {
						dialog: dialogStyle,
						progressWrap: progressWrapStyle,
					}
				});
				
			}
		}

        return (
            <div ref="root" style={styles.root}>
				<div style={this.state.styles.dialog}>
					<div style={this.state.styles.progressWrap}>
						<CircularProgress color="#00B0FF" />
					</div>
				</div>
				<div style={styles.facebookLoginWrap}>
					<FacebookLogin
						appId="151715948604966"
						textButton="Facebookでログイン"
						fields="name,email,picture"
						callback={responseFacebook}
						cssClass="fb-button"
						icon="fa-facebook" 
						size="large"
						language="ja_JP"
					/>
				</div>
				<div style={styles.createEmailAccountWrap}>
					<RaisedButton
						label="メールでアカウント作成"
						icon={<MailOutlineIcon style={styles.createEmailAccountIcon} />}
						style={styles.createEmailAccount}
						labelStyle={styles.createEmailAccountLabel}
						labelColor="white"
						backgroundColor="#0097A7"
						onTouchTap={this.onCreateEmailAccount}
					/>
				</div>
				<div style={styles.loginWrap}>
					<RaisedButton
						label="ログイン"
						style={styles.login}
						labelStyle={styles.loginLabel}
						onTouchTap={this.onLogin}
						backgroundColor="#ECEFF1"
						labelColor="#212121"
					/>
				</div>
			</div>
        )
    }
}
FirstPage.contextTypes = {
	router: React.PropTypes.object.isRequired
}
