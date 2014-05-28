/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    env = process.env.NODE_ENV || 'development',
    config = require('../../config/config')[env],
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
  description: {
      type: String,
      required: true,
      maxLength: 300
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
  createdAt  : {
      type : Date,
      default : Date.now
  }
});

/**
 * Validations
 */
ArticleSchema.path('title').required(true, 'Название статьи не может быть пустым');
ArticleSchema.path('description').required(true, 'Описание cтатьи не может быть пустым');
ArticleSchema.path('body').required(true, 'Материал не может быть пустым');

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
  load: function (arcId, cb) {
    this.findOne({ _id : arcId })
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
      .sort({'createdAt': 1}) // sort by date
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb)
  }
};

mongoose.model('Article', ArticleSchema);
