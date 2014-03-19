
var EventService = function() {
	var userservice = require('../services/userservice');

	this.getCourseNames = function (events, action){
		var self = this;
		var coursenames = new Array();

		for (var i = 0; i < events.length; i++) {
			geddy.log.debug("all: " + events[i]);
			coursenames[i] = events[i].getEventsCourseName();
		}
		action(null, coursenames);
	};

	this.getCourseNumbers = function (events, action){
		var self = this;
		var coursenumbers = new Array();

		for (var i = 0; i < events.length; i++) {
			coursenumbers[i] = events[i].getEventsCourseNumber();
		}
		action(null, coursenumbers);
	};

	this.getCourseName = function (event){
		var self = this;
		var coursename = event.getEventsCourseName();
		return coursename;
	}

	this.getCourseNumber = function (event){
		var self = this;
		var coursenumber = event.getEventsCourseNumber();
		return coursenumber;
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

	this.addPostToEvent = function(eventModel, postModel, action) {
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
				// TODO : single or double quote here?
				action({event: 'The event was not found'}, null);
			} else {
				action(null, feed);
			}
		});
	};

	this.getPostsToDisplay = function(events, selectedEvent, action) {
		var posts = new Array();

		// TODO make this block its own function in the controller that calls
	    // getTweetsToDisplay
	    // that way it will be getTweetsToDisplay(feeds, action)
	    // will be called in posts.js and main.js
		if (selectedEvent != -1) {
			for (var i = 0,len = events.length; i < len; i++) {
				if (events[i].id == selectedEvent) {
					events = [events[i]];
					break;
				}
			}
		}

		// iterate through posts in an event
		(function() {
			if (events.length > 0) {
				for (var i = 0, len1=events.length; i < len1; i++) {
					(function () {
						events[i].getPosts(function(err, eventPosts) {
							if (err) {
								action(err, null);
							} else {
								tweets = tweets.concat(eventPosts);
								if (i == len1-1) {
									posts.sort(function(a,b) {
										if (a.postdate.getTime() > b.postdate.getTime()) {
											return -1;
										} else if (a.postdate.getTime() < b.postdate.getTime()) {
											return 1;
										} else {
											return 0;
										}
									});

									(function() {
										var unpacked = new Array();
										for (var j = 0, len2 = posts.length; j < len2; j++) {
											var post = posts[j];

											post.getEvent(function(err, event) {
												event.getUser(function(err, owner) {
													post.author = owner ? owner : {name: "No Author"};
													post.event = event;
													unpacked.push(post);
													if (j == len2-1) {
														action(null, unpacked);
													}
												});
											});
										}
										action(null, posts);
									}());
								}
							}
						});
					}());
				}
			} else {
				action(null, []);
			}
		}());
	};
};

module.exports = new EventService();
