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

Schedule.createSchedule = function(course, action){
  var self = this
  , scheduleName = course.name + ' Schedule';
  var schedule = geddy.model.Schedule.create({name: scheduleName});
  if (!schedule.isValid()){
    geddy.log.debug('not valid schedule');
    self.respondWith(schedule);
  }
  schedule.save(function(err, data){
    if (err) {
      geddy.log.debug('error in save schedule');
      action(err, null);

    }
    geddy.log.debug(scheduleName + ' as it should be');
    action(null, data);

  });
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
