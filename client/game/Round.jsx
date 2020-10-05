import React from "react";

import SocialExposure from "./SocialExposure.jsx";
import Task from "./Task.jsx";
import Timer from "./Timer.jsx";

export default class Round extends React.Component {
  render() {
	
		
    const { round, stage, player, game } = this.props;

		window.stage=stage;
		window.round=round;
		window.game=game;
		window.player=player;
		
    return (
      <div className="round">
				<div className="logos">
					<div className="donkey"><img src="donkey.png"/></div>
					<Timer stage={stage} />
					<div className="elephant"><img src="elephant.png"/></div>
				</div>
        <div className="content">          				
          <Task game={game} round={round} stage={stage} player={player} />
        </div>
      </div>
    );
  }
}
