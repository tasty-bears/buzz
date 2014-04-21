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

    self.flash.error('Lol didn\'t do anything try again.');
    self.redirect('/foo');
  }

};

exports.FooManager = FooManager;
