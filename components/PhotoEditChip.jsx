import React from 'react';

import FlatButton from 'material-ui/FlatButton';
import PhotoCameraIcon from 'material-ui/svg-icons/image/photo-camera.js';

export class PhotoEditChip extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.onTouchTap = this.onTouchTap.bind(this);
	}

	onTouchTap() {
		this.props.onTouchTap();
	}

	render() {
		const styles = {
			root: {
				border: '1px solid',
				borderColor: window.textColor1,
				display: 'inline-block',
				borderRadius: '1rem',
				color: this.props.color,
				margin: '5px',
				backgroundColor: this.props.backgroundColor,
				opacity: 0.6,
				height: '1.5rem',
				lineHeight: '1rem',
				minWidth: 'auto',
				zIndex: 10000,
				boxShadow: '1px 1px 1px rgba(0,0,0,1)',
			},
			iconStyle: {
				width: '1rem',
				height: '1rem',
				marginLeft: '0.2rem',
			},
			labelStyle: {
				fontSize:'0.7rem',
				padding:'0 0.2rem',
			},
		}

		return (
			<FlatButton
				style={styles.root}
      			label={this.props.name}
      			icon={<PhotoCameraIcon style={styles.iconStyle} />}
				onTouchTap={this.onTouchTap}
				rippleColor={this.props.rippleColor}
				labelStyle={styles.labelStyle}
			/>
		);
	}
};
PhotoEditChip.propTypes = {
	name: React.PropTypes.string.isRequired,
}
