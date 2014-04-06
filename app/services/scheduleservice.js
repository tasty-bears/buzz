var courseservice = require('../services/courseservice.js');

var ScheduleService = function() {
	var schedServiceSelf = this;

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
			var allDay = true;
			var startDateTime = schedServiceSelf.getDateTime(nonFormattedEvents[x].date, nonFormattedEvents[x].time,0 );
			var endDateTime = schedServiceSelf.getDateTime(nonFormattedEvents[x].date, nonFormattedEvents[x].time, nonFormattedEvents[x].duration);
			if (endDateTime != null) {
				allDay = false;
			}
			var temp = {
				id: nonFormattedEvents[x].id,
				title: nonFormattedEvents[x].name,
				start: startDateTime,
				end: endDateTime,
				allDay: allDay,
				url: '/events/' + nonFormattedEvents[x].id
			}
			formattedEvents.push(temp);
		}

		action(null, formattedEvents);
	}

	this.getDateTime = function(date, time, timeOffset) {
		var dateTime = new Date();

		dateTime.setFullYear(date.getFullYear());
		dateTime.setMonth(date.getMonth());
		dateTime.setDate(date.getDate());
		dateTime.setHours(time.getHours());
		dateTime.setMinutes(time.getMinutes() + timeOffset);
		var correctDate = dateTime.toUTCString();

		return correctDate;

	}

}

module.exports = new ScheduleService();
