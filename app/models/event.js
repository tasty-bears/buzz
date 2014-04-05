var Event = function () {
  // change name to summary
  // change summary to not required
  this.defineProperties({
    name: {type: 'string', required: true},
    description: {type: 'string' , required: true},
    isPrivate: {type: 'boolean', required: true},
    date: {type: 'date', required: true},
    time: {type: 'time', required: true},
    //datetimeEnd: {type: 'datetime'},
    //creator: {type: 'object'},
    duration: {type: 'number', required: true},

    locationDescription: {type: 'string', required: true},
    locationLat: {type: 'number'},
    locationLong: {type: 'number'},

    //none, daily, weekly, monthly
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
  this.hasMany('Posts');
  this.hasOne('User'); //creator
  
  //this.hasMany('Enrollments'); //attendees
  //this.hasMany('Users', {through: "Enrollments"})
};

Event = geddy.model.register('Event', Event);
exports.Event = Event;
