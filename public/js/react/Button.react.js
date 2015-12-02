var Button = React.createClass({
	getDefaultProps: function() {
    return {
      onClick : function(){}, 
      className : ''
    };
 },
	propTypes : function() {
		return {
			text : React.PropTypes.string.isRequired,
			onClick : React.PropTypes.function,
	  };
	},
	getInitialState: function() {
		return {
			selected : false,
		};
  },
  handleClick : function() {
  	this.props.onClick();  	
  },
  render : function() {
  	var cx = React.addons.classSet;
	  var classes = cx({
	    'selected': this.state.isSelected,
	    'menu_tile': this.props.type == 'square',
	    'start_button': this.props.type == 'long',
	  });
	  
    return <div className={classes} onClick={this.handleClick}>
					   {this.props.text}
			     </div>;
  },
});
