var Enrollment = function(){
	this.belongsTo('User');
	this.belongsTo('Course');
}

Enrollment = geddy.model.register('Enrollment', Enrollment);