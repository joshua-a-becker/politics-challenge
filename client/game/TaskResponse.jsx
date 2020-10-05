import React from "react";
import Slider from "meteor/empirica:slider";
import number_format from "./FormatNumbers";

export default class TaskResponse extends React.Component {

	state={formValid: false, guess: undefined}

  handleChange = event => {
    const { player } = this.props;
    const guess = event.currentTarget.value.replace(/\s/g, '').replace(/,\s?/g, "");				
		this.setState({
			guess: guess,
		})
  };

  handleSubmit = event => {
    event.preventDefault();
		this.props.player.stage.set("guess", this.state.guess);
    this.props.player.stage.submit();
		this.setState({"guess":''});
  };

  renderSubmitted() {
    return (
      <div className="task-response">
        <div className="response-submitted">
				{ 
					player.get("neighbors").length===0 
					?
					<h5>Loading...</h5> 
					: 
					<><h5>Waiting on other players...</h5>
          Please wait until all players are ready</>
				}          
        </div>
      </div>
    );
  }

  renderInput() {
    const { player } = this.props;
    const value = player.round.get("guess");
    return (
      <input
        type="number"
        onChange={this.handleChange}
        value={this.state.guess || ''}
      />
    );
  }
	
	renderAverageAnswer = () => {
	
		const { game, player, stage } = this.props;
		
		const partyName = game.treatment.party;

		const otherPlayers = _.filter(game.players, otherPlayer =>
			player.get("neighbors").includes(otherPlayer.get("nodeId"))
		);

		if (otherPlayers.length === 0 || stage.name==="response_1") {
		console.log("return null");
			return null;
		}

		// calc average
		var totalValid = 0;
		
		var total=0;
		otherPlayers.forEach( (p, i) => {
			var thisGuess = p.round.get("prevAnswer");
			
			if(thisGuess!=null) {
			 	total += parseFloat(thisGuess);
				totalValid++;
			}
			
		})	
		
		
		const avgAnswer = totalValid==0 ? "NA" : number_format((total/totalValid)+"", 2, true);
				
		return(
			<div className="social-info">
						All other players are {partyName}.  
						<br/><b>Average answer: {avgAnswer}</b> 
			</div>
		)
	}

  render() {
    const { player } = this.props;

    // If the player already submitted, don't show the slider or submit button
    if (player.stage.submitted) {
      return this.renderSubmitted();
    }
		
		
    return (
			<>
				<div className="task-response">					
					{ this.renderAverageAnswer() }					
					<form onSubmit={this.handleSubmit}>
						{this.renderInput()}

						<button type="submit">Submit</button>
					</form>
				</div>
			</>
    );
  }
}
