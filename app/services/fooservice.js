var fooRepo = require('../repositories/foorepo');
var async = require('async');

var FooService = function() {
    // do useful stuff with FooRepo calls
    
    this.get_mimeType = function(blobId, callback) {
        fooRepo.get_content_info(blobId, function(err, data) {
            if(err) {
                callback(err, data);
            }
            else {
                callback(null, data.MimeType);
            }
        });
    }

    this.get_total_media_size = function(callback) {
        // get the size (in bytes?) of all media items

        //TODO: Filter out duplicate media items based on Blob ID. Might not
        //      have to do this since in prod, each uploaded media item would
        //      have its own FooCDN container

        var self = this;
        var totalSize = 0;

        geddy.model.Media.all(function (err, medias) {
            if (err) {
                callback(err, null);
                return;
            }

            medias = self.distinct(medias);

            var addSizeIterator = function(media, itercallback) {
                self.get_media_size(media, function(err, size) {
                    totalSize += size;
                    itercallback(err);
                })
            }
            async.each(medias, addSizeIterator, function(err) {
                callback(err, totalSize);
            });
        });
    }

    this.get_media_size = function(media, callback) {
        // get the size (in bytes?) of the given media item

        fooRepo.get_content_info(media.blobId, function(err, data) {
            if(err) {
                callback(err, data);
            }
            else {
                callback(null, data.BlobSize);
            }
        })
    }

    this.distinct = function(medias) {
        var flags = [],
            output = [];

        for(var i = 0; i < medias.length; i++) {
            if( flags[ medias[i].blobId ]) continue;
            flags[ medias[i].blobId ] = true;
            output.push( medias[i] );
        }

        return output
    }

};

module.exports = new FooService();
