import React from 'react';

export class Sticker extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			styles: {
				section: {
					position: 'relative',
					display: this.updateDisplay(this.props.isStickerDisplay),
					zIndex: 9998,
				},
				itemCarousel: {
					position: 'fixed',
					bottom: '33px',
					borderTop: '1px solid #fafafa',
					width: '100%',
					height: '145px',
					overflowX: 'hidden',
					overflowY: 'scroll',
					WebkitOverflowScrolling: 'touch',
				},
				itemImage: {
					width: '80px',
					padding: '6px',
				},
				tabCarousel: {
					position: 'fixed',
					bottom: 0,
					borderTop: '1px solid #fafafa',
					width: '100%',
					height: '33px',
					overflowX: 'auto',
					overflowY: 'hidden',
					backgroundColor: '#efefef',
					whiteSpace: 'nowrap',
					WebkitOverflowScrolling: 'touch',
				},
				tabImage: {
					width: '28px',
					padding: '2px',
				},
			},
		}
	}

	componentWillReceiveProps(e) {
		let styles = this.state.styles;
		styles.section.display = this.updateDisplay(e.isStickerDisplay);
		this.state = {
			styles: styles,
		}
	}

	updateDisplay(isStickerDisplay) {
		let display;
		if (isStickerDisplay) {
			display = 'block';
		} else {
			display = 'none';
		}
		return display;
	}

	render() {
		return null;
		return (
      <section style={this.state.styles.section}>
				<div style={this.state.styles.itemCarousel}>
					<img alt="sticker" src="https://storage.googleapis.com/direct-archery-148703.appspot.com/YOSHIHIKO-01/yoshihiko-1.png" style={this.state.styles.itemImage} />
					<img alt="sticker" src="https://storage.googleapis.com/direct-archery-148703.appspot.com/YOSHIHIKO-01/yoshihiko-2.png" style={this.state.styles.itemImage} />
					<img alt="sticker" src="https://storage.googleapis.com/direct-archery-148703.appspot.com/YOSHIHIKO-01/yoshihiko-3.png" style={this.state.styles.itemImage} />
					<img alt="sticker" src="https://storage.googleapis.com/direct-archery-148703.appspot.com/YOSHIHIKO-01/yoshihiko-4.png" style={this.state.styles.itemImage} />
					<img alt="sticker" src="https://storage.googleapis.com/direct-archery-148703.appspot.com/YOSHIHIKO-01/yoshihiko-5.png" style={this.state.styles.itemImage} />
					<img alt="sticker" src="https://storage.googleapis.com/direct-archery-148703.appspot.com/YOSHIHIKO-01/yoshihiko-6.png" style={this.state.styles.itemImage} />
					<img alt="sticker" src="https://storage.googleapis.com/direct-archery-148703.appspot.com/YOSHIHIKO-01/yoshihiko-7.png" style={this.state.styles.itemImage} />
					<img alt="sticker" src="https://storage.googleapis.com/direct-archery-148703.appspot.com/YOSHIHIKO-01/yoshihiko-8.png" style={this.state.styles.itemImage} />
					<img alt="sticker" src="https://storage.googleapis.com/direct-archery-148703.appspot.com/YOSHIHIKO-01/yoshihiko-9.png" style={this.state.styles.itemImage} />
					<img alt="sticker" src="https://storage.googleapis.com/direct-archery-148703.appspot.com/YOSHIHIKO-01/yoshihiko-10.png" style={this.state.styles.itemImage} />
					<img alt="sticker" src="https://storage.googleapis.com/direct-archery-148703.appspot.com/YOSHIHIKO-01/yoshihiko-11.png" style={this.state.styles.itemImage} />
					<img alt="sticker" src="https://storage.googleapis.com/direct-archery-148703.appspot.com/YOSHIHIKO-01/yoshihiko-12.png" style={this.state.styles.itemImage} />
					<img alt="sticker" src="https://storage.googleapis.com/direct-archery-148703.appspot.com/YOSHIHIKO-01/yoshihiko-13.png" style={this.state.styles.itemImage} />
					<img alt="sticker" src="https://storage.googleapis.com/direct-archery-148703.appspot.com/YOSHIHIKO-01/yoshihiko-14.png" style={this.state.styles.itemImage} />
					<img alt="sticker" src="https://storage.googleapis.com/direct-archery-148703.appspot.com/YOSHIHIKO-01/yoshihiko-15.png" style={this.state.styles.itemImage} />
					<img alt="sticker" src="https://storage.googleapis.com/direct-archery-148703.appspot.com/YOSHIHIKO-01/yoshihiko-16.png" style={this.state.styles.itemImage} />
					<img alt="sticker" src="https://storage.googleapis.com/direct-archery-148703.appspot.com/YOSHIHIKO-01/yoshihiko-17.png" style={this.state.styles.itemImage} />
					<img alt="sticker" src="https://storage.googleapis.com/direct-archery-148703.appspot.com/YOSHIHIKO-01/yoshihiko-18.png" style={this.state.styles.itemImage} />
					<img alt="sticker" src="https://storage.googleapis.com/direct-archery-148703.appspot.com/YOSHIHIKO-01/yoshihiko-19.png" style={this.state.styles.itemImage} />
					<img alt="sticker" src="https://storage.googleapis.com/direct-archery-148703.appspot.com/YOSHIHIKO-01/yoshihiko-20.png" style={this.state.styles.itemImage} />
				</div>
				<div style={this.state.styles.tabCarousel}>
					<img alt="sticker" src="https://storage.googleapis.com/direct-archery-148703.appspot.com/YOSHIHIKO-01/yoshihiko-tab.png" style={this.state.styles.tabImage} />
					<img alt="sticker" src="https://storage.googleapis.com/direct-archery-148703.appspot.com/USHIJIMA-01/ushijima-tab.png" style={this.state.styles.tabImage} />
					<img alt="sticker" src="https://storage.googleapis.com/direct-archery-148703.appspot.com/tab-sample/tab-1.png" style={this.state.styles.tabImage} />
					<img alt="sticker" src="https://storage.googleapis.com/direct-archery-148703.appspot.com/tab-sample/tab-2.png" style={this.state.styles.tabImage} />
					<img alt="sticker" src="https://storage.googleapis.com/direct-archery-148703.appspot.com/tab-sample/tab-3.png" style={this.state.styles.tabImage} />
					<img alt="sticker" src="https://storage.googleapis.com/direct-archery-148703.appspot.com/tab-sample/tab-4.png" style={this.state.styles.tabImage} />
					<img alt="sticker" src="https://storage.googleapis.com/direct-archery-148703.appspot.com/tab-sample/tab-5.png" style={this.state.styles.tabImage} />
					<img alt="sticker" src="https://storage.googleapis.com/direct-archery-148703.appspot.com/tab-sample/tab-6.png" style={this.state.styles.tabImage} />
					<img alt="sticker" src="https://storage.googleapis.com/direct-archery-148703.appspot.com/tab-sample/tab-7.png" style={this.state.styles.tabImage} />
					<img alt="sticker" src="https://storage.googleapis.com/direct-archery-148703.appspot.com/tab-sample/tab-8.png" style={this.state.styles.tabImage} />
					<img alt="sticker" src="https://storage.googleapis.com/direct-archery-148703.appspot.com/tab-sample/tab-9.png" style={this.state.styles.tabImage} />
					<img alt="sticker" src="https://storage.googleapis.com/direct-archery-148703.appspot.com/tab-sample/tab-10.png" style={this.state.styles.tabImage} />
					<img alt="sticker" src="https://storage.googleapis.com/direct-archery-148703.appspot.com/tab-sample/tab-11.png" style={this.state.styles.tabImage} />
					<img alt="sticker" src="https://storage.googleapis.com/direct-archery-148703.appspot.com/tab-sample/tab-12.png" style={this.state.styles.tabImage} />
					<img alt="sticker" src="https://storage.googleapis.com/direct-archery-148703.appspot.com/tab-sample/tab-13.png" style={this.state.styles.tabImage} />
					<img alt="sticker" src="https://storage.googleapis.com/direct-archery-148703.appspot.com/tab-sample/tab-14.png" style={this.state.styles.tabImage} />
					<img alt="sticker" src="https://storage.googleapis.com/direct-archery-148703.appspot.com/tab-sample/tab-15.png" style={this.state.styles.tabImage} />
					<img alt="sticker" src="https://storage.googleapis.com/direct-archery-148703.appspot.com/tab-sample/tab-16.png" style={this.state.styles.tabImage} />
				</div>
			</section>
		);
	}
};
Sticker.contextTypes = {
	router: React.PropTypes.object.isRequired,
}
Sticker.propTypes = {
	isStickerDisplay: React.PropTypes.bool.isRequired,
}
