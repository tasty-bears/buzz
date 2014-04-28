var simplexService = require('../services/simplexservice');
var mediaService = require('../services/mediaservice');
var stagingService = require('../services/stagingservice');
var fooService = require('../services/fooservice');
var async = require('async');

var FooManager = function () {

  this.index = function (req, resp, params) {
    var self = this

    var opts = {
          format: 'html'
        , template: 'app/views/foomanager/index'
        };
    self.respond(null, opts);
  };

  this.stage = function(req, resp, params) {
    var self = this;

    stagingService.solve_simplex(function(err, optimal) {
      if(err) {
        self.flash.error(err.message || err)
      }
      else {
        delete optimal.feasible;
        delete optimal.result;
        self.flash.success(optimal);
      }

      stagingService.stage_all(optimal, function (err) {
        if(err) {
          throw err;
        }

        self.redirect('/foo');
      });        
    });
  }

  this.dump = function(req, resp, params) {
    var self = this;

    stagingService.dump_to_tape(function (err) {
      if(err) {
        throw err;
      }

      self.redirect('/foo');
    });
  }

};

exports.FooManager = FooManager;
