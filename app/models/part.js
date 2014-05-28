/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
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
 * Part Schema
 */
var PartSchema = new Schema({
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
PartSchema.path('title').required(true, 'Название статьи не может быть пустым');
PartSchema.path('description').required(true, 'Описание cтатьи не может быть пустым');
PartSchema.path('body').required(true, 'Материал не может быть пустым');

/**
 * Statics
 */
PartSchema.statics = {
    /**
     * Find part by id
     * @param partId
     * @param cb
     */
    load: function (partId, cb) {
        this.findOne({ _id : partId })
            .populate('user', 'name email username')
            .populate('comments.user')
            .exec(cb)
    },

    /**
     * List Part
     * @param options
     * @param cb
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

mongoose.model('Part', PartSchema);