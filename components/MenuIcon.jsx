import React from 'react';

import {Router, Route, IndexRoute, History, hashHistory} from 'react-router';

import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import FlashOnIcon from 'material-ui/svg-icons/image/flash-on.js';
import PeopleIcon from 'material-ui/svg-icons/social/people';
import AddCircleIcon from 'material-ui/svg-icons/content/add-circle.js';

export class MenuIcon extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.onCreateMentoring = this.onCreateMentoring.bind(this);
	}

	onCreateMentoring() {
		this.context.router.push('/mentoring/new');
	}

	render() {
		const styles = {
			actionBlock: {
				height: '5rem',
				width: '100%',
				zIndex: '1000',
				overflowX: 'auto',
				overflowY: 'hidden',
				textAlign: 'center',
				justifyContent: 'space-between',
				display: 'flex',
				alignItems: 'flex-start',
			},
			actionBlockItem: {
				width: '100%',
				height: '5rem',
				display: 'block',
				whiteSpace: 'normal',
				color: window.textColor1,
				margin: '0',
				border: '1px solid',
				borderColor: window.borderColor2,
			},
			actionBlockLabelStyle: {
				fontSize: '0.7rem',
				display: 'block',
				padding: 0,
				margin: 0,
			},
			largeIcon: {
				width: '2.2rem',
				height: '2.2rem',
				position: 'relative',
				top: '-0.4rem',
				left: '-0.7rem',
				margin: '0',
			},
		}

		return (
			<div style={styles.actionBlock}>
					{(() => {
						if (this.props.userId == sessionStorage.user.id) {
							return (
								<FlatButton
									icon={<IconButton style={{margin:'0'}} iconStyle={styles.largeIcon}><PeopleIcon style={{margin:'0'}} color={window.textColor1} /></IconButton>}
									style={styles.actionBlockItem}
									value={1}
									ref="tab1"
									label={'メンタリングをする'}
									labelStyle={styles.actionBlockLabelStyle}
									onTouchTap={this.onCreateMentoring}
								/>
							);
						}
					})()}
					{(() => {
						/*
						if (this.props.userId == sessionStorage.user.id) {
							return (
								<FlatButton
									icon={<IconButton iconStyle={styles.largeIcon}><FlashOnIcon color={window.textColor1} /></IconButton>}
									style={styles.actionBlockItem}
									value={1}
									ref="tab1"
									label={'メンターライブをする'}
									labelStyle={styles.actionBlockLabelStyle}
									onTouchTap={this.onCreateMentoring}
								/>
							);
						}
						*/
					})()}
					{(() => {
						if (this.props.userId != sessionStorage.user.id) {
							return (
								<FlatButton
									icon={<IconButton iconStyle={styles.largeIcon}><AddCircleIcon color={window.textColor1} /></IconButton>}
									style={styles.actionBlockItem}
									value={1}
									ref="tab1"
									label={'フォローする'}
									labelStyle={styles.actionBlockLabelStyle}
									onTouchTap={this.onCreateMentoring}
								/>
							);
						}
					})()}
			</div>
		);
	}
};
MenuIcon.contextTypes = {
	router: React.PropTypes.object.isRequired
}
