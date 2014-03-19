var CourseService = function() {
	this.addCourse = function (myUser, myCourse, action) {
		var self = this;
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
 	this.removeCourse = function (myUser, myCourse, action) {

 	};
}

module.exports = new CourseService();