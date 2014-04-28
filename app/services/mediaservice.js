var fooRepo = require('../repositories/foorepo');
var fooService = require('../services/fooservice');
var async = require('async');

var MediaService = function() {
    
	this.create = function(params, action) {
		var self = this
          , media = geddy.model.Media.create(params);

        // save calls isValid, will throw err if false
        media.save(function(err, data) {
            action(err, media);
        });
	}

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

    this.format_for_display = function(media) {
        // add url attribute to media

        //TODO: should be be cloning the media object before monkey patching
        //      and returning it?
        media.url = this.get_content_url(media);
    }
	
	// --- FooCDN Requests ----

    this.get_mimeType = function(media, callback) {
        fooService.get_mimeType(media.blobId, callback);
    }

    this.check_hostname = function(media) {
        if(media.hostname != fooRepo.hostname) {
            return new Error("Requested media has unknown hostname.");
        }
        return null;
    }

    this.get_content = function(media, callback) {
        // callback: function(err, data)

        var hostNameError = this.check_hostname(media);
        if(hostNameError) {
            callback(hostNameError, null);
        }
        
        fooRepo.get_content(media.blobId, callback);
    }

    this.get_storage_info = function(media, callback) {
        // callback: function(err, data)

        var hostNameError = this.check_hostname(media);
        if(hostNameError) {
            callback(hostNameError, null);
        }

        fooRepo.get_content_info(media.blobId, callback);
    }

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
