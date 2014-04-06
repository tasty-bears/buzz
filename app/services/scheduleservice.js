var courseservice = require('../services/courseservice.js');

var ScheduleService = function() {

	this.getCalendarEvents = function(userModel, action) {
		var self = this;
		var userCourses = new Array();
		var userEvents = new Array();

		userModel.getCourses(function(err, courses) {
			if(err) {
				action(err,null);
			}
			userCourses = courses;
		});

		for (var course in userCourses) {
			courseservice.getEventsFromSchedule(userCourses[course],function(err, events) {
				if (err) {
					action(err,null);
				}
				// add each event to temp array
				for (var x in events){
					userEvents.push(events[x]);
				}
			});
		}
		action(null, userEvents);
	}

	this.formatEventsForCalendar = function (nonFormattedEvents, action){
		var formattedEvents = new Array();
		var temp = {
			id: null,
			title: null,
			start: null,
			end: null,
			url: null,
			editable: false
		}

		//make calendar event array
		for (var x in nonFormattedEvents) {
			//implement start and end dates.
			//var startDateTime = nonFormattedEvents[x].date + nonFormattedEvents[x].time;
			//var endDateTime = nonFormattedEvents[x].date + nonFormattedEvents[x].time
			var temp = {
				id: nonFormattedEvents[x].id,
				title: nonFormattedEvents[x].name,
				start: nonFormattedEvents[x].date,
				url: '/events/' + nonFormattedEvents[x].id
			}
			formattedEvents.push(temp);
		}

		action(null, formattedEvents);
	}

}

module.exports = new ScheduleService();
