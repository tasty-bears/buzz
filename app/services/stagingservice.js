var mediaService = require('../services/mediaservice');
var fooRepo = require('../repositories/foorepo');
var async = require('async');

var StagingService = function() {
    // service for prioritizing and staging media on FooCDN

    this.prioritize_media = function(medias) {
        var get_num_users = function(media) {
            media.getPost(function (err, post) {
              console.log(post);
            });
        }

        for(var index in medias) {
            get_num_users(medias[index]);
        }
    }

    //TODO: do stuff with priorities
    this.stage_all = function(callback) {
        // just moves everything to TAPE for now
        // callback = function(err)
        var self = this;

        geddy.model.Media.all(function (err, medias) {
            if (err) {
                throw err;
            }

            var moveIterator = function(media, callback) {
                self.move_storage(media, "TAPE", callback);
            }
            async.each(medias, moveIterator, callback);
        });
    };

    this.move_storage = function(media, locationType, callback) {

        var hostNameError = mediaService.check_hostname(media);
        if(hostNameError) {
            callback(hostNameError);
        }

        dataCallback = function(err, data) {
            if(!err && (data == null)) {
                err = new Error("Move did not complete correctly.");
            }
            callback(err);
        }

        fooRepo.move_content(media.blobId, locationType, dataCallback);
    };


};

module.exports = new StagingService();
