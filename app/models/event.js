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
