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
var async = require('async');

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
      if (user != null) {

        data.user = user;
        data.authType = authTypes[self.session.get('authType')].name;

        var _getCourses = function(callback) {
          //get the courses the user is enrolled in
          data.user.getCourses(function(err, myCourses) {
            if (err) {
              callback(err,null);
            }
            data.courses = myCourses;
            callback(err,myCourses);
          });
        }


        var _getEvents = function(courses, callback){
          if(courses != null){
            //make temp array for all of events the user must attend
            var myEvents = new Array();
            //loop through and get all events for each course user is in

            //ASYNC FOR EACH COURSE
            async.each(courses, function(course,callback){
              courseservice.getEventsFromSchedule(course, function(err, data) {
                if (err) {
                  throw err;
                }
                // add each event to temp array
                for (var x in data){
                  myEvents.push(data[x]);
                }
                callback(err);
              });
            }, function(err){
              callback(err,myEvents);
            });
          }
        }

        var _sortEvents = function(myEvents, callback) {
          myEvents = myEvents.sort(function(a, b){
              if(a.date < b.date) return -1;
              if(a.date > b.date) return 1;
              return 0;
          });
          callback(null, myEvents);
        }

        var _getCalEvents = function(myEvents, callback) {
          mainControllerSelf.getEventsForCalendar(function(err, events){
            console.log(events);
            data.events = events;
            callback(err);
          });
        }

        async.waterfall([_getCourses,_getEvents,_sortEvents,_getCalEvents],function(err) {
          if (err) {
            throw err;
          }
          self.respond(data, {
            format: 'html'
          , template: 'app/views/main/index'
          });
        });

      } else {
        self.respond(data, {
          format: 'html'
        , template: 'app/views/main/index'
        });
      }
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

  this.getEventsForCalendar = function(action) {
    var self = this;
    var userId = this.session.get('userId');

    var _getUser = function(callback) {
      geddy.model.User.first(userId, function(err, user) {
        callback(err, user);
      });
    }

    var _getCalendarEvents = function(currentUser, callback) {
      scheduleservice.getCalendarEvents(currentUser, function(err, events){
        console.log(events);
        callback(err, events);
      });
    }

    var _formatEvents = function(events,callback) {
      scheduleservice.formatEventsForCalendar(events, function(err, formattedEvents){
        callback(err,formattedEvents);
      });
    }

    async.waterfall([_getUser,_getCalendarEvents,_formatEvents],function(err,events){
      if (err) {
        action(err,null);
      }
      action(null,events);
    })

  }

};

exports.Main = Main;
