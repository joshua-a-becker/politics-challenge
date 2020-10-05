import React from "react";

export default class ReadyButton extends React.Component {


	countDownOne = () => {
	
		
		const newTime=this.state.remainingTime-1;
		
		
		this.setState({ 
			remainingTime: newTime,
			buttonText: "Login active for "+newTime+" more seconds.  Click to refresh.",
		});
					
		this.countdownTimeout = setTimeout(()=>{ 
			this.countDownOne(); 
		}, 1000);		
	}
	
	componentDidUpdate() {
		if(this.state.remainingTime<=0) {			
			this.props.setReady(false);
		}
	}

	componentDidMount() {		
		
		this.props.setReady(true);
		
		this.countdownTimeout = setTimeout(() => { 
				this.countDownOne(); 
		}, 1000);
		
	}
	
	componentWillUnmount() {
		clearTimeout(this.countdownTimeout);
	}

	constructor(props){
    super(props)
		
    this.state = {
      buttonText: "Login active for "+this.props.maxTime+" more seconds.  Click to refresh.",
			remainingTime: this.props.maxTime,
    }		
	}
	
	refreshReady = () => {
		
		const newTime=this.props.maxTime;
		this.setState({ 
			remainingTime: newTime,
			buttonText: "Login active for "+newTime+" more seconds.  Click to refresh.",
		});
		
		this.props.setReady(true);
	}
		
	renderExpired = () => {
		const colorStyle = "bp3-intent-danger";
		return(
			<button onClick={this.refreshReady} disabled={false} className={"bp3-button enter-game bp3-large " + colorStyle}>
				Login expired.  Click to refresh.
			</button>
		)
	}
	
	renderReady = () => {		
		const colorStyle = this.state.remainingTime > 10 ? "bp3-intent-success" : "bp3-intent-warning";
		return(
			<button onClick={this.refreshReady} disabled={false} className={"bp3-button enter-game bp3-large " + colorStyle}>
				{this.state.buttonText}
			</button>
		)
	}
	
	render() {		
		
		const disabled = this.props.disabled==undefined ? false : this.props.disabled
		return( 
			<>
				{ this.state.remainingTime>0 ? this.renderReady() : this.renderExpired() }
				<div>
					<div style={{"paddingTop":"1rem", "fontSize":"2rem", "fontWeight":"bold"}}> In order to play, your login must be active (green) when the game starts</div>
					<div style={{"paddingTop":"1rem"}}><i>Its OK to leave this page.  If your login expires, you will be able to click to reactivate.  But don't miss the start time!</i></div>
				</div>
			</>
		)
	}
}
