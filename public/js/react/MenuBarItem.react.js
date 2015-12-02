var MenuBarItem = React.createClass({
	propTypes : function() {
		return {
			text : React.PropTypes.string.isRequired,
	  };
	},
	getInitialState: function() {
  },
  render: function() {
    return 
      <div class="menu-item">
				{this.props.text}
			</div>;
  }
});
// 
// 
  // $("#menu-bar-world").click(function() {
    // console.log("world clicked");
//     
    // if (active_pane === "critter") {
      // $("#critter_menu").hide();
    // }
//     
    // $("#world_menu").show();
    // active_pane = "world";
//     
// 
  // });
// 
  // $("#menu-bar-editor").click(function() {
    // $("#critter_menu").show();
     // if (active_pane === "world") {
      // $("#world_menu").hide();
    // }
    // active_pane = "critter";
    // active_tab = "defaults";
  // });
// 
  // $("#critter_defaults_button").click(function() {
    // if (active_tab !== "defaults") {
      // $("#critter_defaults_button").addClass("selected");
      // $("#critter_uploader_button").removeClass("selected");
      // active_tab = "defaults";
      // $("#critter_defaults").show();
      // $("#critter_uploader").hide();
    // }
  // });
// 
  // $("#critter_uploader_button").click(function() {
    // if (active_tab !== "uploader") {
      // $("#critter_uploader_button").addClass("selected");
      // $("#critter_defaults_button").removeClass("selected");
      // active_tab = "uploader";
      // $("#critter_defaults").hide();
      // $("#critter_uploader").show();
    // }
  // });
// 
  // $("#critter_defaults li div").click(function(e) {
    // console.log(e);
// 
    // $(e.currentTarget).addClass("selected");
    // $(current_option).removeClass("selected");
    // current_option = e.currentTarget;
  // });
// });