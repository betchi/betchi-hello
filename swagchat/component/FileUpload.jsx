import React from 'react';
import ReactDOM from 'react-dom';

import FlatButton from 'material-ui/FlatButton';
import CameraAlt from 'material-ui/svg-icons/image/camera-alt';
import NavigationConfirmClose from 'material-ui/svg-icons/navigation/close';

export class FileUpload extends React.Component {
	constructor(props, context) {
		super(props, context);

		/*
		let selectImage = {
			"name": "",
			"size": 0,
			"data": null,
		}
		*/

		this.state = {
			styles: {
				root: {
					display: 'inline',
				},
				fileUploadButton: {
					height: '65px',
				},
				fileUploadButtonLabel: {
					textAlign: 'center',
					color: '#454545',
					fontSize: '10px',
					display: 'block',
					paddingLeft: '12px',
					paddingRight: '12px',
				},
				cameraAlt: {
					margin: 0,
				},
				inputFile: {
					display: 'none',
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
			},
		}

		this.onFileUpload = this.onFileUpload.bind(this);
		this.onFileUploadChange = this.onFileUploadChange.bind(this);
		this.onFileUploadRequest = this.onFileUploadRequest.bind(this);
		this.onConfirmClose = this.onConfirmClose.bind(this);
	}

  onFileUpload() {
    this.refs.profilePhotoFileEdit.click();
  }

  onFileUploadChange(e) {
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
		console.log("onFileUploadRequest");
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
			console.log(data.assetId);

			// POSTリクエスト
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
			console.log(postJson);
			let xhrMessage = new XMLHttpRequest();
			xhrMessage.open('POST', this.context.swagchat.config.apiBaseUrl + '/messages');
			xhrMessage.onload = () => {
				if (xhrMessage.status !== 201) {
					console.log("送信に失敗しました");
					this.setState({
						snack: {
							open: false,
							message: '送信に失敗しました。',
						},
					});
					return;
				}
				let data = JSON.parse(xhrMessage.responseText);
				localStorage.setItem("image-" + data.messageIds[0], localStorage.getItem("confirmImage"));
			};
			xhrMessage.onerror = function() {
				console.log(xhr);
			};
			xhrMessage.setRequestHeader("Content-type", "application/json");
			console.log("post message assetId=" + data.assetId);
			xhrMessage.send(JSON.stringify(postJson));
    };
		xhr.send(formData);

		//xhr.setRequestHeader("Content-Type", this.selectImage.type);
		//xhr.setRequestHeader("Content-Length", this.selectImage.size);

/*
		let json = {
			roomId: this.props.roomId,
			userId: this.props.userId,
			messages: [
				{
					type: "image",
					payload: {
						name: this.selectImage.name,
						type: this.selectImage.type,
						size: this.selectImage.size,
					}
				}
			]
		};
		let jsonData = JSON.stringify(json);
		formData.append("json", jsonData);
*/


/*
		let boundary = "aaaaaaaaaaaaaaaaaaaaaaaa";
		xhr.setRequestHeader("Content-Type","multipart/form-data; boundary=" + boundary);
    let reader = new FileReader();
		reader.onload = function (e) {

			//xhr.setRequestHeader("Content-Length", fileSize);

			//let fileData = new Uint8Array(reader.result);
			let fileData = reader.result;
			let body = "";
			// Image Data
			body += "--" + boundary + "\r\n";
			body += "Content-Disposition: form-data; name=\"file\"; filename=\"" + this.selectImage.name + "\"\r\n";
			body += "Content-Type: " + this.selectImage.type + "\r\n";
			body += "Content-Transfer-Encoding: binary\r\n\r\n";
			body += fileData + "\r\n";

			// JSON Data
			//body += "--" + boundary + "\r\n";
			//body += "Content-Type: application/json\r\n\r\n";
			//body += jsonData + "\r\n";

			// END
			body += "--" + boundary + "--";
			
			xhr.send(body);
		}.bind(this);
		reader.readAsBinaryString(this.selectImage);
*/
  }

	onConfirmClose() {
		let styles = this.state.styles;
		styles.confirm.display = 'none';
		this.setState({
			styles: styles,
		}); 
	}

	render() {
		return (
			<div style={this.state.styles.root}>
				<div style={this.state.styles.confirm}>
					<NavigationConfirmClose style={this.state.styles.close} onTouchTap={this.onConfirmClose} />
					<img id="confirmImage" ref="confirmImage" style={this.state.styles.confirmImage} onTouchTap={this.onFileUploadRequest} role="presentation" />
				</div>
				<FlatButton
					icon={<CameraAlt color="#454545" style={this.state.styles.cameraAlt} />}
					style={this.state.styles.fileUploadButton}
					primary={true}
					onTouchTap={this.onFileUpload}
					label="写真をアップロード"
					labelStyle={this.state.styles.fileUploadButtonLabel}
				/>
				<input
					type="file"
					style={this.state.styles.inputFile}
					ref="profilePhotoFileEdit"
					accept="image/*"
					onChange={this.onFileUploadChange}
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
