/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Imager = require('imager'),
    env = process.env.NODE_ENV || 'development',
    config = require('../../config/config')[env],
    imagerConfig = require(config.root + '/config/imager.js'),
    Schema = mongoose.Schema,
    utils = require('../../lib/utils');

/**
 * Getters
 */

var getTags = function (tags) {
  return tags.join(',')
};

/**
 * Setters
 */

var setTags = function (tags) {
  return tags.split(',')
};

/**
 * Article Schema
 */

var ArticleSchema = new Schema({
  title: {
      type : String,
      default : '',
      trim : true
  },
  body: {
      type : String,
      default : '',
      trim : true
  },
  user: {
      type : Schema.ObjectId,
      ref : 'User'
  },
  tags: {
      type: [],
      get: getTags,
      set: setTags
  },
  image: {
    cdnUri: String,
    files: []
  },
  createdAt  : {
      type : Date,
      default : Date.now
  }
});

/**
 * Validations
 */

ArticleSchema.path('title').required(true, 'Article title cannot be blank');
ArticleSchema.path('body').required(true, 'Article body cannot be blank');

/**
 * Pre-remove hook
 */

ArticleSchema.pre('remove', function (next) {
  var imager = new Imager(imagerConfig, 'S3');
  var files = this.image.files;

  // if there are files associated with the item, remove from the cloud too
  imager.remove(files, function (err) {
    if (err) return next(err)
  }, 'article');

  next()
});

/**
 * Methods
 */

ArticleSchema.methods = {

  /**
   * Save article and upload image
   *
   * @param {Object} images
   * @param {Function} cb
   * @api private
   */

  uploadAndSave: function (images, cb) {
    if (!images || !images.length) return this.save(cb)

    var imager = new Imager(imagerConfig, 'S3');
    var self = this;

    this.validate(function (err) {
      if (err) return cb(err);
      imager.upload(images, function (err, cdnUri, files) {
        if (err) return cb(err);
        if (files.length) {
          self.image = { cdnUri : cdnUri, files : files }
        }
        self.save(cb)
      }, 'article')
    })
  }
};

/**
 * Statics
 */

ArticleSchema.statics = {

  /**
   * Find article by id
   *
   * @param {ObjectId} id
   * @param {Function} cb
   * @api private
   */

  load: function (id, cb) {
    this.findOne({ _id : id })
      .populate('user', 'name email username')
      .populate('comments.user')
      .exec(cb)
  },

  /**
   * List articles
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  list: function (options, cb) {
    var criteria = options.criteria || {};

    this.find(criteria)
      .populate('user', 'name username')
      .sort({'createdAt': -1}) // sort by date
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb)
  }
};

mongoose.model('Article', ArticleSchema);
