import React from 'react';

import {FileUpload} from './FileUpload.jsx';
import {Offer} from './Offer.jsx';

export class Menu extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			mentoring: this.props.mentoring,
			styles: {
				section: {
					position: 'relative',
					display: this.updateDisplay(this.props.isMenuDisplay),
					zIndex: 9999,
				},
				itemCarousel: {
					position: 'fixed',
					bottom: 0,
					borderTop: '1px solid #fafafa',
					width: '100%',
					height: '65px',
												/*
					overflowX: 'auto',
					overflowY: 'hidden',
					whiteSpace: 'nowrap',
					WebkitOverflowScrolling: 'touch',
					*/
				},
				itemImage: {
					width: '80px',
					padding: '6px',
				},
			}
		}
	}

	componentWillReceiveProps(e) {
		let styles = this.state.styles;
		styles.section.display = this.updateDisplay(e.isMenuDisplay);
		this.state = {
			styles: styles,
			mentoring: this.props.mentoring,
		}
	}

	updateDisplay(isMenuDisplay) {
		let display;
		if (isMenuDisplay) {
			display = 'block';
		} else {
			display = 'none';
		}
		return display;
	}

	onMenuClose() {
		console.log("onMenuClose");
		this.props.onTouchTap();
	}

	render() {
		return (
      <section style={this.state.styles.section}>
				<div style={this.state.styles.itemCarousel}>
					<FileUpload userId={this.props.userId} roomId={this.props.roomId} onTouchTap={this.onMenuClose.bind(this)} />
					{(() => {
						if (this.state.mentoring !== null && this.state.mentoring.user_id === sessionStorage.user.id) {
							return <Offer userId={this.props.userId} roomId={this.props.roomId} onTouchTap={this.onMenuClose.bind(this)} mentoring={this.state.mentoring} />
						}
					})()}
				</div>
			</section>
		);
	}
};
Menu.contextTypes = {
	router: React.PropTypes.object.isRequired,
}
Menu.propTypes = {
	isMenuDisplay: React.PropTypes.bool.isRequired,
	userId: React.PropTypes.string.isRequired,
	roomId: React.PropTypes.string.isRequired,
}
