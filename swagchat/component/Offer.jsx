import React from 'react';
import ReactDOM from 'react-dom';

import FlatButton from 'material-ui/FlatButton';
import ThumbUp from 'material-ui/svg-icons/action/thumb-up';
import HighlightOff from 'material-ui/svg-icons/action/highlight-off';
import NavigationConfirmClose from 'material-ui/svg-icons/navigation/close';
import Dialog from 'material-ui/Dialog';

export class Offer extends React.Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			open: false,
			mentoring: this.props.mentoring,
			action: "",
		}
	}

	componentWillReceiveProps() {
		this.setState({
			mentoring: this.props.mentoring,
		});
	}

	handleOpen(action) {
		this.setState({
			open: true,
			action: action,
		});
	}

	handleClose() {
		this.setState({
			open: false,
		});
	}

	sendOffer() {
		console.log("sendOffer");
		this.handleClose();

		const mentoring = {
			id: parseInt(this.props.mentoring.id),
			determinations: [sessionStorage.user.id]
		};
		const postMentoringDetermination = {
			action: this.state.action,
			mentoring:mentoring
		};
		console.log(postMentoringDetermination);
		const xhr = new XMLHttpRequest();
		xhr.open('POST', '/api/mentoring/determinations', false);
		xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
		xhr.onload = () => {
			if (xhr.status !== 200) {
				this.setState({
					snack: {
						open: true,
						message: '通信に失敗しました。',
					},
					refreshStyle: {
						display: 'none',
					},
				});
				return;
			}
			let data = JSON.parse(xhr.responseText);
			this.setState({
				mentoring: data.mentoring,
			});

			//if (data.mentoring.determinations !== null &&
			//	data.mentoring.determinations.indexOf(parseInt(this.props.location.query.targetUserId)) >= 0) {
			//	this.setState({
			//		rightIconMessage: rightIconTitleCancel,
			//		rightIconAction: "remove",
			//		dialogMessage: dialogMessageCancel,
			//	});
			//} else {
			//	this.setState({
			//		rightIconMessage: rightIconTitleOk,
			//		rightIconAction: "all",
			//		dialogMessage: dialogMessageOk,
			//	});
			//}
		}
		xhr.send(JSON.stringify(postMentoringDetermination));
	}

	render() {
		const styles = {
			root: {
				display: 'inline',
			},
			icon: {
				margin: 0,
			},
			button: {
				height: '65px',
			},
			buttonLabel: {
				textAlign: 'center',
				color: '#454545',
				fontSize: '10px',
				display: 'block',
				paddingLeft: '12px',
				paddingRight: '12px',
			},
		}

		const actions = [
      <FlatButton
        label="キャンセル"
        primary={true}
        onTouchTap={this.handleClose.bind(this)}
      />,
			<FlatButton
				label="Ok"
				primary={true}
				keyboardFocused={true}
				onTouchTap={this.sendOffer.bind(this)}
				onRequestClose={this.handleClose.bind(this)}
			/>
		]

		let button;
		let dialogTitle;
		if (this.state.mentoring.determinations !== null) {
			button = (
				<FlatButton
					icon={<HighlightOff color="#454545" style={styles.icon} />}
					style={styles.button}
					primary={true}
					onTouchTap={this.handleOpen.bind(this, "remove")}
					label="オファーをキャンセル"
					labelStyle={styles.buttonLabel}
				/>
			)
			dialogTitle = "キャンセル";
		} else {
			button = (
				<FlatButton
					icon={<ThumbUp color="#454545" style={styles.icon} />}
					style={styles.button}
					primary={true}
					onTouchTap={this.handleOpen.bind(this, "all")}
					label="オファーを承諾"
					labelStyle={styles.buttonLabel}
				/>
			)
			dialogTitle = "承諾";
		}

		return (
			<div style={styles.root}>
				{button}
				<Dialog
					title={"オファーを" + dialogTitle + "しますか？"}
					actions={actions}
					modal={false}
					open={this.state.open}
				>
				</Dialog>
			</div>
		);
	}
};

Offer.contextTypes = {
	router: React.PropTypes.object.isRequired,
	swagchat: React.PropTypes.object.isRequired
}
Offer.propTypes = {
	userId: React.PropTypes.string.isRequired,
	roomId: React.PropTypes.string.isRequired,
	mentoring: React.PropTypes.object.isRequired,
}
