import Empirica from "meteor/empirica:core";

import {networks} from './networks';
import { taskData } from "./constants"

import "./callbacks.js";
import "./bots.js";


/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
		for (let i = a.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[a[i], a[j]] = [a[j], a[i]];
		}   
}


// gameInit is where the structure of a game is defined.
// Just before every game starts, once all the players needed are ready, this
// function is called with the treatment and the list of players.
// You must then add rounds and stages to the game, depending on the treatment
// and the players. You can also get/set initial values on your game, players,
// rounds and stages (with get/set methods), that will be able to use later in
// the game.
Empirica.gameInit(game => {
	
	treatment = game.treatment;
	players = game.players;
	if(treatment.topology != "solo") {
		// Extract network data from collection	
		var my_network = [];
		if(treatment.topology=="full") {
				players.forEach((player, i) => {
				
					var neighbors="";
					for(var j = 1; j <= players.length; j++){
						if(j!=(i+1)) {
							if(neighbors.length>0) {
								neighbors += (","+j);
							} else {
								neighbors += (""+j);
							}
						}
					}
				
					my_network.push({
						"from":i+1,
						"nei":neighbors
					})
				})
		} else {
			my_network = networks.findOne({name:treatment.topology}).content;
		}
		
			
		//Reorganize into easily indexable edgelist
		edgelist = {}	
		
		my_network.forEach(function(x) {		
				edgelist[x.from] = x.nei
		})
		
		shuffle(players);	
		players.forEach((player, i) => {
			player.set("neighbors",edgelist[i+1]);
			player.set("nodeId",i+1);			
		});		
	} else {
			players.forEach((player, i) => {
			player.set("neighbors",[]);
			player.set("nodeId",i+1);			
		});		
	}
	game.set("numRounds", Object.keys(taskData).length);
	
	
	const questionOrder = game.treatment.questionOrder;

	
	const taskKeysInOrder = _.map(questionOrder.split(","), (item)=>{
		return Object.keys(taskData)[parseInt(item)-1];
	})
	
  _.each(taskKeysInOrder, (taskName) => {
	
	
		const task = taskData[taskName];
    const round = game.addRound({
      data: {
        taskName: taskName,
        questionText: task.questionText,
        imagePath: task.path,
        correctAnswer: task.correctAnswer
      }
    });

    round.addStage({
      name: "response_1",
      displayName: "Initial Response",
      durationInSeconds: game.treatment.stageLength
    });
    
		round.addStage({
      name: "response_2",
      displayName: "First Revision",
      durationInSeconds: game.treatment.stageLength
    });
		
		round.addStage({
      name: "response_3",
      displayName: "Final Answer",
      durationInSeconds: game.treatment.stageLength
    });
		
		
  });
});