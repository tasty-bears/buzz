var CourseService = function() {
	this.getUserCoursesIds = function (userId, action) {
		var self = this;
		var user = null;
		var myCourses = null;
		var ids = new Array();
		geddy.model.User.first(userId,function (err, data){
			if (err) {
				action(err, null);
			}
			user = data;
		});
		user.getCourses(function (err, data) {
			if (err) {
				action(err, null);
			}
			myCourses = data;
		});
		if (userId) {
			for (var i = 0; i < myCourses.length; i++) {
				ids[i] = myCourses[i].id;
			}
			action(null, ids);
		} else {
			action(null, null);
		}
		
	};

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

 	this.removeThisCourse = function (myUser, myCourse, action) {
 		var self = this;
 		myUser.removeCourse(myCourse);
 		myUser.save(function (err, data){
 			if (err) {
 				action(err,null);
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