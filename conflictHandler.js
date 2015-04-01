/**
 * ConflictHandler.js
 * Handles conflict results for a turn
 * Only public function is genAllAttackResults()
 * returns instance of ConflictSetResult
 *
 */


// Takes an instance of move_data and returns a ConflictSetResult
// move data : [{start : {end}}]
module.exports = 

{
genAllAttackResults : function(move_data) {


	// 03-30-15
	// testing results integration
	debugger;
	
	
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
 }
}

/*
 * * * PRIVATE FUNCTIONS * * *
 */

// adds the victor arrays (battle results) to move data
// index of move_data is that teams moves
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
  // treat it like a FFA for now
  attackers.push(defender);
  return genFFAAttackResults(attackers);

}
// for a Free for All trying to claim a piece with no defender
genFFAAttackResults = function(attackers) {

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
  return new ConflictResult(winner, total_units, teams, pieces, results);



  // push to ret
  var ret = new ConflictSetResult();
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

      var defender = new Defender(state.state[defender_id].team, state.state[defender_id].units, defender_id);

      // multi attack
      if (attackers.length > 1) {

        // XXX TODO handle case where many different teams attack a building

        debugger;
        var results = genMultiAttackResults(attackers, defender);
        ret.multi.push(results);

        var secondary_results = genFFAAttackResults([]);
        ret.ffa.push(secondary_results);

        // solo attack - could be length 0 if all are already handled
      } else if (attackers.length > 0) {
        var results = genMultiAttackResults(attackers, defender);
        ret.single.push(results);
      }

    }

  }
  return ret;
}
Attack = function(team, units, origin, target) {
  return {
    team : team,
    units : units,
    piece : origin,
    target : target
  };
}
Defender = function(team, units, piece) {
  return {
    team : team,
    units : units,
    piece : piece,
  }
}
/**
 * <int> victor : team_index of the winner
 * <int> units : how many units survived
 * <int[]> teams : list of team_indexes involved
 * <string[]>  pieces : piece_ids involved. match indices to teams that own them
 * <int[]>  playout : index of pieces[] that loses in each kerfuffle.
 */
ConflictResult = function(victor, units, teams, pieces, results) {
  return {
    victor : victor,
    units : units,
    teams : teams,
    pieces : pieces,
    playout : results,
  }
};

// similiar to ConflictResult
// victors is a list
// units is a list corresponding to victors
MultiAttackConflictResult = function(victors, units, teams, pieces, results) {
  return {
    victors : victors,
    units : units,
    teams : teams,
    pieces : pieces,
    playout : results,
  }
};

/**
 * Results for a full set of conflicts in a turn
 * organized into fields for type of conflict
 * bidirectional - two pieces attacked each toher
 * multi - two or more pieces attacked a piece
 * ffa - many pieces attacked a piece with no owner (owner removed as result of mutli)
 * single - basic attack
 */
ConflictSetResult = function() {
  return {
    bidirectional : [],
    multi : [],
    ffa : [],
    single : [],
  }
};
