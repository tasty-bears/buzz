var Solver = require('../../lib/jsLPSolver/src/solver');
var fooRepo = require('../repositories/foorepo');

var MediaService = function() {
    var solver = new Solver();

    // --- FooCDN Requests ----

    this.get_content = function(media, action) {
        // action: callback(err, data)

        if(media.hostname == fooRepo.hostname) {
            fooRepo.get_content(media.blobId, action);
        }
        else {
            action("Requested media has unknown hostname.", null);
        }
    }

};

module.exports = new MediaService();
