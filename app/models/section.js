/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 *  Section Schema
 */
var SectionSchema = new Schema({
    title: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    icon: {
        type: String,
        default: ''
    },
    createdAt  : {
        type : Date,
        default : Date.now
    }
});

/**
 *  Validation
 */
SectionSchema.path('title').required(true, 'Раздел должен иметь заголовок');
SectionSchema.path('description').required(true, 'Раздел должен иметь описание');

/**
 *  Static
 */
SectionSchema.statics = {
    load: function (secId, cb) {
        this.findOne({ _id : secId })
            .populate('user', 'name email username')
            .populate('comments.user')
            .exec(cb)
    },
    /**
     * List articles
     * @param options
     * @param cb
     */

    list: function (options, cb) {
        var criteria = options.criteria || {};

        this.find(criteria)
            .populate('user', 'name username')
            .sort({'createdAt': 1})
            .limit(options.perPage)
            .skip(options.perPage * options.page)
            .exec(cb)
    }
};

mongoose.model('Section', SectionSchema);