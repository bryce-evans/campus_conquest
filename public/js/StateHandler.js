/**
 * StateHandler.js
 * Keeps track of local state and keeping insync with server
 *
 *
 * Always fully construct temp_move_data before sending move_data
 *
 * Always send 'xxxxx move' and recieve 'xxxxx update' (not the same emit and recieve id)
 *
 */

StateHandler = function() {
  this.socket = undefined;
  this.current = {};

  //this.current.watch('stage', function(){debugger;});

  this.team_order = [];
  this.moves_allowed = 0;
  this.moves_made = 0;
  this.move_data = {};

  // current moves made 
  // format differs by stage
  this.move_data = {};

  this.current_selected = undefined;
  this.waiting = false;
}

StateHandler.prototype = {
  connectToSocket : function(socket) {
    this.socket = socket;

    this.socket.on("disconnect", function() {
      alert("Server Connection Lost");
    });

    // note that client is out of sync with server 
    this.socket.on(CONSTANTS.IO.SERVER_SYNC, function(data) {
      this.syncToServer();
    }.bind(this));

    // currently only used to switch to REINFORCEMENT stage
    this.socket.on(CONSTANTS.IO.STAGE_UPDATE, function(data) {
      this.stage = data.stage;
      this.initReinforcementStage();
    }.bind(this));

    // receive moves
    this.socket.on(CONSTANTS.IO.GRAB_UPDATE, function(data) {
      var team = data.team_index;
      var building_id = data.piece;
      var building = world.map.game_pieces[building_id].mesh;
      var new_color = new THREE.Color(world.state_handler.getTeamColorFromIndex(team));
      building.material.color.copy(new_color);

      // don't change back to white when leaving hover if currently hovered over
      if (building === world.client_listeners.prev_obj) {
        world.client_listeners.prev_obj_color.copy(new_color);
      }

      building.game_piece.team = team;
      world.control_panel_handler.updateWheelToNext();
      this.updateState(data);
    }.bind(this));

    // when another player moves, update list of who's left
    this.socket.on(CONSTANTS.IO.WAITING_ON_UPDATE, function(data) {

      // still waiting on me
      if (data.indexOf(me.team_index) >= 0) {
        return;
      }

      this.showWaitingOnWindow(data);

    }.bind(this));

    this.socket.on(CONSTANTS.IO.REINFORCEMENT_UPDATE, function(data) {
      console.log('received reinforcement update', data);
      this.hideWaitingOnWindow();
      for (var i = 0; i < data.length; i++) {
        world.map.game_pieces[data[i].id].mesh.units_added = data[i].units;
        this.move_data[data[i].id] = data[i].units;
      }
      $('.instructions').addClass('hidden');

      // proceed to orders state
      $('#button-continue').text('Next Stage');
      $('#button-continue').show();
      this.waiting_on = true;
      $('#button-continue').unbind('click');
      $('#button-continue').click( function() {
        $('#button-continue').hide();
        this.waiting_on = false;
        this.combineUnits();
        this.move_data = {};
        this.initOrdersStage();
      }.bind(this));
    }.bind(this));

    this.socket.on(CONSTANTS.IO.ORDERS_UPDATE, function(data) {

      this.hideWaitingOnWindow();
      world.map.removeAllArrows();

      console.log('orders update data', data);

      for (var team in data.commands) {
        for (var start_id in data.commands[team]) {
          for (var end_id in data.commands[team][start_id]) {
            
            var half_size = false;
            for (var team2 in data.commands) {
              if (data.commands[team2][end_id] && data.commands[team2][end_id][start_id]) {
                half_size = true;
                break;
              }
            }

            var arrow = world.map.getArrow(start_id, end_id, half_size);
            arrow.setUnits(data.commands[team][start_id][end_id]);
          }
        }
      }
      $('#instructions').text("click continue"); 

      function displayNextConflict(data) {
        var attacks = data.attacks;
              
        var attack = data.attacks.shift();
        
        var defender = attack.pieces[0];
        var attackers = attack.pieces.slice(1);

        for(var i = 0; i<attackers.length; i++) {
          var arr = world.map.getArrow(attackers[i], defender);
          arr.highlight();
        }
        if (attack.type === "Bidirectional") {
          world.map.getArrow(defender, attackers[0]).highlight();
        }

        $('#button-continue').text("continue attack");
        $('#button-continue').unbind("click");
        $('#button-continue').click(function(event) {
          displayNextKurfuffle.bind(this)(attack, data);
        }.bind(this));
      }

      function displayNextKurfuffle(attack, data) {
        if(attack.playout.length == 0) {
          var defender = attack.pieces[0];
          var attackers = attack.pieces.slice(1);
          var updated_state = {}
          if (attack.resolved) {
            // remove arrows
            for (var i = 0; i< attackers.length; i++) {
              var arr = world.map.getArrow(attackers[i], defender);
              arr.setUnits(0);
            }
            
            // update state
            for (var i = 0; i < attack.pieces.length; i++){
              var piece = attack.pieces[i];
              updated_state[piece] = {};
              updated_state[piece] = data.new_state[piece];
            }
            this.updatePartialState(updated_state);

          } else {
            for (var i = 0; i< attackers.length; i++) {
              var arr = world.map.getArrow(attackers[i], defender);
              arr.unhighlight();
            }
            if(attack.type === "Bidirectional") {
              // unhighlight the backedge
              var arr = world.map.getArrow(defender, attackers[0]);
              arr.unhighlight();
              arr.setFullLength();

              var arr = world.map.getArrow(attackers[0], defender);
              arr.setFullLength();
            } else if(attack.type === "Multi") {
              var new_state = {};
              new_state[defender] = {};
              new_state[defender].team = -1;
              new_state[defender].units = 0;
              this.updatePartialState(new_state);
            }
          }
          // end of orders stage
          if (data.attacks.length == 0) {
            $('#button-continue').text("End Stage");
            $('#button-continue').unbind("click");
            $('#button-continue').click(function(event) {
              this.updatePartialState(data.new_state);
              world.map.removeAllArrows();
              this.initReinforcementStage(); 
            }.bind(this));
          } else {
            $('#button-continue').click(function(event) {
              displayNextConflict.bind(this)(data);
            }.bind(this));
          }
          return;
        }

        // standard case - a piece loses a unit
        var loser_idx = attack.playout.shift();
        var loser_piece = attack.pieces[loser_idx];
        
        // state stores sum of all arrow units
        var state = world.state_handler.current.state[loser_piece];
        state.units--;
        
        var center;
        
        // defender loses
        if(loser_idx === 0) {
          if(attack.type !== "Bidirectional") {
            center = world.map.game_pieces[loser_piece].mesh.center;
          } else {
            var arr = world.map.getArrow(attack.pieces[0], attack.pieces[1]);
            center = arr.center; 
            arr.setUnits(arr.units - 1);
          }
        // attacker loses 
        } else {
          var arr = world.map.getArrow(attack.pieces[loser_idx], attack.pieces[0]);
          center = arr.center; 
          arr.setUnits(arr.units - 1);
        }
        world.map.newExplosion(center);
        if (attack.playout.length === 0) {
          $('#button-continue').text("Next Attack");
        } else {
          $('#button-continue').text("Continue Attack");
        }
        // this function already bound to the button
        // will run if clicked again
      }
      $('#button-continue').text('next attack');
      $('#button-continue').unbind('click');
      $('#button-continue').show();
      $('#button-continue').click(function(event) {
        displayNextConflict.bind(this)(data);    
      }.bind(this));
    }.bind(this));

    this.socket.on("update partial state", function(data) {
      console.log(data);
      this.updatePartialState(data);
    }.bind(this));
  },

  // takes a list of pieces with units added, adds those units and resets added to 0
  combineUnits : function() {
    if(this.current.stage !== "reinforcement") return;
    $.each(this.move_data, function(id, units){
      this.current.state[id].units += units;
    }.bind(this));
    this.move_data = {};
  },

  // adds a team to the state
  addTeam : function(team) {
    this.teams.append(team);
  },

  // returns team_id<string> of current player
  getCurrent : function() {
    var ret = this.current;
    ret.team = this.team_order[ret.team_index];
    return ret;
  },

  // for setting the entire initial state
  setState : function(state) {
    this.current.team_index = state.current_team;
    // resets if change of stage
    if(this.current.stage != state.stage) {
      this.resetTempData();
      this.renderUIForCurrentStage();
      this.current.stage = state.stage;
    }
    this.current.state = state.state;
    this.current.turn_number = state.turn;
    this.team_order = state.team_order;
    me.team_index = this.team_order.indexOf(me.team);
    world.control_panel_handler.initWheel(state.team_order, state.current_team);

    // you have already moved
    if (state.waiting_on.indexOf(me.team_index) == -1) {
      this.showWaitingOnWindow(state.waiting_on);
      return;
    } else {
      this.hideWaitingOnWindow();
    }

    switch(state.stage) {
      case CONSTANTS.STAGES.START:
        this.initStartStage();
        break;
      case CONSTANTS.STAGES.GRAB:
        this.initGrabStage();
        break;
      case CONSTANTS.STAGES.REINFORCEMENT:
        this.initReinforcementStage();
        break;
      case CONSTANTS.STAGES.ORDERS:
        this.initOrdersStage();
        break;
    }
  },
  // for single move updates
  updateState : function(state) {
    this.current.team_index = state.current_team;
    this.current.stage = state.stage;
    this.current.turn_number = state.turn;
  },

  /**
   *  
   */
  resetTempData : function() {
    pieces = [];
    this.move_data = {};
    this.moves_made = 0;
    world.map.removeAllArrows();
  },
  renderUIForCurrentStage : function() {
    if (this.current.stage === CONSTANTS.STAGES.REINFORCEMENT){
      $('.show-on-reinforcement').show();
      $('#button-continue').hide();
      $('.instructions').removeClass('hidden');
      $('.instructions').text('Place reinforcements');         
    } else {
      $('.show-on-reinforcement').hide();
      $('.instructions').addClass('hidden');
    }

  },

  initStartStage : function() {
    this.move = this.moveStart;
  },

  initGrabStage : function() {
    this.move = this.moveGrab;
    this.current.stage = CONSTANTS.STAGES.GRAB;
    this.showStageIntro(this.current.stage);
    $('.instructions').removeClass('hidden');
    $('.instructions').text('Select a piece to claim it');
  },
  initReinforcementStage : function() {
    this.current.stage = CONSTANTS.STAGES.REINFORCEMENT;
    this.showStageIntro(this.current.stage);

    $('.instructions').text('Place new reinforcements');

    this.moves_made = 0;
    this.move = this.moveReinforcement;

    this.renderUIForCurrentStage();
    $.ajax({
      url : CONSTANTS.URL.REINFORCEMENTS,
      data : {
        id : world.id,
        team : me.team
      }
    }).done( function(res) {
      console.log('reinforcements', res);
      this.moves_allowed = res.reinforcements;
      $('#reinforcements-remaining').text(res.reinforcements);
    }.bind(this));
  },
  initOrdersStage : function() {
    this.current.stage = 'orders';
    this.showStageIntro('Attack Orders');

    this.renderUIForCurrentStage();

    this.move = this.moveOrders;

    // manages the attack panel slider
    $("#attack-slider").slider({
      range : "min",
      value : 0,
      min : 0,
      max : 1,
      slide : function(event, ui) {
        $("#attack-unit-count").text('units: ' + ui.value);
      }
    });

    // show submit button before any attacks given
    // allow to submit no attacks
    $('#button-continue').show();
    $('#button-continue').text("Submit Orders");
    $('#button-continue').unbind('click');
    // submit all orders
    $('#button-continue').click( function() {
      //var commands = [];

      // format for sending
      // for (var start in this.temp_move_data) {
      // for (var end in this.temp_move_data[start]) {
      // commands.push({
      // start : start,
      // end : end,
      // units : this.temp_move_data[start][end],
      // });
      // }
      // }
      var move_data_final = {
        game_id : world.id,
        team_index : me.team_index,
        team_id : me.team,
        commands : this.move_data,
      };
      this.socket.emit('orders move', move_data_final);
      this.move_data = {};
      
      // don't allow more orders to be made
      this.move = this.movePlayout;
      
      $('#button-continue').hide();
    }.bind(this));
  },
  // takes a clicked piece and handles the change in state on the client only until turn is over
  // does not always take a full turn if multiple pieces are needed to handle the turn
  moveStart : function(piece) {
    console.error('in start stage, should not be able to move');
  },
  moveGrab : function(piece) {
    // nat cho move yet son
    if (me.team != this.getCurrent().team) {
      console.log("Not your turn! Wait for " + world.state_handler.getCurrent().team);

      return;
    }
    var move_data = {
      game_id : world.id,
      team_index : world.state_handler.getCurrent().team_index,
      team_id : me.team,
      piece : piece.game_piece.id,
    };
    this.socket.emit('grab move', move_data);
  },
  moveReinforcement : function(piece) {
    if (world.state_handler.team_order[piece.game_piece.team] !== me.team) {
      return;
    }
    if (this.moves_made < this.moves_allowed) {
      if (this.move_data[piece.game_piece.id]) {
        this.move_data[piece.game_piece.id]++;
      } else {
        this.move_data[piece.game_piece.id] = 1;
      }
      this.moves_made++;
      $('#reinforcements-remaining').text(this.moves_allowed-this.moves_made);

      if (this.moves_made == this.moves_allowed) {
        var move_data_final = {};
        move_data_final.commands = [];
        for (var key in this.move_data) {
          if (this.move_data.hasOwnProperty(key)) {
            move_data_final.commands.push({
              id : key,
              units : this.move_data[key]
            });
          }

        }
        move_data_final.meta = {
          team : me.team,
          team_index : me.team_index,
          key : "my_super_secret_key"
        };
        console.log('sending reinforcement data', move_data_final);
        this.socket.emit('reinforcement move', move_data_final);
        $('#show-on-reinforcement').hide();
      }
    }
  },
  moveOrders : function(mesh) {
    var piece = mesh.game_piece;

    // make sure its your piece
    if (piece.team === me.team_index) {

      // undo highlight
      if (this.current_selected) {
        this.current_selected.unhighlight();

        //undo selection
        if (this.current_selected === piece) {
          this.current_selected = undefined;
          world.map.unsetAttackRadius(piece.id);
          return;
        }
      }

      this.current_selected = piece;
      this.current_selected.highlight();
      world.map.newAttackRadius(piece.id);

      // issue attack
    } else {
      var start_piece = this.current_selected;
      var start_id = start_piece.id;
      var end_id = piece.id;

      var arrow = world.map.getArrow(start_id, end_id);
      var prev_arrow_units = arrow.units;

      var init_start_pt_force = this.current.state[start_id].units;

      var total_force = init_start_pt_force + prev_arrow_units;
      var max_force = total_force - 1;

      // load previous arrow if exists;
      if (prev_arrow_units > 0) {
        var init_slider_force = prev_arrow_units;

        // new arrow
      } else {
        var init_slider_force = max_force;
        arrow.setUnits(max_force);
      }

      $('#attack-panel .from').text(start_id);
      $('#attack-panel .to').text(end_id);

      // init force changes
      // same changes occur on slider.slide
      $("#attack-unit-count").text(init_slider_force);
      $('#attack-range-multiplier').text(start_piece.connected[end_id]);

      $("#attack-slider").slider("destroy");
      $("#attack-slider").slider({
        range : "min",
        value : init_slider_force,
        min : 0,
        max : max_force,
        slide : function(event, ui) {
          $("#attack-unit-count").text(ui.value);
          arrow.setUnits(ui.value);
        }
      });

      $('#attack-panel').show();

      // remove old listener so canceling doesnt clear everything!
      $('#attack-panel .button.cancel').unbind('click');

      $('#attack-panel .button.cancel').click( function() {
        arrow.setUnits(prev_arrow_units);
        $('#attack-panel').hide();
      }.bind({
        prev_arrow_units : prev_arrow_units,
      }));

      $('#attack-panel .button.okay').unbind('click');
      $('#attack-panel .button.okay').click( function() {
        // initialize move data map [<from> : <to>]
        if (!this.move_data[this.start_id]) {
          this.move_data[this.start_id] = {};
        }
        this.move_data[this.start_id][this.end_id] = $("#attack-slider").slider('option', 'value');

        // undo selection
        this.start_piece.unhighlight();
        this.start_piece = undefined;
        this.state_handler.current_selected = undefined;
        $('#attack-panel').hide();
      }.bind({
        state_handler : this,
        move_data : this.move_data,
        start_piece : start_piece,
        start_id : start_id,
        end_id : end_id,
      }));

    }
  },

  movePlayout : function(piece) {
    // should anything happen?
  },

  /**
   * handles every move
   * is set to point to moveStart, moveGrab, moveReinforcement, or moveOrders
   * depending on stage
   */
  move : function(piece) {
    console.error('StateHandler.move not set');
  },

  // Renders the board to match the current state
  render : function() {
    // unsure if needed?

  },
 
  updatePartialState : function(updates) {
    var keys = Object.keys(updates);
    for(var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var update = updates[key];
      if('team' in update){
        this.current.state[key].team = update.team;
        world.map.game_pieces[key].setTeam(update.team);
      }
      if('units' in update){
        this.current.state[key].units = update.units;
      }
    }
  },
 
  /**
   * fetches the most recent state and runs callback
   */
  freshPull : function(callback) {
    $.ajax({
      url : CONSTANTS.URL.STATE,
      data : {
        id: world.id,
      },
    }).done(function(state) {
      callback.bind(this)(state);
    }.bind(this));
  },
  
  /**
   * Initiates a fresh pull and syncs to remote
   */
  syncToServer : function() {
    this.freshPull(this.setState);
    // must clear moves
    this.resetTempData();
    world.notifier.note("Synced with Server");
  },
  
  /**
   * shows animation for change of stage
   * @param {string} stage_name : text to be displayed
   */
  showStageIntro : function(stage_name) {
    $('#new-stage-text').text(stage_name);
    $('#new-stage-intro').show();
    window.setTimeout(function() {
      $('#new-stage-intro').hide();
    }, 2000);
  },
  /**
   * Shows list of players yet to move
   * @param {string[]} waiting_on
   */
  showWaitingOnWindow : function(waiting_on) {
    // show only after getting data from server
    // prevents window from flashing when no waiting-on left
    
    // hide button always
    $('#button-continue').hide();

    $('#waiting-on').show();
    this.waiting = true;
    $('#waiting-on-list').empty();
    for (var i = 0; i < waiting_on.length; i++) {
      var team_id = this.team_order[waiting_on[i]];
      $('#waiting-on-list').append('<tr class="team-li team colored ' + team_id + '">	<td class="team icon ' + team_id + ' small"></td><td class="team name ' + team_id + '" ></td><td class="endpiece"></td>						</tr>')
    }
  },

  /**
   * clears and hides waiting on window
   */
  hideWaitingOnWindow : function() {
    $('#waiting-on').hide();
    this.waiting = false;
    $('#waiting-on-list').empty();
  },

  /**
   * returns primary color of team by index
   * @param {int} index
   */
  getTeamColorFromIndex : function(index) {
    if (index < 0) {
      return 0xffffff;
    }
    return TEAM_DATA[this.team_order[index]].colors.primary;
  },
  getSecondaryTeamColorFromIndex : function(index) {
    if (index < 0) {
      return 0xffffff;
    }
    return TEAM_DATA[this.team_order[index]].colors.secondary;
  },

  getTeamColorFromId : function(id) {
    return TEAM_DATA[id].colors.primary;
  },
}

PlayerData = function(id, name, team) {
  // <string> netid
  this.id = id;
  this.name = name;

  // hex rgb
  this.color = color;

  this.team = undefined;

  // position in teamdata.players array
  this.index = -1;
}
TeamData = function(id, name, allow_multiple_players) {
  // <int>
  this.id = id;

  // <string>
  this.name = name;

  // PlayerData[]
  this.players = []

  // <bool>
  this.isTeam = allow_multiple_players;

  this.territories = new Array();
  this.troops = 0;
}
// returns true if successfully added player
TeamData.prototype.addPlayer = function(player) {
  if (this.isTeam || this.players.length == 0) {
    var index = this.players.length;
    this.players[index] = player;
    player.index = index;
    player.team = this;
    return true;
  } else {
    return false;
  }
}
