var async = require("async");

var CourseService = function() {
	this.getUserCoursesIds = function (userId, action) {
		var self = this;
		var myCourses = null;

		var _waterfallGetUser = function(callback){
			geddy.model.User.first(userId,function (err, data){
				callback(err,data);
			})
		};

		var _waterfallGetCourses = function(user,callback){
			user.getCourses(function (err, data) {
				callback(err,data);
			});
		}

		var _waterfallGetIds = function(courses,callback){
			var ids = [];
			if (userId) {
				for (var i = 0; i < courses.length; i++) {
					ids[i] = courses[i].id;
				}
				callback(null, ids);
			} else {
				callback(null, null);
			}

		}
		async.waterfall([_waterfallGetUser, _waterfallGetCourses, _waterfallGetIds], function(err, result) {
			action(err,result);
		});
	};

	this.addCourse = function (myUser, myCourse, action) {
		var self = this;
		myUser.addCourse(myCourse);
		myUser.save(function(err, data) {
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
 			action(null, data);
 		});
 	};

	this.getEventsFromSchedule = function (course, action) {
		var self = this;

		var _getSchedule = function(callback) {
			course.getSchedule(function (err, schedule) {
				callback(err, schedule);
			});
		}

		var _getEvents = function(schedule, callback){
			schedule.getEvents(function (err, events){
				callback(err,events);
			});
		}

		async.waterfall([_getSchedule,_getEvents],function(err,events){
			if (err) {
				action(err,null);
			}
			action(null,events);
		});
	};

	this.removeCourseFromDB = function(course, action) {
		geddy.model.Course.remove(course.id, function(err) {
			if (err) {
				action(err);
			}
			action(null);
		});
	}
}

module.exports = new CourseService();
