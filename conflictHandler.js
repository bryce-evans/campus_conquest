/**
 * ConflictHandler.js
 * Handles conflict results for a turn
 * Only public function is resolveAttacks()
 * returns instance of ConflictSetResult
 *
 */

module.exports = {
  resolveAttacks : function(move_data, state) {
    var ch = new ConflictHandler(move_data, state);
    return ch.getAllAttackResults();
  },
}

ConflictHandler = function(move_data, state) {
  this.state = state;
  this.new_state = {};

  this.set_result = new ConflictSetResult();
  this.set_result.setCommands(move_data);

  // inverted so it lists piece being attacked, and then list of pieces attacking (end : start)
  this.inverse_orders = {};
  for (var i = 0; i < move_data.length; i++) {
    for (var start in move_data[i]) {
      for (var end in move_data[i][start]) {
        if (!this.inverse_orders[end]) {
          this.inverse_orders[end] = {};
        }
        var units = move_data[i][start][end];

        // over extending units - invalid move
        if (this.state[start] < units) {
          break;
        }

        this.state[start].units -= units;
        this.inverse_orders[end][start] = new Attacker(i, units, start, end);
      }
    }
  }

};

ConflictHandler.prototype = {
  getUpdatedState : function() {
    var ret = {};
    ret.commands = this.move_data;
    ret.new_state = {};
    ret.conflicts = [];

    var keys;
    for (var i = 0; i < this.move_data.length; i++) {
      var com = move_data[i];
      // error handling
      if (com == undefined) {
        com = {};
      }
      keys = Object.keys(com);
      if (keys.length === 0) {
        continue;
      }
      start = keys[0];
      var ends = com[start];
      var total_attacking = 0;
      keys = Object.keys(ends);
      for (var j = 0; j < keys.length; j++) {
        var end = keys[j];
        total_attacking += ends[end];
      }
      this.new_state[start] = {};
      this.new_state[start].units = state[start].units - total_attacking;
    }

    for (var atk_team = 0; atk_team < this.move_data.length; atk_team++) {
      var move_set = this.move_data[atk_team];

      for (var start in move_set) {
        if (!move_set.hasOwnProperty(start)) {
          continue;
        }

        //var ends = move_set[start];
        // var end_keys = Object.keys(ends);
        for (var end in move_set[start]) {
          if (!move_set[start].hasOwnProperty(end)) {
            continue;
          }

          // add endpoints to modified state
          if (!new_state[end]) {
            this.new_state[end] = {};
            this.new_state[end].units = state[end].units;
          }

          var victor = -1;
          var units = -1;
          var teams = [];
          var pieces = [end, start];
          var playout = [];

          var atk_units = move_set[start][end];

          var dfd_team = state[end].team;
          var dfd_units = new_state[end].units;

          // index 0 is always defender
          // allows for multiple attackers
          teams.push(dfd_team);
          teams.push(atk_team);

          //if(atk_team === dfd_team) {

          //}
          //var liklihood = cdf(defending, attacking+defending, attacking/(attacking+defending));
          while (atk_units > 0 && dfd_units > 0) {
            var r = Math.random();
            if (r > (atk_units / (atk_units + dfd_units))) {
              dfd_units--;
              // defender is always index 0
              playout.push(0);
            } else {
              atk_units--;
              playout.push(1);
            }
          }
          if (atk_units > 0) {
            this.new_state[end].units = atk_units;
            this.new_state[end].team = state[start].team;
          } else {
            this.new_state[end].units = dfd_units;
          }
          var state_change = {};
          state_change[start] = this.new_state[start];
          state_change[end] = this.new_state[end];
          ret.conflicts.push(new ConflictResult(pieces, playout, state_change));
        }
      }
    }

    ret.new_state = this.new_state;
    return ret;

  },

  getAllAttackResults : function() {

    /*
     *      ==== Attack Flow ====
     *
     *  Attacks result in one of their children
     *  Continue through the tree until resolved
     *
     *
     *          bidirectional
     *          /          \
     *       single      multi
     *         \         /   \
     *          \       /   FFA
     *           \     /    /
     *         ----RESOLVED----
     *
     */

    this.processBidirectionalAttacks();
    this.processMultiAttacks();
    this.processFFAAttacks();
    this.processSingleAttacks();

    this.set_result.setNewState(this.state);

    return this.set_result;

  },

  processBidirectionalAttacks : function() {

    var defender_ids = Object.keys(this.inverse_orders);

    for (var i = 0; i < defender_ids.length; i++) {
      var defender_id = defender_ids[i];

      // may have been handled and removed
      if (!defender_id)
        continue;

      var attacker_ids = Object.keys(this.inverse_orders[defender_id]);
      for (var j = 0; j < attacker_ids.length; j++) {
        var attacker_id = attacker_ids[j];

        // may have been handled and removed
        if (!attacker_id)
          continue;

        // test if bidirectional
        if (this.inverse_orders[attacker_id] && this.inverse_orders[attacker_id][defender_id]) {

          var attacker1 = this.inverse_orders[defender_id][attacker_id];
          var attacker2 = this.inverse_orders[attacker_id][defender_id];

          var bidir_atk = new BidirectionalAttack(attacker1, attacker2);

          var result_data = this.getBidirectionalAttackResult(bidir_atk);
          this.set_result.attacks.push(result_data);

          // remove the direction that was handled already
          delete this.inverse_orders[defender_id][attacker_id];
          delete this.inverse_orders[attacker_id][defender_id];

          // piece_ids of pieces that won and lost
          var victor = result_data.teams[0] == result_data.victor ? result_data.pieces[0] : result_data.pieces[1];
          var victim = result_data.teams[0] != result_data.victor ? result_data.pieces[0] : result_data.pieces[1];

          // add new command for the army to continue to attack the piece
          this.inverse_orders[victim][victor] = new Attacker(result_data.pieces.indexOf(victor), result_data.new_state[victor], victor, victim);
        }
      }
    }
  },

  processMultiAttacks : function() {
    // find multi attack

    // remove moves from move_data

    // get results

    // push results
    // if more than two teams, push ffa move

    var defender_ids = Object.keys(this.inverse_orders);

    for (var i = 0; i < defender_ids.length; i++) {
      // piece id
      var defender_id = defender_ids[i];

      // may have been handled and removed
      if (!defender_id)
        continue;

      // <string> piece_id[]
      var attacker_ids = Object.keys(this.inverse_orders[defender_id]);

      // Attack[]
      var attackers = [];

      for (var j = 0; j < attacker_ids.length; j++) {
        var attacker_id = attacker_ids[j];

        // push
        var attacker = this.inverse_orders[defender_id][attacker_id];
        attackers.push(new Attacker(this.state[attacker_id].team, this.state[attacker_id].units, attacker_id, defender_id));

      }

      var defender = new Defender(state[defender_id].team, state[defender_id].units, defender_id);

      // multi attack
      if (attackers.length > 1 && defender.units > 0) {

        // XXX case where many different teams attack a building

        var multi_attack = new MultiAttack(attackers, defender);
        var results = this.getMultiAttackResult(multi_attack);
        this.set_result.attacks.push(results);

        var attackers = Object.keys(this.inverse_orders[defender.piece]);
        for (var k = 0; k < attackers.length; k++) {
          delete this.inverse_orders[defender.piece][attackers[k]];
        }

        var new_attacker_ids = Object.keys(results.new_state);

        // defender lost, add ffa data into inverse orders
        if (!(results.pieces[0] in results.new_state)) {
          for (var k = 0; k < new_attacker_ids.length; k++) {
            var new_attacker = new_attacker_ids[k];
            var result = results.new_state[new_attacker];
            this.inverse_orders[defender.piece][new_attacker] = new Attacker(result.team, result.units, new_attacker, defender.piece);
          }
        }

      }

    }

  },
  processFFAAttacks : function() {

    var defender_ids = Object.keys(this.inverse_orders);

    for (var i = 0; i < defender_ids.length; i++) {
      // piece id
      var defender_id = defender_ids[i];

      // may have been handled and removed
      if (!defender_id)
        continue;

      // <string> piece_id[]
      var attacker_ids = Object.keys(this.inverse_orders[defender_id]);

      // Attack[]
      var attackers = [];

      for (var j = 0; j < attacker_ids.length; j++) {
        var attacker_id = attacker_ids[j];

        // push
        var attacker = this.inverse_orders[defender_id][attacker_id];
        attackers.push(new Attacker(this.state[attacker_id].team, this.state[attacker_id].units, attacker_id, defender_id));

      }

      var defender = new Defender(state[defender_id].team, state[defender_id].units, defender_id);

      // ffa attack
      if (attackers.length > 1 && defender.units == 0) {

        // XXX case where many different teams attack a building

        var ffa_attack = new FFAAttack(attackers, defender);
        var results = this.getFFAAttackResult(ffa_attack);

        this.set_result.attacks.push(results);

      }

    }

  },
  processSingleAttacks : function(move_data, state) {

    var defender_ids = Object.keys(this.inverse_orders);

    for (var i = 0; i < defender_ids.length; i++) {
      // piece id
      var defender_id = defender_ids[i];
      var attacker_ids = Object.keys(this.inverse_orders[defender_id]);
      if (attacker_ids.length == 1) {
        var attacker_id = attacker_ids[0];
        var attacker = this.inverse_orders[defender_id][attacker_id];
        var defender = new Defender(this.state[defender_id].team, this.state[attacker_id].units, defender_id, attacker_id);

        var single_attack = new SingleAttack(attacker, defender);
        var result = this.getSingleAttackResult(single_attack);
        this.set_result.attacks.push(result);
      }

    }

    // get results

    // push results
  },
  /**
   * adds the victor arrays (battle results) to move data
   * index of move_data is that teams moves
   */
  getBidirectionalAttackResult : function(bidirectional_attack) {

    var attacker1 = bidirectional_attack.attacker1;
    var attacker2 = bidirectional_attack.attacker2;

    var ret = []
    var playout = [];
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
      playout.push(+attacker2_lost_unit);
    }

    var new_state = {};
    if (attacker1.units > 0) {
      new_state[attacker1.piece] = {};
      new_state[attacker1.piece].units = attacker1.units;
    } else {
      new_state[attacker2.piece] = {};
      new_state[attacker2.piece].units = attacker2.units;
    }

    // no need to update state
    return new BidirectionalAttackResult(pieces, teams, playout, new_state);

  },
  // {team, start_id, target_id, units}
  // attack_list - list of pieces, with units and teams, attacking
  // defender - team data of defender, with units and team info
  getMultiAttackResult : function(multi_attack) {
    var attackers = multi_attack.attackers;
    var defender = multi_attack.defender;

    var total_units = defender.units;
    var pieces = new Array(attackers.length + 1);
    var teams = new Array(attackers.length + 1);
    pieces[0] = defender.piece;
    teams[0] = defender.team;

    for (var i = 0; i < attackers.length; i++) {
      total_units += attackers[i].units;
      pieces[i + 1] = attackers[i].piece;
      teams[i + 1] = attackers[i].team;
    }

    var playout = [];
    while (defender.units > 0 && total_units > defender.units) {
      // someone loses a unit
      var destroyed = Math.ceil(Math.random() * total_units);
      // defender loses
      if (destroyed <= defender.units) {
        defender.units--;
        total_units--;
        playout.push(0);

        // attacker loses
      } else {
        destroyed -= defender.units;

        for (var i = 0; i < attackers.length; i++) {
          destroyed -= attackers[i].units;
          if (destroyed <= 0) {
            attackers[i].units--;
            total_units--;
            playout.push(i + 1);
            break;
          }
        }
      }
    }
    var new_state = {};

    // defender wins
    if (defender.units > 0) {
      new_state[defender.piece] = {};
      new_state[defender.piece].units = defender.units;

      // delete inverse orders
      var attackers = Object.keys(this.state[defender.piece]);
      for (var i = 0; i < attackers.length; i++) {
        delete this.inverse_orders[defender.piece][attackers[i]];
      }

      this.updateState(new_state);
      return new MultiAttackResult(pieces, teams, playout, new_state, true);

      // defender loses
    } else {
      this.state[defender.piece].team = -1;
      this.state[defender.piece].units = 0;

      var team = attackers[0].team;
      var all_same_team = true;
      var unit_sum = 0;
      for (var i = 1; i < attackers.length; i++) {
        delete this.inverse_orders[defender.piece][attackers[i].piece];
        unit_sum += attackers[i].units;
        if (attackers[i].team != team) {
          all_same_team = false;
          break;
        }
      }

      if (all_same_team) {
        new_state[defender.piece] = {};
        new_state[defender.piece].team = team;
        new_state[defender.piece].units = unit_sum;
        this.updateState(new_state);
        return new MultiAttackResult(pieces, teams, playout, new_state, true);

      } else {
        for (var i = 0; i < attackers.length; i++) {
          new_state[attackers[i].piece] = {};
          new_state[attackers[i].piece].units = attackers[i].units;
        }

        var result = new MultiAttackResult(pieces, teams, playout, new_state, false);

        // add new attacks
        var attackers = Object.keys(result.new_state);
        for (var i = 0; i < attackers.length; i++) {
          var change = result.new_state[attackers[i]];
          this.inverse_orders[defender.piece][attackers[i]] = new Attacker(change.team, change.units, attackers[i], defender.piece);
        }

        // NOT RESOLVED - don't update state
        return result;
      }

    }
  },
  // for a Free for All trying to claim a piece with no defender
  getFFAAttackResult : function(ffa_attack) {

    var attackers = ffa_attack.attackers;
    var defender = ffa_attack.defender;

    // returns id of winning team, -1 if no winner
    function lastTeamLeft(attackers) {
      var winner = -1;
      for (var i = 0; i < attackers.length; i++) {
        var attacker = attackers[i];
        if (attacker.units > 0) {
          // init
          if (winner === -1) {
            winner = attacker.team;
            // two teams left
          } else if (winner !== attacker.team) {
            return -1;
          }
        }
      }
      return winner;
    }

    var total_units = 0;
    var pieces = [defender.piece];
    var teams = [defender.team];
    for (var i = 0; i < attackers.length; i++) {
      total_units += attackers[i].units;
      pieces.push(attackers[i].piece);
      teams.push(attackers[i].team);
    }

    var winner = lastTeamLeft(attackers);
    var playout = [];
    while (winner == -1) {

      // someone loses a unit
      var destroyed = Math.ceil(Math.random() * total_units);
      for (var i = 0; i < attackers.length; i++) {
        destroyed -= attackers[i].units;
        if (destroyed <= 0) {
          attackers[i].units--;
          total_units--;
          playout.push(i);
          break;
        }
      }
      winner = lastTeamLeft(attackers);
    }
    var new_state = {};
    new_state[defender.piece] = {
      units : total_units,
      team : winner
    };

    this.updateState(new_state);
    return new FFAAttackResult(pieces, teams, playout, new_state);

  },

  getSingleAttackResult : function(single_attack) {
    var attacker = single_attack.attacker;
    var defender = single_attack.defender;

    // index 0 is always defender
    var pieces = [defender.piece, attacker.piece];
    var teams = [defender.team, attacker.team];

    var atk_team = attacker.team;
    var atk_units = attacker.units;

    var dfd_team = defender.team;
    var dfd_units = defender.units;

    var state_change = {};
    var playout = [];

    //var liklihood = cdf(defending, attacking+defending, attacking/(attacking+defending));
    while (atk_units > 0 && dfd_units > 0) {
      var r = Math.random();
      if (r > (atk_units / (atk_units + dfd_units))) {
        dfd_units--;
        // defender is always index 0
        playout.push(0);
      } else {
        atk_units--;
        playout.push(1);
      }
    }
    // attacker won!
    if (atk_units > 0) {
      state_change[defender.piece] = {};
      state_change[defender.piece].units = atk_units;
      state_change[defender.piece].team = atk_team;
      // defender won
    } else {
      state_change[defender.piece] = {};
      state_change[defender.piece].units = dfd_units;
    }
    // else {
    // this.state[end].units = dfd_units;
    // }

    this.updateState(state_change);
    return new SingleAttackResult(pieces, teams, playout, state_change);
  },
  updateState : function(updates) {
    var keys = Object.keys(updates);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var update = updates[key];
      if ('team' in update) {
        this.state[key].team = update.team;
      }
      if ('units' in update) {
        this.state[key].units = update.units;
      }
    }
  },
}

Attacker = function(team, units, origin, target) {
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
SingleAttack = function(attacker, defender) {
  if (attacker.target != defender.piece) {
    throw "Invalid SingleAttack";
  }
  this.attacker = attacker;
  this.defender = defender;
}
BidirectionalAttack = function(attacker1, attacker2) {
  if (attacker1.target != attacker2.piece || attacker2.target != attacker1.piece) {
    throw "Invalid BidirectionalAttack";
  }
  this.attacker1 = attacker1;
  this.attacker2 = attacker2;
}
MultiAttack = function(attackers, defender) {
  for (var i = 0; i < attackers.length; i++) {
    if (attackers[i].target != defender.piece) {
      throw "Invalid MultiAttack";
    }
  }
  this.attackers = attackers;
  this.defender = defender;
}
FFAAttack = function(attackers, defender) {
  if (defender.team != -1) {
    throw "Invalid FFAAttack";
  }
  this.attackers = attackers;
  this.defender = defender;
}
/**
 * <int> victor : team_index of the winner
 * <int> units : how many units survived
 * <int[]> teams : list of team_indexes involved
 * <string[]>  pieces : piece_ids involved. match indices to teams that own them
 * <int[]>  playout : index of pieces[] that loses in each kerfuffle.
 */
SingleAttackResult = function(pieces, teams, playout, new_state) {
  this.pieces = pieces;
  this.teams = teams;
  this.playout = playout;
  this.new_state = new_state;
};
SingleAttackResult.prototype = {
  resolved : true,
}

BidirectionalAttackResult = function(pieces, teams, playout, new_state) {
  this.pieces = pieces;
  this.teams = teams;
  this.playout = playout;
  this.new_state = new_state;
}
BidirectionalAttackResult.prototype = {
  resolved : false,
}

// similiar to ConflictResult
// victors is a list
// units is a list corresponding to victors
MultiAttackResult = function(pieces, teams, playout, new_state, resolved) {
  this.pieces = pieces;
  this.teams = teams;
  this.playout = playout;
  this.new_state = new_state;
  this.resolved = resolved || false;
};

MultiAttackResult.prototype = {
  // must have either a resulting attack or state
  setResultFFAAttack : function(atk) {
    this.resolved = false;
    this.result_ffa_attack = atk;
  },

  setNewState : function(new_state) {
    this.new_state = new_state;
  },
};

FFAAttackResult = function(pieces, teams, playout, new_state) {
  if (teams[0] != -1) {
    throw "Invalid FFAAttackResult";
  }
  this.pieces = pieces;
  this.teams = teams;
  this.playout = playout;
  this.new_state = new_state;
}
FFAAttackResult.prototype = {
  resolved : true,
}
/**
 * Results for a full set of conflicts in a turn
 * commands: {<string> start : {<string> end : <int> units}}
 *   the moves sent by players
 * conflicts: list of conflictResults
 *   includes playouts to view
 * new_state: {<string> start : {<string> end : {<int> units, <int> team}}
 *   only includes changes made
 *   checks to make sure end state matches server
 */
ConflictSetResult = function() {
  this.commands = {};
  this.attacks = [];
  this.new_state = {};
};

ConflictSetResult.prototype = {
  setCommands : function(coms) {
    this.commands = coms;
  },
  setAttacks : function(atks) {
    this.attacks = atks;
  },
  setNewState : function(state) {
    this.new_state = state;
  },
};
