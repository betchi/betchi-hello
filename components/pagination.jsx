import React from 'react';
import {Router, Route, hashHistory} from 'react-router';

export class PaginationDot extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.onTap = this.onTap.bind(this);
	}

	onTap(e) {
		this.props.onTap(event, this.props.index);
	}

	render() {
		const styles = {
			root: {
				height: 18,
				width: 18,
				cursor: 'pointer',
			},
			dot: {
				backgroundColor: '#e4e6e7',
				height: 12,
				width: 12,
				borderRadius: 6,
				margin: 3,
			},
			active: {
				backgroundColor: '#319fd6',
			},
		};

		const {
			active,
		} = this.props;

		let styleDot;

		if (active) {
			styleDot = Object.assign({}, styles.dot, styles.active);
		} else {
			styleDot = styles.dot;
		}

		return (
			<div
				style={styles.root}
				onTouchTap={this.onTap}
			>
				<div style={styleDot} />
			</div>
		);
	}
}
PaginationDot.contextTypes = {
	router: React.PropTypes.object.isRequired
}
PaginationDot.propTypes = {
	active: React.PropTypes.bool.isRequired,
	index: React.PropTypes.number.isRequired,
	onTap: React.PropTypes.func.isRequired,
}

export class Pagination extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.onTap = this.onTap.bind(this);
	}

	onTap(e, index) {
		this.props.onChangeIndex(index);
	};

	render() {
		const styles = {
			wrap: {
				position: 'absolute',
				bottom: 8,
			},
			root: {
				display: 'flex',
			},
		};

		const {
			index,
			dots,
		} = this.props;

		const children = [];

		for (let ii = 0; ii < dots; ii++) {
			children.push(
				<PaginationDot
					key={ii}
					index={ii}
					active={ii === index}
					onTap={this.onTap}
				/>
			);
		}

		return (
			<div style={styles.wrap}>
				<div style={styles.root}>
					{children}
				</div>
			</div>
		);
	}
}
Pagination.contextTypes = {
	router: React.PropTypes.object.isRequired
}
Pagination.propTypes = {
	dots: React.PropTypes.number.isRequired,
	index: React.PropTypes.number.isRequired,
	onChangeIndex: React.PropTypes.func.isRequired,
}
