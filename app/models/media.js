var Media = function () {

  this.defineProperties({
    mimeType: {type: 'string', required: true},
    hostname: {type: 'string', required: true},
    blobId: {type: 'string', required: true}
  });

};
Media = geddy.model.register('Media', Media);
