/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Section = mongoose.model('Section'),
    utils = require('../../lib/utils'),
    extend = require('util')._extend;

/**
 * Load
 */

exports.load = function(req, res, next, secId) {
    var User = mongoose.model('User');

    Section.load(secId, function (err, section) {
        if (err) return next(err);
        if (!section) return next(new Error('Не найдено'));
        req.section = section;
        next()
    })
};

/**
 * List
 */

exports.read = function(req, res){
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
                title: 'Материалы',
                sections: sections,
                page: page + 1,
                pages: Math.ceil(count / perPage)
            })
        })
    })
};

/**
 * New article
 */

exports.new = function(req, res){
    res.render('sections/new', {
        title: 'Новый материал',
        section: new Section({})
    })
};

/**
 * Create an article
 */

exports.create = function (req, res) {
    var section = new Section(req.body);
    section.user = req.user;

    section.save(function (err) {
        if (!err) {
            req.flash('success', 'Материал опубликован!');
            return res.redirect('/')
        }

        res.render('articles/new', {
            title: 'Новый материал',
            section: section,
            error: utils.errors(err.errors || err)
        })
    })
};

/**
 * Edit an article
 */

exports.edit = function (req, res) {
    res.render('sections/edit', {
        title: 'Редактирование ' + req.section.title,
        section: req.section
    })
};

/**
 * Update article
 */

exports.update = function(req, res){
    var section = req.section;
    section = extend(section, req.body);

    section.save(function(err) {
        if (!err) {
            return res.redirect('/')
        }

        res.render('articles/edit', {
            title: 'Редактирование материала',
            section: section,
            error: utils.errors(err.errors || err)
        })
    })
};

/**
 * Show
 */

exports.show = function(req, res){
    res.render('sections/show', {
        title: req.section.title,
        section: req.section
    })
};

/**
 * Delete an article
 */

exports.destroy = function(req, res){
    var section = req.section;
    section.remove(function(err) {
        req.flash('info', 'Материал удален');
        res.redirect('/sections')
    })
};
