var async = require("async");
var mail = require("nodemailer").mail;

var CourseService = function() {
	var courseServiceSelf = this;

	this.findCourseById = function(courseId, action) {
		geddy.model.Course.first({id: courseId}, function(err, course) {
			if (err || !course) {
				console.log("Could not find event by ID" + courseId);
				action(err, null);
			} else {
				action(null, course);
			}
		});
	};



	this.emailInvites = function(myCourseId, invitees, action )
	{
		var myCourse;

		courseServiceSelf.findCourseById(myCourseId, function(err, course){
										myCourse = course;
									}
		 );

		courseInvitees = invitees.split(",");
		console.log(courseInvitees);


		var getUsers = function(callback){
	        
	        var getInviteeEmailIterator = function(courseInvitee, iteratorCallback){
	            geddy.model.User.first( courseInvitee, function(err, user){
	            	console.log(user.email);
	              iteratorCallback(err, user.email);
	            });
	        }
			
	        async.map(courseInvitees,
	        	       getInviteeEmailIterator,
	        	       function(err, results){
	        	 		console.log(results);
	                      callback(err, results);
	                   }

	       );
	    }

	    //console.log(results);
		var sendMail = function(inviteeEmails, callback){

		      //convert to string
		      var emailString = inviteeEmails.join(",");
		      console.log(inviteeEmails);

		      //send invitation email
		      //http://www.nodemailer.com/docs/usage-example

		      mail({
		          from: "Buzz Invitation <tastybears.dev@gmail.com>", // sender address
		          to: emailString, // list of receivers
		          //to: "bradasteiner@gmail.com",
		          subject: "Buzz Course Invite", // Subject lin
		          //text: "Test",
		          text: "You have been invited to a Buzz Course. Please use the following link to view the course: http://buzz.tastybears.com/courses/" + myCourseId, // plaintext body
		          html: "<b>You have been invited to a Buzz Course. Please use the following link to view the course: http://buzz.tastybears.com/courses/</b>" + myCourseId + "<b>/</b>" // html body
		      });
	    }

	    async.waterfall([getUsers, sendMail], 
	    	            function(err, result) {
	                       action(err, null);
	                    });
	 }




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
