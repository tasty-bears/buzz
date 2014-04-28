var mediaService = require('../services/mediaservice');
var fooRepo = require('../repositories/foorepo');
var fooService = require('../services/fooservice');
var simplexService = require('../services/simplexservice');
var async = require('async');

var StagingService = function() {
    // service for prioritizing and staging media on FooCDN

    this.prioritize_media = function(callback) {
        this.get_media_priorities(function(err, mediaPriorities) {
            mediaPriorities.sort(function(a, b) {
                return a.priority - b.priority;
            })

            // we want highest priority first
            mediaPriorities.reverse();

            var medias = mediaPriorities.map(
                function(mediaPriority) { return mediaPriority.media; }
            );
            callback(err, medias);
        })
    }

    this.get_media_priorities = function(callback) {
        var mediaPriorities = []

        this.get_medias_with_priority_details(function(err, mediaDetails) {
            if(err) {
                callback(err, null);
            }
            else {
                var now = new Date();

                for(var i in mediaDetails) {
                    var mediaDetail = mediaDetails[i];

                    var timeDifference = Math.abs(mediaDetail.date - now) / 1000 / 60; // in minutes
                    var priority = mediaDetail.numUsers / timeDifference;

                    var mediaPriority = {
                        media: mediaDetail.media,
                        priority: priority
                    }

                    // if the same blobId is used twice (should only happen
                    //in dev), then sum the priorities
                    var index = priority_index.call(mediaPriorities, mediaPriority)
                    if(index == -1) {
                        mediaPriorities.push(mediaPriority);
                    }
                    else {
                        mediaPriorities[index].priority += mediaPriority.priority
                    }

                }

                callback(null, mediaPriorities);
            }
        });

        //------------------

        function priority_index(mediaPriority) {
            // bind this to an array of mediaPriorities
            var i = this.length;

            while (i--) {
               if (this[i].media.blobId == mediaPriority.media.blobId) {
                   return i;
               }
            }
            return -1;
        }

    }

    this.get_medias_with_priority_details = function(callback) {
        // gross
        //TODO: fix once post-media association works

        function postIter(post, iterCallback) {
            post.getEvent(function(err, event) {
                if(err) iterCallback(err, null);

                event.getSchedule(function(err, schedule) {
                    if(err) iterCallback(err, null);

                    schedule.getCourse(function(err, course) {
                        if(err) iterCallback(err, null);

                        course.getUsers(function(err, users) {
                            if(err) iterCallback(err, null);

                            iterCallback(
                                null,
                                {
                                    media: post.media,
                                    date: event.date,
                                    //time: event.time,
                                    numUsers: users.length
                                }
                            );

                        });

                    });
                });
            });
        }

        geddy.model.Post.all(function(err, posts) {
            async.map(posts, postIter, function(err, results) {
                callback(err, results);
            });
        });
    }

    this.stage_all = function(optimal, callback) {
        // callback = function(err)
        var self = this;

        self.prioritize_media(function(err, medias) {
            self.dump_to_tape(callback);
        })
    };

    this.dump_to_tape = function(callback) {
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
    }

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

    this.solve_simplex = function(callback) {
        var self = this;

        function _mediaSize(callback) {
          fooService.get_total_media_size(callback);
        }

        function _numUsers(callback) {
          geddy.model.User.all(function(err, users) {
            callback(err, users.length);
          });
        }

        function _solve(mediaSize, numUsers, callback) {
          var results = simplexService.solve_model(mediaSize, numUsers);
          var err = null


          if (results == null) {
            err = 'Something went wrong!'
          }
          else if (results.feasible == false) {
            err = "Infeasible results."
          }

          callback(err, results);
        }

        async.series([_mediaSize, _numUsers], function(err, results) {
          _solve(results[0], results[1], callback)
        })

      }


};

module.exports = new StagingService();
