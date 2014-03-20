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

var Main = function () {

  this.index = function (req, resp, params) {
    var self = this
      , User = geddy.model.User;
    User.first({id: this.session.get('userId')}, function (err, user) {
      var data = {
        user: null
      , authType: null
      , courses: null
      , events: null
      , eventnames: null
      , eventnumbers: null
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
        //assign data events array for view use
        data.events = myEvents;

        //get course names and numbers for event naming on view
        //temp arrays to get values
        var names = new Array();
        var numbers = new Array();
        for (var i = 0; i < data.events.length; i++) {
          //call functions from event service to get corresponding name and number
          names.push(eventservice.getCourseName(data.events[i]));
          numbers.push(eventservice.getCourseNumber(data.events[i]));
        }
        //assign values to data to pass to view
        data.eventnames = names;
        data.eventnumbers = numbers;

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

};

exports.Main = Main;
