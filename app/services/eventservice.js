var EventService = function() {
	var userservice = require('../services/userservice');
	var eventserviceSelf = this;

	this.getCourseNames = function (events, action){
		var self = this;
		var coursenames = new Array();

		for (var i = 0; i < events.length; i++) {
			coursenames[i] = eventserviceSelf.getCourseName(events[i]);
		}
		action(null, coursenames);
	};

	this.getCourseNumbers = function (events, action){
		var self = this;
		var coursenumbers = new Array();

		for (var i = 0; i < events.length; i++) {
			coursenumbers[i] = eventserviceSelf.getCourseNumber(events[i]);
		}
		action(null, coursenumbers);
	};

	this.getCourseName = function (myEvent){
		var self = this;
		myEvent.getSchedule(function (err, data){
			if(err){
				throw err;
			}
			sched = data;
		});
		var course = null;
		sched.getCourse(function (err,data){
			if(err){
				throw err;
			}
			course = data;
		});
		var name = course.name;
		return name;
	}

	this.getCourseNumber = function (myEvent){
		var self = this;
		var sched = null;
		myEvent.getSchedule(function (err, data){
			if(err){
				throw err;
			}
			sched = data;
		});
		var course = null;
		sched.getCourse(function (err,data){
			if(err){
				throw err;
			}
			course = data;
		});
		var number = course.courseNumber;
		return number;
	}

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

	this.addPost = function(eventModel, postModel, action) {
		var self = this;
		eventModel.addPost(postModel);
		eventModel.save(function(err, data) {
			if (err) {
				action(err, null);
			} else {
				action(null, data);
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

	this.getPostsToDisplay = function(event, action) {
		event.getPosts(function(err, posts) {
			if (err) {
				action(err, null);
			} else {

				// add event attribute to each post(the view needs it I guess)
				for (var i = 0; i < posts.length; i++) {
					posts[i].getEvent(function(err, event) {
						posts[i].event = event;
					});
				}

				action(null, posts);
			}
		});
	};

	this.getAllPostsToDisplay = function(events, action) {
		var posts = [];

		for(var i in events) {
			this.getPostsToDisplay(events[i], function(err, data) {
				posts.concat(data);
			}); 
		}

		action(null, posts);
	};

}

module.exports = new EventService();
