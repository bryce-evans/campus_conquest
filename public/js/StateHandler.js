/**
 * StateHandler.js
 * Keeps track of local state and keeping insync with server
 *
 *
 * Always use temp_move_data before sending move_data
 * Always send 'xxxxx move' and recieve 'xxxxx update' (not the same emit and recieve id)
 *
 */

StateHandler = function() {
  this.socket = undefined;
  this.current = {};
  this.team_order = [];
  this.moves_left = 0;
  this.move_data = {};

  this.move_data.commands = [];

  this.pieces_with_added_units = [];

  // used to temporarily store data before finally packaging into move_data
  this.temp_move_data = {};

  this.current_selected = undefined;
  this.waiting = false;
}

StateHandler.prototype = {
  connectToSocket : function(socket) {
    this.socket = socket;

    this.socket.on('stage update', function(data) {
      this.stage = data.stage;
      switch(data.stage) {
        case 'reinforcement':
          this.moves_left = data.reinforcements;
          console.log('changed to REINFORCEMENT stage');
          break;
        case 'orders':
          break;

      }
    }.bind(this));

    // recieve moves
    this.socket.on('grab update', function(data) {
      var team = data.team_index;
      var building_id = data.piece;
      var building = world.map.buildings[building_id];
      building.material.color.copy(new THREE.Color(world.state_handler.getTeamColorFromIndex(team)));
      building.game_piece.team = team;
      world.control_panel_handler.updateWheelToNext();
      this.updateState(data);
    }.bind(this));

    // when another player moves, update list of who's left
    this.socket.on('waiting-on update', function(data) {
      console.log('TODO waiting-on update', data);

      // still waiting on me
      if (data.indexOf(me.team_index) >= 0) {
        return;
      }

      this.showWaitingOnWindow(data);

    }.bind(this));

    this.socket.on('reinforcement update', function(data) {
      console.log('received reinforcement update', data);
      this.hideWaitingOnWindow();
      for (var i = 0; i < data.length; i++) {
        world.map.getObj(data[i].id).game_piece.units_added = data[i].units;
        this.pieces_with_added_units.push(world.map.getObj(data[i].id).game_piece);
      }
      
      $('#button-continue').show();
      this.waiting_on = true;
      $('#button-continue').click( function() {
      	 $('#button-continue').hide();
      	 this.waiting_on = false;
        this.combineUnits();
        this.initOrdersStage();
      }.bind(this));
    }.bind(this));

    this.socket.on('orders update', function(data) {
    	
      console.log('received orders update', data);
      this.hideWaitingOnWindow();
      
      // TODO show all arrows and commands
      console.log("(show all arrows and commands)");
      $('#button-continue').show();
       this.waiting_on = true;
      $('#button-continue').click(function() {
      	this.waiting_on = false;
      	
      	// TODO remove arrows from map
      	// TODO show battles
      	// TODO show end results
      	console.log("(remove arrows from map)");
      	console.log("(show battles)");
      	console.log("(show end results)");
      	
      	 $('#button-continue').hide();
        this.initReinforcementStage();
      }.bind(this));
    }.bind(this));

  },

  // takes a list of pieces with units added, adds those units and resets added to 0
  combineUnits : function() {
    var pieces = this.pieces_with_added_units;
    for (var i = 0; i < pieces.length; i++) {
      pieces[i].units += pieces[i].units_added;
      pieces[i].units_added = 0;
    }
    pieces = [];
  },

  addTeam : function(team) {
    this.teams.append(team);
  },

  getCurrent : function() {
    var ret = this.current;
    ret.team = this.team_order[ret.team_index];
    return ret;
  },

  // for setting the entire initial state
  setState : function(state) {
    this.current.team_index = state.current_team;
    this.current.stage = state.stage;
    this.current.state = state.state;
    this.current.turn_number = state.turn;
    this.team_order = state.team_order;
    me.team_index = this.team_order.indexOf(me.team);
    world.control_panel_handler.initWheel(state.team_order, state.current_team);

    switch(state.stage) {
      case "start":
        break;
      case "grab":
        break;
      case "reinforcement":

        // you have already moved
        if (state.waiting_on.indexOf(me.team_index) == -1) {
          this.showWaitingOnWindow(state.waiting_on);
        } else {
          this.initReinforcementStage();
        }

        break;
      case "orders":
        // you have already moved
        if (state.waiting_on.indexOf(me.team_index) == -1) {
          this.showWaitingOnWindow(state.waiting_on);
        } else {
          this.initOrdersStage();
        }
        break;
    }
  },
  // for single move updates
  updateState : function(state) {
    this.current.team_index = state.current_team;
    this.current.stage = state.stage;
    this.current.turn_number = state.turn;
  },
  initReinforcementStage : function() {
  	this.current.stage = 'reinforcement';
  	
    $('#panel-reinforcement-info').show();
    $.ajax({
      url : '/reinforcements',
      data : {
        id : world.id,
        team : me.team
      }
    }).done( function(res) {
      console.log('reinforcements', res);
      this.moves_left = res.reinforcements;
      $('#reinforcements-remaining').text(res.reinforcements);
    }.bind(this));
  },
  initOrdersStage : function() {
    this.current.stage = 'orders';

    // manages the attack panel slider

    $("#attack-slider").slider({
      range : "min",
      value : 8,
      min : 0,
      max : 10,
      slide : function(event, ui) {
        $("#attack-unit-count").text('units: ' + ui.value);
      }
    });

    // allow to submit any time
    $('#button-done').show();

    // done button to submit all orders
    $('#button-done').click( function() {
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
      var move_data = {
        game_id : world.id,
        team_index : me.team_index,
        team_id : me.team,
        commands : this.temp_move_data,
      };
      this.socket.emit('orders move', move_data);
      this.temp_move_data = {};
      $('#button-done').hide();
    }.bind(this));
  },
  // takes a clicked piece and handles the change in state on the client only until turn is over
  // does not always take a full turn if multiple pieces are needed to handle the turn
  move : function(piece) {
    switch(this.current.stage) {
      case 'start':
        // nat cho move yet son
        if (me.team != this.getCurrent().team) {
          console.log("Not your turn! Wait for " + world.state_handler.getCurrent().team);
          return;
        }
        var move_data = {
          scope : world.id,
          team_index : world.state_handler.getCurrent().team_index,
          team_id : me.team,
          piece : piece.game_piece.id,
        };
        this.socket.emit('grab move', move_data);
        break;
      case 'grab':
        // nat cho move yet son
        if (me.team != this.getCurrent().team) {
          console.log("Not your turn! Wait for " + world.state_handler.getCurrent().team);
          return;
        }
        var move_data = {
          scope : world.id,
          team_index : world.state_handler.getCurrent().team_index,
          team_id : me.team,
          piece : piece.game_piece.id,
        };
        this.socket.emit('grab move', move_data);
        break;
      case 'reinforcement':
        if (world.state_handler.team_order[piece.game_piece.team] !== me.team) {
          return;
        }
        if (this.moves_left >= 1) {
          if (this.temp_move_data[piece.game_piece.id]) {
            this.temp_move_data[piece.game_piece.id]++;
          } else {
            this.temp_move_data[piece.game_piece.id] = 1;
          }
          piece.game_piece.units_added = this.temp_move_data[piece.game_piece.id];
          this.moves_left--;
          $('#reinforcements-remaining').text(this.moves_left);

          if (this.moves_left == 0) {
            for (var key in this.temp_move_data) {
              if (this.temp_move_data.hasOwnProperty(key)) {
                this.move_data.commands.push({
                  id : key,
                  units : this.temp_move_data[key]
                });
              }

            }
            this.move_data.meta = {
              team : me.team,
              team_index : me.team_index,
              key : "my_super_secret_key"
            };
            console.log('sending reinforcement data', this.move_data);
            this.socket.emit('reinforcement move', this.move_data);
            this.temp_move_data = {};
            this.move_data = {};
            $('#panel-reinforcement-info').hide();
          }
        }
        break;
      case 'orders':
        var mesh = piece;
        var piece = mesh.game_piece;

        // make sure its your piece
        if (piece.team === me.team_index) {

          // undo highlight
          if (this.current_selected) {
            this.current_selected.unhighlight();

            //undo selection
            if (this.current_selected === piece) {
              this.current_selected = undefined;
              return;
            }
          }

          this.current_selected = piece;
          this.current_selected.highlight();

          // issue attack
        } else {
          var start_piece = this.current_selected;
          var start_id = start_piece.id;
          var end_id = piece.id;

          var arrow = world.map.getArrow(start_id, end_id);
          var prev_arrow_units = arrow.units;

          var init_start_pt_force = start_piece.units;

          var total_force = init_start_pt_force + prev_arrow_units;
          var max_force = total_force - 1;

          // load previous arrow if exists;
          if (prev_arrow_units > 0) {
            var init_slider_force = prev_arrow_units;

            // new arrow
          } else {
            var init_slider_force = max_force;
            arrow.setUnits(max_force);
            start_piece.units = init_start_pt_force - init_slider_force;
          }

          $('#attack-panel .from').text(start_id);
          $('#attack-panel .to').text(end_id);

          // init force changes
          // same changes occur on slider.slide
          $("#attack-unit-count").text('units: ' + (init_slider_force));

          $("#attack-slider").slider("destroy");
          $("#attack-slider").slider({
            range : "min",
            value : init_slider_force,
            min : 0,
            max : max_force,
            slide : function(event, ui) {
              $("#attack-unit-count").text('units: ' + ui.value);
              arrow.setUnits(ui.value);
              start_piece.units = total_force - ui.value;
            }
          });

          $('#attack-panel').show();

          // remove old listener so canceling doesnt clear everything!
          $('#attack-panel .button.cancel').unbind('click');

          $('#attack-panel .button.cancel').click( function() {
            arrow.setUnits(prev_arrow_units);
            start_piece.units = init_start_pt_force;
            $('#attack-panel').hide();
          }.bind({
            prev_arrow_units : prev_arrow_units,
            init_start_pt_force : init_start_pt_force,
          }));

          $('#attack-panel .button.okay').unbind('click');
          $('#attack-panel .button.okay').click( function() {
            // initialize move data map [<from> : <to>]
            if (!this.temp_move_data[this.start_id]) {
              this.temp_move_data[this.start_id] = {};
            }
            this.temp_move_data[this.start_id][this.end_id] = $("#attack-slider").slider('option', 'value');

            // undo selection
            this.start_piece.unhighlight();
            this.start_piece = undefined;
            $('#attack-panel').hide();
          }.bind({
            temp_move_data : this.temp_move_data,
            start_piece : start_piece,
            start_id : start_id,
            end_id : end_id,
          }));

        }
        break;
    }
  },
  showWaitingOnWindow : function(waiting_on) {
    // show only after getting data from server
    // prevents window from flashing when no waiting-on left
    $('#waiting-on').show();
    this.waiting = true;
    $('#waiting-on-list').empty();
    for (var i = 0; i < waiting_on.length; i++) {
      var team_id = this.team_order[waiting_on[i]];
      $('#waiting-on-list').append('<tr class="team-li team colored ' + team_id + '">	<td class="team icon ' + team_id + ' small"></td><td class="team name ' + team_id + '" ></td><td class="endpiece"></td>						</tr>')
    }
  },

  hideWaitingOnWindow : function() {
    $('#waiting-on').hide();
    this.waiting = false;
    $('#waiting-on-list').empty();
  },

  getTeamColorFromIndex : function(index) {
    if (index < 0) {
      return 0xffffff;
    }
    return TEAM_DATA[this.team_order[index]].colors.primary;
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
