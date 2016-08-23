import React from 'react';

import FlatButton from 'material-ui/FlatButton';
import FlashOnIcon from 'material-ui/svg-icons/image/flash-on.js';

export class LiveMark extends React.Component {
	constructor(props, context) {
		super(props, context);
	}

	render() {
		const styles = {
			root: {
				opacity: 0.4,
				position: 'absolute',
				top: 0,
				right: 0,
				width: '100%',
				height: '100%',
				color: window.textColor1,
			},
			liveIcon: {
				position: 'absolute',
				right: 0,
				top: '0.8rem',
				color: window.textColor1,
				width: '4.5rem',
				height: '4.5rem',
			},
			liveLabel: {
				position: 'absolute',
				fontSize: '2rem',
				right: '3rem',
				top: '1.6rem',
			},
		}

		return (
			<FlatButton
				style={styles.root}
				icon={<FlashOnIcon style={styles.liveIcon} />}
				label="LIVE"
				labelStyle={styles.liveLabel}
				disabled={true}
			/>
		);
	}
};
/*
LiveMark.propTypes = {
	name: React.PropTypes.string.isRequired,
	number: React.PropTypes.number.isRequired,
}
*/
