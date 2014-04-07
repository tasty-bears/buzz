/*
 * Geddy JavaScript Web development framework
 * Copyright 2112 Matthew Eernisse (mde@fleegix.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/
var strategies = require('../helpers/passport/strategies')
  , authTypes = geddy.mixin(strategies, {local: {name: 'local account'}});
var courseservice = require('../services/courseservice');
var eventservice = require('../services/eventservice');
var scheduleservice = require('../services/scheduleservice');

var Main = function () {
  var mainControllerSelf = this;

  this.index = function (req, resp, params) {
    var self = this
      , User = geddy.model.User;
    User.first({id: this.session.get('userId')}, function (err, user) {
      var data = {
        user: null
      , authType: null
      , courses: null
      , events: null
      };
      if (user) {
        data.user = user;
        data.authType = authTypes[self.session.get('authType')].name;

        //get the courses the user is enrolled in
        data.user.getCourses(function(err, myCourses) {
          if (err) {
            throw err;
          }
          data.courses = myCourses;
        });

        if(data.courses != null){
          //make temp array for all of events the user must attend
          var myEvents = new Array();
          //loop through and get all events for each course user is in
          for (var i = 0; i < data.courses.length; i++){
            courseservice.getEventsFromSchedule(data.courses[i], function(err, data) {
              if (err) {
                throw err;
              }
              // add each event to temp array
              for (var x in data){
                myEvents.push(data[x]);
              }
            });
          }
          myEvents = myEvents.sort(function(a, b){
              if(a.date < b.date) return -1;
              if(a.date > b.date) return 1;
              return 0;
          });

          data.events = mainControllerSelf.getEventsForCalendar();
        }

      }
      self.respond(data, {
        format: 'html'
      , template: 'app/views/main/index'
      });
    });
  };

  this.login = function (req, resp, params) {
    this.respond(params, {
      format: 'html'
    , template: 'app/views/main/login'
    });
  };

  this.logout = function (req, resp, params) {
    this.session.unset('userId');
    this.session.unset('authType');
    this.respond(params, {
      format: 'html'
    , template: 'app/views/main/logout'
    });
  };

  this.getEventsForCalendar = function() {
    var self = this;
    var currentUser = null;
    var nonFormattedEvents = null;
    var calEvents = null;

    geddy.model.User.first(this.session.get('userId'), function(err, user) {
      if (err) {
        throw err;
      }
      currentUser = user;
    });
    scheduleservice.getCalendarEvents(currentUser, function(err, events){
      if (err) {
        throw err;
      }
      nonFormattedEvents = events;
    });
    scheduleservice.formatEventsForCalendar(nonFormattedEvents, function(err, events){
      if (err) {
        throw err;
      }
      calEvents = events;
    });
    return calEvents;
  }

};

exports.Main = Main;
