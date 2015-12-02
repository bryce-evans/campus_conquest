var MenuBarDropDown = React.createClass({
	propTypes : function() {
		return {
			parentMenuBarItem : React.PropTypes.instanceOf(MenuBarItem).isRequired,
			items : React.PropTypes.array.isRequired,
	  };
	},
	getInitialState: function() {
  },
  render: function() {
    return 
      <div class="menu_tile lightbackground">
				<p>
					{this.props.text}
				</p>
			</div>;
  }
});
