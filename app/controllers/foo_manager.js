var simplexService = require('../services/simplexservice');
var mediaService = require('../services/mediaservice');
var stagingService = require('../services/stagingservice');

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

    // simplex
    var results = simplexService.solve_model(4 * Math.pow(1024, 3));
    if (results == null) {
      self.flash.error('Something went wrong!');
    }
    if (results.feasible == false) {
      self.flash.error("Infeasible results.")
    }
    else {
      delete results.feasible;
      self.flash.success(results);
    }

    // priority
    stagingService.prioritize_media(function(err, medias) {
      console.log(JSON.stringify(medias));
    });

    // staging
    stagingService.stage_all(function (err) {
      if(err) {
        throw err;
      }
    })

    self.redirect('/foo');
  }

};

exports.FooManager = FooManager;
