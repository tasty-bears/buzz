var simplexService = require('../services/simplexservice');

var FooManager = function () {

  this.index = function (req, resp, params) {
    var self = this

    var opts = {
          format: 'html'
        , template: 'app/views/foomanager/index'
        };
    self.respond(null, opts);
  };

  this.prioritize = function(req, resp, params) {
    var self = this

    var results = simplexService.test();
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
    self.redirect('/foo');
  }

};

exports.FooManager = FooManager;
