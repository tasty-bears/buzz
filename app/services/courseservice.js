var CourseService = function() {
	this.addCourse = function (myUser, myCourse, action) {
		var self = this;
		geddy.log.debug('hellloooooo');
		myUser.addCourse(myCourse);
		myUser.save(function(err, data) {
      		if (err) {
        		action(err, null);
      		}
      	});
      	geddy.model.Course.all(function(err, data){
      		if (err) {
      			action(err, null);
      		}
      		action(null, data);
      	});
 	};
}

module.exports = new CourseService();