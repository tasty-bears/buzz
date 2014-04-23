var courseservice = require('../services/courseservice.js');
var async = require('async');

var ScheduleService = function() {
	var schedServiceSelf = this;

	this.getCalendarEvents = function(userModel, action) {
		var self = this;

		var _getCourses = function(callback) {
			userModel.getCourses(function(err, courses) {
				callback(err,courses);
			});
		}

		var _getEvents = function(courses, callback) {
			var userEvents = [];
			async.each(courses, function(course, callback) {
				courseservice.getEventsFromSchedule(course,function(err, events) {
					if (err) {
						callback(err,null);
					}
					// add each event to temp array
					for (var x in events){
						userEvents.push(events[x]);
					}
					callback(null);
				});
			}, function(err){
				callback(err, userEvents);
			});
		}
		async.waterfall([_getCourses,_getEvents], function(err, userEvents) {
			if (err) {
				action(err,null);
			}
			action(null, userEvents);
		});

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

		//TODO: implement an actual fix for timezones. Have no idea how to
		//      but it needs to be figured out and done
		var correctDate = dateTime.toUTCString();

		return correctDate;

	}

	this.removeScheduleFromDB = function(schedule, action) {
		geddy.model.Schedule.remove(schedule.id, function(err) {
			if (err) {
				throw err;
			}
			action(err);
		});
	}

}

module.exports = new ScheduleService();
