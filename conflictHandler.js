/**
 * ConflictHandler.js
 * Handles conflict results for a turn
 * with genAllAttackResults()
 * returns instance of ConflictSetResult
 *
 */

// Takes an instance of move_data and returns a ConflictSetResult
// move data : [{start : {end}}]
module.exports = {
  genAllAttackResults : function(move_data, state) {

    console.log('GEN ALL ATTACK RESULTS CALLED', move_data);
    var ret = new ConflictSetResult();
    ret.setCommands(move_data);

    // XXX
    // return ret;

    // inverted so it lists piece being attacked, and then list of pieces attacking (end : start)
    var inverse_orders = {};
    for (var i = 0; i < move_data.length; i++) {
      for (var start in move_data[i]) {
        for (var end in move_data[i][start]) {

          if (!inverse_orders[end]) {
            inverse_orders[end] = {};
          }
          inverse_orders[end][start] = {
            team : i,
            units : move_data[i][start][end]
          };

        }
      }
    }

    var defenders = Object.keys(inverse_orders);

    // first pass only handles bidirectional
    for (var i = 0; i < defenders.length; i++) {
      var defender = defenders[i];
      var attackers = Object.keys(inverse_orders[defender]);
      for (var j = 0; j < attackers.length; j++) {
        var attacker = attackers[j];
        var attacker_data = inverse_orders[defender][attacker];

        // test if bidirectional
        if (inverse_orders[attacker] && inverse_orders[attacker][defender] && !inverse_orders[attacker][defender].handled) {
          bidirectional = true;

          attacker2_data = inverse_orders[attacker][defender];

          var data1 = new Attack(attacker_data.team, attacker_data.units, attacker, defender);
          var data2 = new Attack(attacker2_data.team, attacker2_data.units, defender, attacker);

          if (attacker < defender) {
            var start_data = data1;
            var end_data = data2;
          } else {
            var start_data = data2;
            var end_data = data1;
          }

          var result_data = genBidirectionalAttackResults(start_data, end_data);

          // remove the direction that was handled already
          inverse_orders[defender][attacker].handled = true;
          inverse_orders[attacker][defender].handled = true;

          ret.bidirectional.push(result_data);

          // piece_ids of pieces that won and lost
          var victor = result_data.teams[0] == result_data.victor ? result_data.pieces[0] : result_data.pieces[1];
          var victim = result_data.teams[0] != result_data.victor ? result_data.pieces[0] : result_data.pieces[1];

          // add new command for the army to continue to attack the piece
          inverse_orders[victim][victor] = new Attack(result_data.victor, result_data.units, victor, victim);
          break;

        }
      }
    }

    // second pass handles multi attacks and singles
    for (var i = 0; i < defenders.length; i++) {
      // piece id
      var defender_id = defenders[i];

      // <string> piece_id[] : only temp - may contain already handled orders
      var attackers_temp = Object.keys(inverse_orders[defender_id]);

      // Attack[]
      var attackers = [];

      for (var j = 0; j < attackers_temp.length; j++) {
        var attacker = attackers[j];

        // push if not handled yet
        if (!inverse_orders[defender_id][attackers_temp[j]].handled) {
          var attack_data = inverse_orders[defender_id][attackers_temp[j]];
          attackers.push(new Attack(attack_data.team, attack_data.team, attackers_temp[j], defender_id));
        }

      }

      var defender = new Defender(state[defender_id].team, state[defender_id].units, defender_id);

      // multi attack
      if (attackers.length > 1) {

        // XXX TODO handle case where many different teams attack a building

        var results = genMultiAttackResults(attackers, defender);
        ret.multi.push(results);
        
        // case where single piece fends off all attackers
        if(results.victor){
        	xxx
        }

        var ffa_attackers = [];
        for (var i = 0; i < results.victors.length; i++) {
        	var v = results.victors[i];
        	
        	
        	var atk = new Attack(v, results.units[v], results.pieces[v], undefined);
          ffa_attackers.push(atk);
        }
        
        // XXX fix input arg
        var secondary_results = genFFAAttackResults(ffa_attackers, defender.piece);
        ret.ffa.push(secondary_results);

        // solo attack - could be length 0 if all are already handled
      } else if (attackers.length == 1) {
        var results = genMultiAttackResults(attackers, defender);
        ret.single.push(results);
      }

    }

    return ret;

  },
  writeResults : function(db, game_id, results) {

// only update if defender won
// otherwise results will be in ffa
		 for (var i in results.multi) {
		 	var r = results.multi[i];
		 	if(r.victors[0] == r.pieces[r.pieces.length-1]){
		 		 var winning_piece = pieces[r.victor];
      var winning_team = teams[r.victor];
      var winning_units = r.units;

      db.query('UPDATE state."' + game_id + '" SET units=' + winning_units + ' WHERE piece_name=\'' + winning_piece + '\'', function(err, result) {
        if (err) {
          console.error('ERROR cannot update state in initReinforcementStage()');
        }
      });
		 	}
		 }
		 
    for (var i in results.ffa) {
      var r = results.ffa[i];

      var winning_piece = r.pieces[r.victor];
      var winning_team = r.teams[r.victor];
      var winning_units = r.units;

      db.query('UPDATE state."' + game_id + '" SET units=' + winning_units + ' WHERE piece_name=\'' + winning_piece + '\'', function(err, result) {
        if (err) {
          console.error('ERROR cannot update state in initReinforcementStage()');
        }
      });

      //ConflictResult = function(victor, units, teams, pieces, results)
    }

    for (var i in results.single) {
      var r = results.bidirectional[i];

      var winning_piece = r.pieces[r.victor];
      var winning_team = r.teams[r.victor];
      var winning_count = r.pieces;

    }

  }
}

/*
* * * PRIVATE FUNCTIONS * * *
*/

/**
 * adds the victor arrays (battle results) to move data
 * index of move_data is that teams moves
 */
genBidirectionalAttackResults = function(attacker1, attacker2) {

  var ret = []
  var results = [];
  var pieces = [attacker1.piece, attacker2.piece];
  var teams = [attacker1.team, attacker2.team];
  // true if start wins
  var winner = true;
  while (attacker1.units > 0 && attacker2.units > 0) {
    // random unit lost
    attacker2_lost_unit = Math.random() < attacker2.units / (attacker1.units + attacker2.units);
    if (attacker2_lost_unit) {
      attacker2.units--;
    } else {
      attacker1.units--;
    }
    // push index of piece that lost unit
    results.push(+attacker2_lost_unit);
  }
  return new ConflictResult(attacker1.units > 0 ? attacker1.team : attacker2.team, Math.max(attacker1.units, attacker2.units), teams, pieces, results);

}
// {team, start_id, target_id, units}
// attack_list - list of pieces, with units and teams, attacking
// defender - team data of defender, with units and team info
genMultiAttackResults = function(attackers, defender) {
  // FIXME treat it like a FFA for now
  attackers.push(defender);
  var r = genFFAAttackResults(attackers, defender.piece);
  
  // last item in teams, pieces is the defender
  return new MultiAttackConflictResult(r.victors, r.units,r.teams,r.pieces, r.piece, r.results);

}
// for a Free for All trying to claim a piece with no defender
// piece <string> : piece up for dispute
genFFAAttackResults = function(attackers, piece) {

  // returns id of winning team, -1 if no winner
  function victor(attackers) {
    var winner = -1;
    for (var i = 0; i < attackers.length; i++) {
      var attacker = attackers[i];
      if (attacker.units > 0) {
        if (winner < 0) {
          winner = attacker.team;
        } else {
          return -1;
        }
      }
    }
    return winner;
  }

  var total_units = 0;
  var pieces = new Array(attackers.length);
  var teams = new Array(attackers.length);
  for (var i = 0; i < attackers.length; i++) {
    total_units += attackers[i].units;
    pieces[i] = attackers[i].piece;
    teams[i] = attackers[i].team;
    attackers[i].index = i;
  }

  var winner = -1;
  var results = [];
  while (winner == -1) {
    // someone loses a unit
    var destroyed = Math.ceil(Math.random() * total_units);
    for (var i = 0; i < attackers.length; i++) {
      destroyed -= attackers[i].units;
      if (destroyed <= 0) {
        attackers[i].units--;
        total_units--;
        results.push(attackers[i].index);
        break;
      }
    }
    winner = victor(attackers);
  }
  return new FFAConflictResult(winner, total_units, teams, pieces, piece, results);

}
Attack = function(team, units, origin, target) {
  this.team = team;
  this.units = units;
  this.piece = origin;
  this.target = target;
}
Defender = function(team, units, piece) {
  this.team = team;
  this.units = units;
  this.piece = piece;
}

/**
 * two attackers with each other
 * one victor
 * 
 *  
 */
BidirectionalConflictResult = function(victor, units, teams, pieces, results) {
  this.victor = victor;
  this.units = units;
  this.teams = teams;
  this.pieces = pieces;
  this.playout = results;
};

/**
 * one attacker and defender
 * one winner
 * 
 * <int> victor : team_index of the winner
 * <int> units : how many units survived
 * <int[]> teams : list of team_indexes involved
 * <string[]>  pieces : piece_ids involved. match indices to teams that own them
 * <int[]>  playout : index of pieces[] that loses in each kerfuffle.
 */
SingleConflictResult = function(victor, units, teams, pieces, results) {
  this.victor = victor;
  this.units = units;
  this.teams = teams;
  this.pieces = pieces;
  this.playout = results;
};

/**
 * many attackers, one defender
 * many victors, or defender wins
 * 
 * victors is a list
 * units is a list corresponding to victors
 */
MultiAttackConflictResult = function(victors, units, teams, pieces, piece, results) {
  this.victors = victors;
  this.units = units;
  this.teams = teams;
  this.pieces = pieces;
  this.piece = piece;
  this.playout = results;
};

/**
 * many attackers, no defender
 * one victor
 * 
 * <int> victor : team_index of the winner
 * <int> units : how many units survived
 * <int[]> teams : list of team_indexes involved
 * <string[]>  pieces : piece_ids involved. pieces[i] corresponds to being owned by team_index i
 * <string>  piece : piece_id up for dispute. match indices to teams that own them
 * <int[]>  playout : index of pieces[] that loses in each kerfuffle.
 */
FFAConflictResult = function(victor, units, teams, pieces, piece, results) {
  this.victor = victor;
  this.units = units;
  this.teams = teams;
  this.pieces = pieces;
  this.piece = piece;
  this.playout = results;
};

/**
 * Results for a full set of conflicts in a turn
 * organized into fields for type of conflict
 * bidirectional - two pieces attacked each toher
 * multi - two or more pieces attacked a piece with units
 * ffa - many pieces attacked a piece with no owner (owner destroyed as result of multi)
 * single - basic attack
 */
ConflictSetResult = function() {
  this.commands = [];
  this.bidirectional = [];
  this.multi = [];
  this.ffa = [];
  this.single = [];
};


ConflictSetResult.prototype = {
  setCommands : function(coms) {
    this.commands = coms;
  }
};