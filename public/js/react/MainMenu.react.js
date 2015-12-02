var MainMenu = React.createClass({
	propTypes : function() {
		return {
	  };
	},
	getInitialState: function() {
		return {
			active_popover: undefined,
			active_tab: undefined,
			current_options: undefined,
		}
  },
  
  _handleEscKey: function(event){
    console.log(event);
    if(event.keyCode == 27){
      this.state.active_popover.hide();
    }
  },

  componentWillMount:function() {
  	 $("#world_menu").hide();
     $("#critter_menu").hide();
     document.addEventListener("keyPress", this._handleEscKey, false);
   },


   componentWillUnmount: function() {
      document.removeEventListener("keyPress", this._handleEscKey, false);
   },
   
   clickNewWorld: function() {
   	 $("#world_menu").show();
	   active_tab = "defaults";
	   this.state.active_popover = $("#world_menu");
   },
   
   clickJoinWorld: function() {
   	$.ajax({
	      url : SERVER_URL + "world",
	      type : "GET",
	      data : JSON.stringify({
	        "update_since" : 0
	      }),
	      processData : false,
	      dataType : 'json'
	    }).done(function(data) {
	      $("#start_page").hide();
	      $("#game_page").show();
	      $("#world_menu").hide();
	      init_game_server(data);
	    });
   },
   
   
  render: function() {
    return <div>
      <Button id='new_world' type="long" text="New" onClick={this.clickNewWorld}/>
      <Button id='join_world' type="long" text="Join" onClick={this.clickNewWorld}/>
		</div>;
		
		      // <PopUp>
	      // <PopUpTabSection>
		      // <PopUpTab>
		      // <PopUpTab>
	      // </PopUpTabSection>
      // </PopUp>
  }
});

/*

$(document).ready(function() {



  newEmptyWorld = function() {
    newWorldHelper("");
  }
  newRandomWorld = function() {
    newWorldHelper(undefined);
  }
  newWorldHelper = function(definition) {
    $.ajax({
      url : SERVER_URL + "world",
      type : "POST",
      data : definition ? {
        definition : ""
      } : undefined,
      processData : false,
      dataType : 'json',
      statusCode : {
        200 : function(response) {
          alert('success! 200 no fn running');
        },
        201 : function(response) {

          joinCurrentWorld();

        },
        400 : function(response) {
          alert('<span style="color:Red;">Error While Saving Outage Entry Please Check</span>', function() {
          });
        },
        404 : function(response) {
          alert('1');
          bootbox.alert('<span style="color:Red;">Server Not Responding</span>', function() {
          });
        },
        500 : function(response) {
          alert('server error');
        }
      }
    });
  }

  $(document).keydown(function(e) {
    console.log(e);
    var code = e.keyCode || e.which;
    console.log(code);
    // escape -> close current menu
    if (code == 27) {
      active_tab = "";
      if (active_pane === "world") {
        $("#world_menu").hide();
      } else if (active_pane === "critter") {
        $("#critter_menu").hide();
      } else {
        console.log("I don't know what I'm trying to close");
      }
      // p -> play simulation
    } else if (code == 80) {
      $.post(SERVER_URL + "run?rate=2.0", function() {
        console.log("running server at 2 turns/sec");
        getUpdates = setTimeout(function() {
          alert("Hello")
        }, 3000);
      });

      // s -> step simulation
    } else if (code == 83) {
      // $.post(SERVER_URL + "step?count=1", function() {
      // console.log("stepped 1");
      // alert("success in step!");
      // });

      $.ajax({
        url : SERVER_URL + "step?count=1",
        type : "POST",
        processData : false,
        dataType : 'json',
        statusCode : {
          200 : function(response) {
            $.ajax({
              url : SERVER_URL + "world?update_since=" + world.t,
              type : "GET",
              processData : false,
              dataType : 'json',
              statusCode : {
                200 : function(response) {
                  console.log(response);
                  world.data.timeStep = response.current_timestep;
                  world.data.population = response.population;
                  var updates = response.state;
                  var update;
                  for (var i = 0; i < updates.length; i++) {
                    update = updates[i];
                    if (update.type === "critter") {
                      world.critters[update.id].setPosToHex(world.map.hexes[update.col][update.row]);
                    }
                  }
                }
              }
            });
          }
        }
      });

      // h -> halt simulation
    } else if (code == 72) {
      clearTimeout(myVar);
      console.log("halted sim");
    }
  });

  $("#world_defaults_button").click(function() {
    if (active_tab !== "defaults") {
      $("#world_defaults_button").addClass("selected");
      $("#world_uploader_button").removeClass("selected");
      active_tab = "defaults";
      $("#world_defaults").show();
      $("#world_uploader").hide();
    }
  });

  $("#world_uploader_button").click(function() {
    if (active_tab !== "uploader") {
      $("#world_uploader_button").addClass("selected");
      $("#world_defaults_button").removeClass("selected");
      active_tab = "uploader";
      $("#world_defaults").hide();
      $("#world_uploader").show();
    }
  });

  $("#world_defaults li div").click(function(e) {
    console.log(e);

    $(e.currentTarget).addClass("selected");
    $(current_option).removeClass("selected");
    current_option = e.currentTarget;
  });

  $("#choose_world").click(function(e) {

    var new_world = current_option.innerText;
    if (new_world === "Empty World") {
      newEmptyWorld();
    } else if (new_world === "Random World") {
      newRandomWorld();
    }

  });

*/