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
    link: {
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
    /**
     * List section
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

mongoose.model('Section', SectionSchema);