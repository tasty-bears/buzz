var async = require('async');

var EventService = function() {
	var userservice = require('../services/userservice');
	var eventserviceSelf = this;

	this.getCourseNames = function (events, action){
		var self = this;
		var coursenames = [];

		async.eachSeries(events, function(event, callback) {
			eventserviceSelf.getCourseName(event, function(err,courseName){
				coursenames.push(courseName);
				callback(err);
			});
		}, function(err){
			action(null, coursenames);
		});
	};

	this.getCourseNumbers = function (events, action){
		var self = this;
		var coursenumbers = [];

		async.eachSeries(events, function(event, callback) {
			eventserviceSelf.getCourseNumber(event, function(err,courseNumber){
				coursenumbers.push(courseNumber);
				callback(err);
			});
		}, function(err){
			action(null, coursenumbers);
		});
	};

	this.getCourseName = function (myEvent,action){
		var self = this;

		var _getSchedule = function (callback) {
			myEvent.getSchedule(function (err, data){
				callback(err,data);
			});
		}

		var _getCourse = function (sched, callback) {
			sched.getCourse(function (err,data){
				callback(err, data);
			});
		}

		async.waterfall([_getSchedule,_getCourse],function(err,course){
			if(err) {
				action(err,null);
			}
			action(null,course.name);
		});
	}

	this.getCourseNumber = function (myEvent,action){
		var self = this;
		var _getSchedule = function (callback) {
			myEvent.getSchedule(function (err, data){
				callback(err,data);
			});
		}

		var _getCourse = function (sched, callback) {
			sched.getCourse(function (err,data){
				callback(err, data);
			});
		}

		async.waterfall([_getSchedule,_getCourse],function(err,course){
			if(err) {
				action(err,null);
			}
			action(null,course.courseNumber);
		});
	}

	//TODO: move to UserService
	this.addEvent = function(userModel, eventModel, action) {
		var self = this;
		userModel.addEvent(eventModel);
		userModel.save(function(err, data) {
			if (err) {
				action(err, null);
			} else {
				data.getEvents(function(err, data) {
					action(null, data);
				});
			}
		});
	};

	// add a post to an event
	this.addPost = function(eventModel, postModel, action) {
		var self = this;
		// event hasMany post
		eventModel.addPost(postModel);
		eventModel.save(function(err, data) {
			if (err) {
				action(err, null);
			} else {
				action(null, postModel);
			}
		});
	};

	this.findEventById = function(eventId, action) {
		geddy.model.Event.first({id: eventId}, function(err, event) {
			if (err || !event) {
				console.log("Could not find event by ID" + eventId);
				action(err, null);
			} else {
				action(null, event);
			}
		});
	};

	// TODO: not convinced we need this (especially monkey-patching events)
	// get all posts belonging to an event
	this.getPostsToDisplay = function(event, action) {
		event.getPosts(function(err, posts) {
			if (err) {
				action(err, null);
			} else {
				// add event attribute to each post(the view needs it I guess)
				async.eachSeries(posts, function(post,callback) {
					post.getEvent(function(err, event) {
						post.event = event;
						callback(err);
					});
				}, function(err){
					if (err) {
						action(err,null);
					}
					action(null, posts);
				});
			}
		});
	};

	// get all existing posts for display
	this.getAllPostsToDisplay = function(events, action) {
		var posts = [];
		// foreach post, get each comment belonging to that post
		async.eachSeries(events, function(event, callback) {
			this.getPostsToDisplay(events[i], function(err, data) {
				posts.concat(data);
				callback(err);
			});
		},function(err){
			if(err) {
				action(err,null);
			}
			action(null,posts);
		})
	};

	this.removeEventFromDB = function(event, action) {
		geddy.model.Event.remove(event.id, function(err) {
			if (err) {
				action(err);
			}
			action(null);
		});
	}
}

module.exports = new EventService();
