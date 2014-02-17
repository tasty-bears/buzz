var passport = require('../helpers/passport')
  , requireAuth = passport.requireAuth;

var Courses = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];
  this.before(requireAuth, {});

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.Course.all(function(err, courses) {
      if (err) {
        throw err;
      }
      self.respondWith(courses, {type:'Course'});
    });
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    var self = this
      , course = geddy.model.Course.create(params);

    if (!course.isValid()) {
      this.respondWith(course);
    }
    else {
      course.save(function(err, data) {
        if (err) {
          throw err;
        }
        self.respondWith(course, {status: err});
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
        course.getEvents(function (err, data) {
          self.respond({course: course, events: data});
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

};

exports.Courses = Courses;

