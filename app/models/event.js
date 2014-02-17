var Event = function () {

  this.defineProperties({
    name: {type: 'string', required: true},
    description: {type: 'string'},
    isPrivate: {type: 'boolean'},
    date: {type: 'date'}
  });

  this.validatesPresent('name');
  this.belongsTo('Course');

  this.courseHasName = function () {
    var self = this;
    var name = null;
    geddy.model.Course.first(self.courseId, function(err, course) {
      if (err) {
        throw err;
      }
      name = course.name;
    });
    return name;
  };

  this.courseHasNumber = function () {
    var self = this;
    var name = null;
    geddy.model.Course.first(self.courseId, function(err, course) {
      if (err) {
        throw err;
      }
      number = course.courseNumber;
    });
    return number;
  };
  
  // this.validatesPresent('description');

  /*
  this.property('login', 'string', {required: true});
  this.property('password', 'string', {required: true});
  this.property('lastName', 'string');
  this.property('firstName', 'string');

  this.validatesPresent('login');
  this.validatesFormat('login', /[a-z]+/, {message: 'Subdivisions!'});
  this.validatesLength('login', {min: 3});
  // Use with the name of the other parameter to compare with
  this.validatesConfirmed('password', 'confirmPassword');
  // Use with any function that returns a Boolean
  this.validatesWithFunction('password', function (s) {
      return s.length > 0;
  });

  // Can define methods for instances like this
  this.someMethod = function () {
    // Do some stuff
  };
  */

};

/*
// Can also define them on the prototype
Event.prototype.someOtherMethod = function () {
  // Do some other stuff
};
// Can also define static methods and properties
Event.someStaticMethod = function () {
  // Do some other stuff
};
Event.someStaticProperty = 'YYZ';
*/

Event = geddy.model.register('Event', Event);
