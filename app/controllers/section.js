/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Section = mongoose.model('Section'),
    utils = require('../../lib/utils'),
    extend = require('util')._extend;

/**
 * Load a Section
 */
exports.load = function(req, res, next, secId) {

    Section.load(secId, function (err, section) {
        if (err) return next(err);
        if (!section) return next(new Error('Не найдено'));
        req.section = section;
        next();
    })
};

/**
 * Read
 */
exports.read = function(req, res) {
    var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
    var perPage = 30;
    var options = {
        perPage: perPage,
        page: page
    };

    Section.list(options, function(err, sections) {
        if (err) return res.render('500');
        Section.count().exec(function (err, count) {
            res.render('sections/index', {
                title: 'Разделы',
                sections: sections,
                page: page + 1,
                pages: Math.ceil(count / perPage)
            })
        })
    })
};

/**
 * New a Section
 */
exports.new = function(req, res) {
    res.render('sections/new', {
        title: 'Новый раздел',
        section: new Section({})
    })
};

/**
 * Create a Section
 */
exports.create = function(req, res) {
    var section = new Section(req.body);

    section.save(function(err) {
        if (!err) {
            req.flash('success', 'Раздел создан!');
            return res.redirect('/sections/' + section._id);
        }

        res.render('sections/create', {
            title: 'Новый раздел',
            section: section,
            error: utils.errors(err.errors || err)
        })
    })
};

/**
 * Edit a Section
 */
exports.edit = function(req, res) {
    res.render('sections/edit', {
        title: 'Редактирование ' + req.section.title,
        section: req.section
    })
};

/**
 * Update a Section
 */
exports.update = function(req, res) {
    var section = req.section;
    section = extend(section, req.body);

    section.save(function(req, res) {
        if (!err) {
            return res.redirect('/sections/' + section._id)
        }

        res.render('sections/edit', {
            title: 'Редактирование раздела',
            section: section,
            error: utils.errors(err.errors || err)
        })
    })
};

/**
 * Show a Section
 */
exports.show = function(req, res) {
    res.render('sections/show', {
        title: req.section.title,
        section: req.section
    })
};

/**
 * Delete a Section
 */
exports.destroy = function(req, res) {
    var section = req.section;
    section.remove(function(err) {
        req.flash('info', 'Раздел был удален!');
        res.redirect('/sections')
    })
};