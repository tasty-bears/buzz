var Schedule = function() {
	this.belongsTo('Course');
	this.hasMany('Events');
}

Schedule = geddy.model.register('Schedule', Schedule);