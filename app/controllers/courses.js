var passport = require('../helpers/passport')
  , requireAuth = passport.requireAuth;
var courseservice = require('../services/courseservice');
var scheduleservice = require('../services/scheduleservice');
var eventservice = require('../services/eventservice');
var UserResponder = require('../helpers/responders').UserResponder;
var async = require('async');


var Courses = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];
  this.before(requireAuth, {});
  this.responder = new UserResponder(this);

  this.index = function (req, resp, params) {
    var self = this;
    var userId = this.session.get('userId');

    var _parallelIds = function(callback) {
      courseservice.getUserCoursesIds(userId, function (err, data){
        if (err){
          callback(err,null);
        }
        callback(err,data);
      });
    }

    var _parallelCourses = function(callback){
      geddy.model.Course.all(function (err, data) {
        if (err) {
          callback(err, null);
        }
        var showCourses = [];
        for (var i = 0; i < data.length; i++) {
          var courseInvitees = [];
          courseInvitees = data[i].invitees;
          if ((data[i].isPublic) || (courseInvitees.indexOf(userId) != -1)){
            showCourses.push(data[i]);
          }
        }
        callback(err,showCourses);
      });

    }

    async.parallel([_parallelIds, _parallelCourses], function(err, results) {
      self.respond({courses: results[1], usercoursesId: results[0]});
    });
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    var self = this
    var courseData = {
      name: params.name,
      courseNumber: params.courseNumber,
      section: params.section,
      professor: params.professor,
      isPublic: params.isPublic,
      invitees: null
    }
    //if it is private we need to set invitee list
    if (!(params.isPublic == "true")){
      //split the invitees string into an array of user ID's
      var courseInvitees = new Array();
      //var inviteesEmail = newArray();
      var inviteesString = params.invitees;
      courseInvitees = inviteesString.split(",");


      //add current user's id to list
      courseInvitees.push(this.session.get('userId'));
      //assign the coursedata invitees to array and create the object
      courseData.invitees = courseInvitees;
    }else{
      //public should just be an empty array of invitees
      courseData.invitees = ["none"];
    }

    var course = geddy.model.Course.create(courseData);
    if (!course.isValid()) {
      this.respondWith(course);
    }
    else {

      course.save(function(err, data) {
        if (err) {
          throw err;
        }
        var _createASchedule = function(callback) {
          geddy.model.Schedule.createSchedule(course, function(err, schedule){
            course.setSchedule(schedule);
            callback(err);
          });
        }

        var _saveCourse = function(callback) {
          course.save(function(err, data){
            callback(err);
          });
        }

        async.waterfall([_createASchedule, _saveCourse], function(err) {
          if (err) {
            throw err;
          }
          self.respondWith(course, {status: err});
        });
      });
    }
  };

  this.show = function (req, resp, params) {
    var self = this;

    geddy.model.Course.first(params.id, function(err, course) {
      if (err) {
        throw err;
      }
      if (!course) {
        throw new geddy.errors.NotFoundError();
      }
      else {

        var _getSchedule = function(callback) {
          course.getSchedule(function (err, schedule){
            callback(err,schedule);
          });
        }

        var _getEventsFromSchedule = function(schedule, callback) {
          schedule.getEvents(function (err, data) {
            callback(err,data,schedule);
          });
        }

        var _formatEventsForCalendar = function(changeevents, schedule, callback) {
          scheduleservice.formatEventsForCalendar(changeevents, function(err, events){
            callback(err,events,schedule);
          });
        }

        async.waterfall([_getSchedule,_getEventsFromSchedule,_formatEventsForCalendar],function(err, events, schedule) {
          if(err){
            throw err;
          }
          self.respond({course: course, schedule: schedule, events: events});
        })
      }
    });
  };

  this.edit = function (req, resp, params) {
    var self = this;

    geddy.model.Course.first(params.id, function(err, course) {
      if (err) {
        throw err;
      }
      if (!course) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        self.respondWith(course);
      }
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.Course.first(params.id, function(err, course) {
      if (err) {
        throw err;
      }

      var courseData = {
        name: params.name,
        courseNumber: params.courseNumber,
        section: params.section,
        professor: params.professor,
        isPublic: params.isPublic,
        invitees: null
      }
      //if it is private we need to set invitee list
      if (!(params.isPublic == "true")){
        //split the invitees string into an array of user ID's
        var courseInvitees = new Array();
        var inviteesString = params.invitees;
        courseInvitees = inviteesString.split(",");
        //add current user's id to list
        courseInvitees.push(self.session.get('userId'));
        //assign the coursedata invitees to array and create the object
        courseData.invitees = courseInvitees;
      }else{
        //public should just be an empty array of invitees
        courseData.invitees = ["none"];
      }

      course.updateProperties(courseData);

      if (!course.isValid()) {
        self.respondWith(course);
      }
      else {
        course.save(function(err, data) {
          if (err) {
            throw err;
          }
          self.respondWith(course, {status: err});
        });
      }
    });
  };

  this.remove = function (req, resp, params) {
    var self = this;

    geddy.model.Course.first(params.id, function(err, course) {
      if (err) {
        throw err;
      }
      if (!course) {
        throw new geddy.errors.BadRequestError();
      }
      else {

        var _getSchedule = function(callback) {
          course.getSchedule(function(err, schedule){
            callback(err,schedule);
          });
        }

        var _getEvents = function(schedule, callback) {
          schedule.getEvents(function(err, events){
            callback(err, schedule, events);
          });
        }

        var _removeEvents = function(schedule, events, callback) {
          async.each(events, function(event, callback){
            eventservice.removeEventFromDB(event, function(err){
              callback(err);
            });
          }, function(err){
            callback(err, schedule);
          });
        }

        var _removeSchedule = function(schedule, callback) {
          scheduleservice.removeScheduleFromDB(schedule, function(err){
            callback(err);
          });
        }

        var _removeCourse = function(callback) {
          courseservice.removeCourseFromDB(course, function(err){
            callback(err);
          });
        }

        async.waterfall([_getSchedule, _getEvents, _removeEvents, _removeSchedule, _removeCourse], function(err) {
          if (err) {
            throw err;
          }
          self.respondWith(course);
        });
      }
    });
  };

  this.subscribeUser = function (req, resp, params) {
    var self = this;
    var uId = this.session.get('userId');
    var cId = params.id;

    var _getUser = function(callback) {
      geddy.model.User.first(uId, function (err, user){
        callback(err, user);
      });
    }

    var _getCourse = function(user, callback) {
      geddy.model.Course.first(cId, function (err, course){
        callback(err, course, user);
      });
    }

    var _addCourse = function(course, user, callback) {
      courseservice.addCourse(user, course, function(err, data) {
        callback(err);
      });
    }

    async.waterfall([_getUser,_getCourse,_addCourse],function(err) {
      if(err) {
        throw err;
      }
      self.respond({params: params}, {
        format: 'html'
        , template: 'app/views/courses/index'
        , layout: false
      });
    });

  };

  this.unsubscribeUser = function (req, resp, params) {
    var self = this;
    var uId = this.session.get('userId');
    var cId = params.id;


    var _getUser = function(callback) {
      geddy.model.User.first(uId, function (err, user){
        callback(err, user);
      });
    }

    var _getCourse = function(user, callback) {
      geddy.model.Course.first(cId, function (err, course){
        callback(err, course, user);
      });
    }

    var _removeCourse = function(course, user, callback) {
      courseservice.removeThisCourse(user, course, function (err, data) {
        callback(err);
      });
    }

    async.waterfall([_getUser,_getCourse,_removeCourse], function(err) {
      if(err) {
        throw err;
      }
      self.respond({params: params}, {
        format: 'html'
        , template: 'app/views/courses/index'
        , layout: false
      });
    });

  };

  this.emailInvites = function(req, resp, params) {
      var self = this;
      var courseId = params.courseId;
      var invitees = params.invitees;
      
     courseservice.emailInvites(courseId, invitees, function (err, data) {
        callback(err);
      });

  }

};

exports.Courses = Courses;
