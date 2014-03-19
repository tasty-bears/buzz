(function () {
var Course = function () {

  this.defineProperties({
    name: {type: 'string', required: true},
    courseNumber: {type: 'int'},
    section: {type: 'int'},
    professor: {type: 'string'}
  });

  this.hasOne('Schedule');

  this.hasMany('Enrollments');
  this.hasMany('Users',{through: 'Enrollments'});
 
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
Course.prototype.someOtherMethod = function () {
  // Do some other stuff
};
// Can also define static methods and properties
Course.someStaticMethod = function () {
  // Do some other stuff
};
Course.someStaticProperty = 'YYZ';
*/

Course = geddy.model.register('Course', Course);
}());

(function () {
var Enrollment = function () {

  this.defineProperties({
    
  });
  
  this.belongsTo('User');
  this.belongsTo('Course');
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
Enrollment.prototype.someOtherMethod = function () {
  // Do some other stuff
};
// Can also define static methods and properties
Enrollment.someStaticMethod = function () {
  // Do some other stuff
};
Enrollment.someStaticProperty = 'YYZ';
*/

exports.Enrollment = Enrollment;

}());

(function () {
var Event = function () {
  // change name to summary
  // change summary to not required
  this.defineProperties({
    name: {type: 'string', required: true},
    description: {type: 'string' , required: true},
     isPrivate: {type: 'boolean', required: true},
     date: {type: 'date', required: true},
     time: {type: 'time', required: true},
   //  datetimeEnd: {type: 'datetime'},
    // //creator: {type: 'object'},
     duration: {type: 'number', required: true},

    locationDescription: {type: 'string', required: true},
    locationLat: {type: 'number'},
    locationLong: {type: 'number'},

    // //none, daily, weekly, monthly
    repeats: {type: 'string', required: false},

    //pass in array of weekday indexes (0-6) (start sunday)
     repeatDaysOfWeek: {type: 'object'},
     repeatDayOfMonth: {type: 'number'},
    //recurrenceEndDate: {type: 'datetime'},
     numberOfRecurrences: {type: 'number'}

   //inviteList: {?},
  //attendeeList: {?},

    //attendeesCanInvite: {type: 'bool'},
    //inviteIsRecurring: {type: 'bool'},
  });

  this.validatesPresent('name');
  this.belongsTo('Schedule');

  this.hasOne('User'); //creator
  //this.hasMany('Posts');
 // this.hasMany('Enrollments'); //attendees
 // this.hasMany('Users', {through: "Enrollments"})

  //returns name of course that event belongs to
  this.courseHasName = function () {
    var self = this;
    var name = null;
    var courseId = null;

    //searches the list of schedules for the schedule that the event belongs to
    geddy.model.Schedule.first(self.scheduleId, function(err, schedule) {
      if (err) {
        throw err;
      }
      //assign course id of schedule to the local var
      courseId = schedule.courseId;
    });
    //searches all courses for course that the event belongs to
    geddy.model.Course.first(courseId, function(err, course){
      if (err) {
        throw err;
      }
      // assign name of course to variable name
      name = course.name;
    })
    //returns course's name
    return name;
  };

  //returns courseNumber of course that event belongs to
  this.courseHasNumber = function () {
    var self = this;
    var number = null;
    var courseId = null;

    //searches all schedules for the schedule the event belongs to
    geddy.model.Schedule.first(self.scheduleId, function(err, schedule) {
      if (err) {
        throw err;
      }
      //assign course id of schedule to the local var
      courseId = schedule.courseId;
    });
    //searches all courses for course that the schedule belongs to
    geddy.model.Course.first(courseId, function(err, course) {
      if (err) {
        throw err;
      }
      //assign course's number to variable number
      number = course.courseNumber;
    });
    //return value
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
}());

(function () {
var Passport = function () {
  this.defineProperties({
    authType: {type: 'string'},
    key: {type: 'string'}
  });

  this.belongsTo('User');
};

Passport = geddy.model.register('Passport', Passport);

}());

(function () {
var Schedule = function () {

  this.defineProperties({
    name: {type: 'string', required: true}
  });
  this.belongsTo('Course');
  this.hasMany('Events');

  
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

Schedule.createSchedule = function(course){
  var self = this
  , scheduleName = course.name + ' Schedule';
  var schedule = geddy.model.Schedule.create({name: scheduleName});
  if (!schedule.isValid()){
    geddy.log.debug('not valid schedule');
    self.respondWith(schedule);
  }
  schedule.save(function(err, data){
    if (err) {
      throw err;
      geddy.log.debug('error in save schedule');
    } 
    geddy.log.debug(scheduleName + ' as it should be');
  });
  return schedule;
};

/*
// Can also define them on the prototype
Schedule.prototype.someOtherMethod = function () {
  // Do some other stuff
};
// Can also define static methods and properties
Schedule.someStaticMethod = function () {
  // Do some other stuff
};
Schedule.someStaticProperty = 'YYZ';
*/

exports.Schedule = Schedule;

}());

(function () {
var User = function () {
  this.defineProperties({
    username: {type: 'string', required: true, on: ['create', 'update']}
  , password: {type: 'string', required: true, on: ['create', 'update']}
  , familyName: {type: 'string', required: true}
  , givenName: {type: 'string', required: true}
  , email: {type: 'string', required: true, on: ['create', 'update']}
  , activationToken: {type: 'string'}
  , activatedAt: {type: 'datetime'}
  });

  this.validatesLength('username', {min: 3});
  this.validatesLength('password', {min: 8});
  this.validatesConfirmed('password', 'confirmPassword');

  this.hasMany('Passports');

  this.hasMany('Enrollments');
  this.hasMany('Courses', {through: 'Enrollments'});
};

User.prototype.isActive = function () {
  return !!this.activatedAt;
};

User = geddy.model.register('User', User);
}());