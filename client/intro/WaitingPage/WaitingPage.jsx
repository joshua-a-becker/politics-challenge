import React from "react";
import { withTracker } from "meteor/react-meteor-data";
import { GlobalConfigs } from "meteor/empirica:core";
import styles from "./style.css";

import CountdownTimer from "./components/CountdownTimer";
import ReadyButton from "./components/ReadyButton";

// Handles all the timing stuff
import { TimeSync } from "meteor/mizzao:timesync";
import calcTimeRemaining from "./components/timeHelpers.js";
import moment from "moment";

export default class WaitingPage extends React.Component {
	render() {
		const { onNext, player } = this.props;
		
		window.player=player;
		
		return( 
			<div className="waiting-page">
				<WaitingPageContentContainer onNext={onNext} player={player} />
			</div>
		)
	}
}

class WaitingPageContent extends React.Component {

	constructor(props){
    super(props)

		// calc some vars before setting state		
		var readyState = true;
		var timeoutState = undefined;
		
		// if localStorage already exists for ready state, load it.
		// otherwise, create it.
		const playerIsReadyLocalStorage = localStorage.getItem("ready"+this.props.player._id);
		if (playerIsReadyLocalStorage == undefined) {
			console.log("setting local storage constructor" + readyState);
			localStorage.setItem("ready"+props.player._id, readyState);
		} else { 			
			readyState = playerIsReadyLocalStorage=="true";
			console.log("Player ready state from browser " + readyState);
		}
					
		// set timeout state if its ready
		if(!this.props.loading) {
			timeoutState = calcTimeRemaining(this.props.timeToStart,this.props.now, this.props.bufferTime)<=0;
		}	
		
		this.state = {
			playerReady: readyState,
			timeout: timeoutState,
		}
		
		console.log("Constructed with ready state " + this.state.playerReady);
		
		// NOW HANDLE SOME RE-ROUTING IF NECESSARY
		
		// if game is timed out and player is ready, move on
		if(this.state.timeout & this.state.playerReady) {
			console.log("Timer is zero, page loading as ready, skipping waiting page");
			this.props.onNext();
		}
		
		// if the db is ready there is no timeToStart config, move on
		if(this.props.ready & this.props.timeToStart===undefined) {
			console.log("Start time undefined, skipping waiting page");
			this.props.onNext();
		}
	}
	
	setReady = (readyState) => {
	
		// avoid loops in child component
		// and unnecessary updating
		if(this.state.playerReady != readyState) {
			
			this.setState({ playerReady: readyState });		
			// store in browser in case they time out and refresh the page.
			// in that event, the game is closed.
			console.log("setting local storage in setReady" + readyState);
			localStorage.setItem("ready"+this.props.player._id, readyState);
			
			console.log("Player is ready: " + localStorage.getItem("ready"+this.props.player._id));
			console.log("Player is now ready: " + readyState)
		}		
	}
	
	static getDerivedStateFromProps(props, current_state) {
				
		const {now, timeToStart} = props;
		if(timeToStart) {
			const timeoutState =  calcTimeRemaining(timeToStart,now,props.bufferTime)<=0;
			
			
			const moveon = (timeoutState && current_state.playerReady);
			
							
			return({
				timeout: timeoutState,
			});
			
		}
    return null
  }

	
	componentDidUpdate() {
		const {timeToStart, ready} = this.props;
		

		
		// if the db is ready and there is no timeToStart config, move on
		if(ready & timeToStart===undefined) {
			console.log("Start time undefined, skipping waiting page");
			this.props.onNext();
		}
		
		// if game is counted down...
		if(this.state.timeout && this.state.playerReady) {
			this.props.onNext()
		}
		
		// save  player buffer time if available
		if(this.props.bufferTime) {
			if(!this.props.player.get("bufferTime")) {
				console.log("setting buffer time ", this.props.bufferTime);
				this.props.player.set("bufferTime",this.props.bufferTime)
			}			
		}
	}

	renderLoading() {
		return(<center>Loading...</center>);
	}
	

	renderWaitingPage = () => {
			
		const timeout_notready = ( this.state.timeout && !this.state.playerReady );
				
		if (timeout_notready) {
			console.log("Rendering timeout page")
			return(
				<div className="game-is-closed"><center>Login timed out, game is closed.</center></div>
			)
		} else {			
			return(				
				<><center>
					<div className="game-start-timer">
						Time to start: <CountdownTimer timeToStart={calcTimeRemaining(this.props.timeToStart,this.props.now, this.props.bufferTime)} handleTimeOut={this.handleTimeOut} />
					</div>
					<ReadyButton disabled={false} setReady={this.setReady} maxTime={this.props.loginRefresh} />
				</center></>
			)
		}
	}
	
  render() {		
    const { loading } = this.props;
		
		
		
    return (
				
		<div className="bp3-non-ideal-state">
			<div className="bp3-non-ideal-state-description">
				{ loading ? this.renderLoading() : this.renderWaitingPage() }
			</div>
		</div>
    );
  }
}


WaitingPageContentContainer = withTracker(rest => {

	const loading = !Meteor.subscribe("admin-global-configs").ready();
	
	
	// only refresh every second 
	const now = moment(TimeSync.serverTime(null, 1000));  

	const globalConfigs = GlobalConfigs.GlobalConfigs.find().fetch();	
	
	const timeToStartConfig = _.find(globalConfigs, function(config){return(config.name==="time_to_start")});	
	const bufferTimeConfig = _.find(globalConfigs, function(config){return(config.name==="starting_buffer")});	
	const loginRefreshConfig = _.find(globalConfigs, function(config){return(config.name==="login_refresh")});	
	
	const timeToStart = timeToStartConfig===undefined ? undefined : timeToStartConfig.value;
	var baseBufferTime = bufferTimeConfig===undefined ? 0 : bufferTimeConfig.value;
	
	var bufferTime = _.random(baseBufferTime)
	
	// override if already set
	if(rest.player.get("bufferTime")) {		
		bufferTime = rest.player.get("bufferTime");
	}
	
	const loginRefresh = loginRefreshConfig===undefined ? 30 : loginRefreshConfig.value;
		
		

	window.now = now;
	window.moment = moment;
	
  return {
		now,
    loading,
    timeToStart, bufferTime, loginRefresh,
		...rest
  };

})(WaitingPageContent);