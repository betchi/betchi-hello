import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, History, hashHistory} from 'react-router';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import {Card} from 'material-ui/Card';
import {Tabs, Tab} from 'material-ui/Tabs';
import AppBar from 'material-ui/AppBar';
import ActionSearch from 'material-ui/svg-icons/action/search';
import Snackbar from 'material-ui/Snackbar';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Avatar from 'material-ui/Avatar';
import Subheader from 'material-ui/Subheader';
import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import HeadRoom from 'react-headroom';

import {DrawerMenu} from './menu.jsx';
import {MentoringList} from './content.jsx';

const iconButtonElement = (
  <IconButton
    touch={true}
    tooltip="more"
    tooltipPosition="bottom-left"
  >
    <MoreVertIcon color={grey400} />
  </IconButton>
);

const rightIconMenu = (
  <IconMenu iconButtonElement={iconButtonElement}>
    <MenuItem>Reply</MenuItem>
    <MenuItem>Forward</MenuItem>
    <MenuItem>Delete</MenuItem>
  </IconMenu>
);

/*
const baloon = {
  balloon: {
    position: 'relative',
    background: '#ffffff',
    border: '1px solid #cccccc',
  }
  balloon::after, balloon::before {
    right: '100%';
    top: '50%';
    border: 'solid transparent';
    content: '" "';
    height: '0';
    width: '0';
    position: 'absolute';
    pointer-events: 'none';
  }

  balloon::after {
    border-color: 'rgba(255, 255, 255, 0)';
    border-right-color: '#ffffff';
    border-width: '30px';
    margin-top: '-30px';
  }
  balloon::before {
    border-color: 'rgba(204, 204, 204, 0)';
    border-right-color: '#cccccc';
    border-width: '31px';
    margin-top: '-31px';
  }
};
*/

const ListExampleMessages = () => (
  <div>
      <List>
        <Subheader>Today</Subheader>
        <ListItem
          leftAvatar={<Avatar src="avatar.jpg" />}
          primaryText="Brunch this weekend?"
          secondaryText={
            <p>
              <span style={{color: darkBlack}}>Brendan Lim</span> --
              I&apos;ll be in your neighborhood doing errands this weekend. Do you want to grab brunch?
            </p>
          }
          secondaryTextLines={2}
        />
        <Divider inset={true} />
        <ListItem
          leftAvatar={<Avatar src="avatar.jpg" />}
          primaryText={
            <p>Summer BBQ&nbsp;&nbsp;<span style={{color: lightBlack}}>4</span></p>
          }
          secondaryText={
            <p>
              <span style={{color: darkBlack}}>to me, Scott, Jennifer</span> --
              Wish I could come, but I&apos;m out of town this weekend.
            </p>
          }
          secondaryTextLines={2}
        />
        <Divider inset={true} />
        <ListItem
          leftAvatar={<Avatar src="images/uxceo-128.jpg" />}
          primaryText="Oui oui"
          secondaryText={
            <p>
              <span style={{color: darkBlack}}>Grace Ng</span> --
              Do you have Paris recommendations? Have you ever been?
            </p>
          }
          secondaryTextLines={2}
        />
        <Divider inset={true} />
        <ListItem
          leftAvatar={<Avatar src="images/kerem-128.jpg" />}
          primaryText="Birdthday gift"
          secondaryText={
            <p>
              <span style={{color: darkBlack}}>Kerem Suer</span> --
              Do you have any ideas what we can get Heidi for her birthday? How about a pony?
            </p>
          }
          secondaryTextLines={2}
        />
        <Divider inset={true} />
        <ListItem
          leftAvatar={<Avatar src="images/raquelromanp-128.jpg" />}
          primaryText="Recipe to try"
          secondaryText={
            <p>
              <span style={{color: darkBlack}}>Raquel Parrado</span> --
              We should eat this: grated squash. Corn and tomatillo tacos.
            </p>
          }
          secondaryTextLines={2}
        />
      </List>
  </div>
);

export class ChatPage extends React.Component {
	constructor(props, context) {
		super(props, context);
	}

	componentDidMount() {
	}

	componentWillReceiveProps(nextProps) {
	}

	componentWillUnmount() {
	}

	onScroll(e) {
	}

	onDrawerToggle(e) {
	}

	onSearchOpen(e) {
	}

	onSnackClose(e) {
	}

	render() {
		const styles = {
      ul: {
        paddingLeft: 0,
      },
			headroom: {
				WebkitTransition: 'all .3s ease-in-out',
				MozTransition: 'all .3s ease-in-out',
				OTransition: 'all .3s ease-in-out',
				transition: 'all .3s ease-in-out',
			},
			title: {
				fontSize: '1.2rem',
				fontWeight: 'bold',
			},
      avatar: {
        //position: 'relative',
        //top: '50px',
        marginLeft: '10px',
      },
      leftLi: {
        //position: 'relative',
        //top: '-40px',
      },
      leftBalloon: {
        width: 'auto',
        background: '#f1f0f0',
        border: '0px solid #777',
        padding: '5px 10px',
        margin: '5px 50px 5px 60px',
        borderRadius: '15px',
        clear: 'both',
        float: 'left',
      },
      rightBalloon: {
        width: 'auto',
        color: '#fff',
        position: 'relative',
        background: '#0084ff',
        border: '0px solid #777',
        padding: '5px 10px',
        margin: '5px 10px 5px 10px',
        borderRadius: '15px',
        clear: 'both',
        float: 'right',
      },
      clearBalloon: {
        clear: 'both',
      },
      senderName: {
        marginTop: '-30px',
        marginLeft: '70px',
        marginBottom: '-5px',
        color: 'rgba(0, 0, 0, .40)',
      },
      textField: {
        position: 'fixed',
        bottom: '0',
        marginBottom: '0',
        borderTop: '1px solid #eeeeee',
        backgroundColor: '#eeeeee',
        width: '100%',
      },
      sendButton: {
        marginRight: '20',
        position: 'fixed',
        bottom: '10px',
        right: '0',
        marginRight: '10px',
      },
		}
		return (
			<section>
				<HeadRoom
					style={styles.headroom}
				>
					<AppBar
						title='チャット'
						titleStyle={styles.title}
						iconElementRight={
							<IconButton
								onTouchTap={this.onSearchOpen}
							>
								<ActionSearch />
							</IconButton>
						}
					/>
				</HeadRoom>
        <ul style={styles.ul}>
            <li><p style={styles.rightBalloon}>right message<br />message</p><p style={styles.clearBalloon}></p></li>
            <li style={styles.leftLi}><Avatar style={styles.avatar} src="avatar.jpg" /><p style={styles.senderName}>leftname</p><p style={styles.leftBalloon}>left message</p><p style={styles.clearBalloon}></p></li>
            <li><p style={styles.rightBalloon}>right message<br />message</p><p style={styles.clearBalloon}></p></li>
            <li style={styles.leftLi}><Avatar style={styles.avatar} src="avatar.jpg" /><p style={styles.senderName}>leftname</p><p style={styles.leftBalloon}>left message left message</p><p style={styles.clearBalloon}></p></li>
            <li style={styles.leftLi}><Avatar style={styles.avatar} src="avatar.jpg" /><p style={styles.senderName}>leftname</p><p style={styles.leftBalloon}>left message</p><p style={styles.clearBalloon}></p></li>
            <li><p style={styles.rightBalloon}>right message<br />message</p><p style={styles.clearBalloon}></p></li>
            <li><p style={styles.rightBalloon}>right message right message<br />message</p><p style={styles.clearBalloon}></p></li>
        </ul>
        <TextField
          style={styles.textField}
          multiLine={true}
          rows={1}
        />
        <FloatingActionButton style={styles.sendButton}>
          <ContentAdd />
        </FloatingActionButton>
			</section>
		);
	}
}
ChatPage.contextTypes = {
	router: React.PropTypes.object.isRequired
}

