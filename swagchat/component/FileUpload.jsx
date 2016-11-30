import React from 'react';
import ReactDOM from 'react-dom';

import FlatButton from 'material-ui/FlatButton';
import CameraAlt from 'material-ui/svg-icons/image/camera-alt';
import NavigationConfirmClose from 'material-ui/svg-icons/navigation/close';

export class FileUpload extends React.Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			styles: {
				buttonLabel: {
					textAlign: 'center',
					color: '#454545',
					fontSize: '10px',
					display: 'block',
					paddingLeft: '12px',
					paddingRight: '12px',
				},
				confirm: {
					display: 'none',
					position: 'fixed',
					bottom: '140px',
					width: '100%',
					height: '140px',
					background: 'rgba(0, 0, 0, 0.4)',
					textAlign: 'center',
					zIndex: 10000,
				}
			}
		}
	}

  onTouchTap() {
    this.refs.profilePhotoFileEdit.click();
  }

  onChange(e) {
		this.selectImage = e.target.files[0];
    if (!this.selectImage.type.match('image.*')) {
      return;
    }

    var reader = new FileReader();
    reader.onload = (function() {
      return function(e) {
				let confirmImageDOM = ReactDOM.findDOMNode(this.refs.confirmImage);
				confirmImageDOM.src = e.target.result;
				localStorage.setItem("confirmImage", e.target.result);
				let styles = this.state.styles;
				styles.confirm.display = 'block';
				this.setState({
					styles: styles,
				}); 
      }.bind(this);
    }.bind(this))(this.selectImage);
    reader.readAsDataURL(this.selectImage);
  }

  onFileUploadRequest() {
		let confirmImageDOM = ReactDOM.findDOMNode(this.refs.confirmImage);
		confirmImageDOM.src = "";
		this.onConfirmClose();
		this.props.onTouchTap();

    let xhr = new XMLHttpRequest();
    xhr.open('POST', this.context.swagchat.config.apiBaseUrl + '/assets');
		let formData = new FormData();
		formData.append("asset", this.selectImage);
    xhr.onload = () => {
      if (xhr.status !== 201) {
        this.setState({
          snack: {
            open: true,
            message: '読み込みに失敗しました。',
          },
        });
        return;
      }
      let data = JSON.parse(xhr.responseText);

			let postJson = {
				roomId: this.props.roomId,
				userId: this.props.userId,
				messages: [
					{
						type: "image",
						payload: {
							assetId: data.assetId,
						}
					}
				]
			};
			let xhrMessage = new XMLHttpRequest();
			xhrMessage.open('POST', this.context.swagchat.config.apiBaseUrl + '/messages');
			xhrMessage.onload = () => {
				if (xhrMessage.status !== 201) {
					this.setState({
						snack: {
							open: false,
							message: '送信に失敗しました。',
						},
					});
					return;
				}
				let data = JSON.parse(xhrMessage.responseText);
			};
			xhrMessage.setRequestHeader("Content-type", "application/json");
			xhrMessage.send(JSON.stringify(postJson));
    };
		xhr.send(formData);
  }

	onConfirmClose() {
		let styles = this.state.styles;
		styles.confirm.display = 'none';
		this.setState({
			styles: styles,
		}); 
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
				inputFile: {
					display: 'none',
				},
				confirmImage: {
					marginTop: '10px',
					height: '120px',
				},
				close: {
					color: 'white',
					position: 'fixed',
					marginTop: '10px',
					right: '10px',
				}
		}

		return (
			<div style={styles.root}>
				<div style={this.state.styles.confirm}>
					<NavigationConfirmClose style={styles.close} onTouchTap={this.onConfirmClose.bind(this)} />
					<img id="confirmImage" ref="confirmImage" style={styles.confirmImage} onTouchTap={this.onFileUploadRequest.bind(this)} role="presentation" />
				</div>
				<FlatButton
					icon={<CameraAlt color="#454545" style={styles.icon} />}
					style={styles.button}
					primary={true}
					onTouchTap={this.onTouchTap.bind(this)}
					label="写真をアップロード"
					labelStyle={this.state.styles.buttonLabel}
				/>
				<input
					type="file"
					style={styles.inputFile}
					ref="profilePhotoFileEdit"
					accept="image/*"
					onChange={this.onChange.bind(this)}
				/>
			</div>
		);
	}
};

FileUpload.contextTypes = {
	router: React.PropTypes.object.isRequired,
	swagchat: React.PropTypes.object.isRequired
}
FileUpload.propTypes = {
	userId: React.PropTypes.string.isRequired,
	roomId: React.PropTypes.string.isRequired,
}
