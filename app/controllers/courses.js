var passport = require('../helpers/passport')
  , requireAuth = passport.requireAuth;
var courseservice = require('../services/courseservice');
var scheduleservice = require('../services/scheduleservice');


var Courses = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];
  this.before(requireAuth, {});

  this.index = function (req, resp, params) {
    var self = this;
    var courses = null;
    var myCoursesIds = null;

    courseservice.getUserCoursesIds(this.session.get('userId'), function (err, data){
      if (err){
        throw err;
      }
      myCoursesIds = data;
    });

    geddy.model.Course.all(function (err, data) {
      if (err) {
        throw err;
      }
      courses = data;
    });
    self.respond({courses: courses, usercoursesId: myCoursesIds});
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
      var inviteesString = params.invitees;
      courseInvitees = inviteesString.split(",");
      //add current user's id to list
      courseInvitees.push(this.session.get('userId'));
      //assign the coursedata invitees to array and create the object
      courseData.invitees = courseInvitees;
    }else{
      //public should just be an empty array of invitees
      courseData.invitees = [];
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
        var schedule = geddy.model.Schedule.createSchedule(course);
        course.setSchedule(schedule);
        course.save(function(err, data){
          if (err){
            throw err;
          }
        });
        //course.setSchedule(schedule);
        self.respondWith(course, {status: err});
      });
    }
  };

  this.show = function (req, resp, params) {
    var self = this;
    var mySchedule = null;
    var nonFormattedEvents = null;

    geddy.model.Course.first(params.id, function(err, course) {
      if (err) {
        throw err;
      }
      if (!course) {
        throw new geddy.errors.NotFoundError();
      }
      else {
        course.getSchedule(function (err, schedule){
          if (err){
            throw err;
          }
          mySchedule = schedule;
        });
        mySchedule.getEvents(function (err, data) {
          if (err) {
            throw err;
          }
          nonFormattedEvents = data;
        });
        scheduleservice.formatEventsForCalendar(nonFormattedEvents, function(err, events){
          if (err) {
            throw err;
          }
          self.respond({course: course, schedule: mySchedule, events: events});
        });
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
      course.updateProperties(params);

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
        geddy.model.Course.remove(params.id, function(err) {
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
    var myUser = null;
    var myCourse = null;

    geddy.model.User.first(uId, function (err, user){
      if (err){
        throw err;
      }
      myUser = user;
    });
    geddy.model.Course.first(cId, function (err, course){
      if (err){
        throw err;
      }
      myCourse = course;
    });
    courseservice.addCourse(myUser, myCourse, function(err, data) {
      if (err) {
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
    var myUser = null;
    var myCourse = null;

    geddy.model.User.first(uId, function (err, user){
      if (err){
        throw err;
      }
      myUser = user;
    });
    geddy.model.Course.first(cId, function (err, course){
      if (err){
        throw err;
      }
      myCourse = course;
    });
    courseservice.removeThisCourse(myUser, myCourse, function (err, data) {
      if (err) {
        throw err;
      }
      self.respond({params: params}, {
        format: 'html'
        , template: 'app/views/courses/index'
        , layout: false
      });
    });
  };

};

exports.Courses = Courses;
