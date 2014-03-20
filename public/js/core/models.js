(function () {
var Comment = function () {

  this.defineProperties({
    author: {type: 'object', required: true},
    timestamp: {type: 'datetime', required: true},
    message: {type: 'string', required: true}
  });

  this.belongsTo('Post');

//  //? is this correct
//  this.validatesPresent('postingUser');
};

exports.Comment = Comment;
}());

(function () {
var Course = function () {

  this.defineProperties({
    name: {type: 'string', required: true},
    courseNumber: {type: 'int'},
    section: {type: 'int'},
    professor: {type: 'string'}
  });

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
    repeats: {type: 'string', required: true},

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

  //this.validatesPresent('name');
  this.belongsTo('Course');
  this.hasMany('Post');

  this.hasOne('User'); //creator
  //this.hasMany('Posts');
 // this.hasMany('Enrollments'); //attendees
 // this.hasMany('Users', {through: "Enrollments"})

  //returns name of course that event belongs to
  this.courseHasName = function () {
    var self = this;
    var name = null;
    //searches all courses for course that the event belongs to
    geddy.model.Course.first(self.courseId, function(err, course) {
      if (err) {
        throw err;
      }
      // assign name of course to variable name
      name = course.name;
    });
    //returns course's name
    return name;
  };

  //returns courseNumber of course that event belongs to
  this.courseHasNumber = function () {
    var self = this;
    var name = null;
    //searches all courses for course that the event belongs to
    geddy.model.Course.first(self.courseId, function(err, course) {
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
exports.Event = Event;
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

var Post = function () {

  this.defineProperties({
  // we will want to query for posts primarily by their datetime
    timestamp: {type: 'datetime', required: true},
    locationDescription: {type: 'string'},
    locationLat: {type: 'number'},
    locationLong: {type: 'number'},
    // querying by posting user will also be important
    author: {type: 'object', required: true},
    comments: {type: 'object'}
//    // is the post natively created in Buzz, or pulled in from Twitter/Facebook?
//    nativePost: {type: 'boolean', required: true}
  });

  this.belongsTo('Event');
  
  // this.belongsTo('User');
  this.hasMany('Comments');
};

exports.Post = Post;
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
};

User.prototype.isActive = function () {
  return !!this.activatedAt;
};

User = geddy.model.register('User', User);
}());