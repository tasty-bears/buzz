var Media = function () {

  this.defineProperties({
    url: {type: 'string', required: true}
  });

};
Media = geddy.model.register('Media', Media);
