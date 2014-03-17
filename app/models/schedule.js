var Schedule = function() {
	this.defineProperties({
    	name: {type: 'string', required: true},
  	});
	this.belongsTo('Course');
	this.hasMany('Events');
}

Schedule = geddy.model.register('Schedule', Schedule);