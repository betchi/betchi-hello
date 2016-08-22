import React from 'react';

import FlatButton from 'material-ui/FlatButton';

export class NumberChip extends React.Component {
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
				padding: '0.2rem 0.5rem',
				borderRadius: '1rem',
				color: this.props.color,
				margin: '5px',
				boxShadow: '1px 1px 1px rgba(1,1,1,0.5)',
				textShadow: '1px 1px 1px rgba(0,0,0,1)',
				backgroundColor: this.props.backgroundColor,
				height: '1.7rem',
				lineHeight: '1rem',
			},
		}

		const label = this.props.name + ' ' + this.props.number

		return (
			<FlatButton
				style={styles.root}
      			label={label}
				onTouchTap={this.onTouchTap}
				rippleColor={this.props.rippleColor}
				labelStyle={{fontSize:'0.8rem'}}
			/>
		);
	}
};
NumberChip.propTypes = {
	name: React.PropTypes.string.isRequired,
	number: React.PropTypes.number.isRequired,
}
