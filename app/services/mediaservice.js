var fooRepo = require('../repositories/foorepo');
var async = require('async');

var MediaService = function() {
    
	this.create = function(params, action) {
		var self = this
          , media = geddy.model.Media.create(params);

        // save calls isValid, will throw err if false
        media.save(function(err, data) {
            if (err) {
              throw err;
            }
            action(err, media);
        });
	}

    // this.get_all = function(callback) {
    //     geddy.model.Media.all(function (err, medias) {
    //         callback(err, medias);
    //     });
    // }

    this.get_event_datetime = function(media, callback) {
        media.getPost(function (err, post) {
            post.getEvent(function (err, event) {
                callback(err, {date: event.date, time: event.time});
            });
        });
    };

    this.get_num_course_enrollments = function(media, callback) {
        media.getPost(function (err, post) {
            post.getEvent(function (err, event) {
                event.getCourse(function (err, course) {
                    course.getEnrollments(function (err, enrollments) {
                        callback(err, enrollments.length);
                    });
                });
            });
        });
    };
	
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
        dataCallback = function(err, data) {
            console.log("move response:", data);
            callback(err);
        }
        fooRepo.move_content(media.blobId, locationType, dataCallback);
    };

};

// urls
MediaService.prototype.get_content_url = function(media) {
    return fooRepo.get_content_url(media.blobId);
}
MediaService.prototype.set_content_url = function(media) {
    return fooRepo.set_content_url(media.blobId);
}
MediaService.prototype.move_content_url = function(media) {
    return fooRepo.move_content_url(media.blobId);
}
MediaService.prototype.delete_content_url = function(media) {
    return fooRepo.delete_content_url(media.blobId);
}
MediaService.prototype.get_content_info_url = function(media) {
    return fooRepo.get_content_info_url(media.blobId);
}
MediaService.prototype.create_container_url = function(media) {
    return fooRepo.create_container_url();
}

module.exports = new MediaService();
