var passport = require('../helpers/passport')
  , requireAuth = passport.requireAuth;
var userservice = require('../services/userservice');
var eventservice = require('../services/eventservice');
var UserResponder = require('../helpers/responders').UserResponder;
var async = require('async');

var Events = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];
  this.before(requireAuth, {});
  this.responder = new UserResponder(this);


  this.addEvent = function(req, resp, params) {
    var self = this;

    userservice.loadUserFromSession(self.session, function(err, user) {
		  var event = geddy.model.Event.create(params);
      eventservice.addEvent(user, event, function(err, events) {
        self.respond({params: params, events: events, selectedEvent: -1}, {
          format: 'html'
          , template: 'app/views/main/_eventView'
          , layout: false
        });
      });
    });
  };

  this.index = function (req, resp, params) {
    var self = this;
    var courseNames = new Array();
    var courseNumbers = new Array();

    geddy.model.Event.all({createdAt: {ne: null}}, {sort: {date: 'asc'}},function(err, events) {
      if (err) {
        throw err;
      }

      var _getCourseNames = function(callback) {
        eventservice.getCourseNames(events, function (err, data){
          callback(err,data);
        });
      }

      var _getCourseNumbers = function(courseNames, callback) {
        eventservice.getCourseNumbers(events, function (err, data){
          callback(err,data,courseNames)
        });
      }

      async.waterfall([_getCourseNames,_getCourseNumbers],function(err,courseNumbers,courseNames){
        self.respond({events: events, eventCourseNames: courseNames, eventCourseNumbers: courseNumbers});
      });
    });
  };

  this.add = function (req, resp, params) {
    var self = this;
    geddy.model.Schedule.all(function (err, data) {
      if (err) {
        throw err;
      }
      self.respond({params: params, schedules: data});
    });
  };

  this.create = function (req, resp, params) {
    var self = this
      , event = geddy.model.Event.create(params);

    if (!event.isValid()) {
      this.respondWith(event);
    }
    else {
      event.save(function(err, data) {
        if (err) {
          throw err;
        }
        self.respondWith(event, {status: err});
      });
    }
  };

  this.show = function (req, resp, params) {
    var self = this;

    self._show(params, function(err, event) {
      self.respondWith(event);
    });
  };

  this._show = function(params, action){
    var self = this;
    var event = null;

    geddy.model.Event.first(params.id, function(err, eventModel) {
      if (err) {
        throw err;
      }
      if (!eventModel) {
        throw new geddy.errors.NotFoundError();
      }
      else {
        event = eventModel;
        var _getPosts = function (callback) {
          eventservice.getPostsToDisplay(event, function(err, posts) {
            if (err) {
                callback(err);
            } else {
               event.posts = posts;
            }
            callback(null);
          });
        }
        async.parallel([_getPosts], function(err){
          if (err) {
            throw err;
          }
          event.getSchedule(function(err, schedule) {
            event.schedule = schedule;
            schedule.getCourse(function(err, course) {
              event.schedule.course = course;
              action(null,event);
            });
          });
        });
      }
    });
  };

  this.edit = function (req, resp, params) {
    var self = this;

    geddy.model.Event.first(params.id, function(err, event) {
      if (err) {
        throw err;
      }
      if (!event) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        geddy.model.Schedule.all(function (err, data) {
          if (err) {
            throw err;
          }
          self.respond({event: event, schedules: data});
        });
      }
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.Event.first(params.id, function(err, event) {
      if (err) {
        throw err;
      }
      event.updateProperties(params);

      if (!event.isValid()) {
        self.respondWith(event);
      }
      else {
        event.save(function(err, data) {
          if (err) {
            throw err;
          }
          self.respondWith(event, {status: err});
        });
      }
    });
  };

  this.remove = function (req, resp, params) {
    var self = this;

    geddy.model.Event.first(params.id, function(err, event) {
      if (err) {
        throw err;
      }
      if (!event) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        eventservice.removeEventFromDB(event, function(err){
          if (err) {
            throw err;
          }
          self.respondWith(event);
        });
      }
    });
  };

};

exports.Events = Events;
