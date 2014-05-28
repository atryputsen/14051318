/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Part = mongoose.model('Part'),
    utils = require('../../lib/utils'),
    extend = require('util')._extend;

/**
 * Load
 */

exports.load = function(req, res, next, partId) {
    var User = mongoose.model('User');

    Part.load(partId, function (err, part) {
        if (err) return next(err);
        if (!part) return next(new Error('Не найдено'));
        req.part = part;
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

    Part.list(options, function(err, parts) {
        if (err) return res.render('500');
        Part.count().exec(function (err, count) {
            res.render('parts/index', {
                title: 'Часть',
                parts: parts,
                page: page + 1,
                pages: Math.ceil(count / perPage)
            })
        })
    })
};

/**
 * New part
 */

exports.new = function(req, res){
    res.render('parts/new', {
        title: 'Новый материал',
        part: new Part({})
    })
};

/**
 * Create an part
 */

exports.create = function (req, res) {
    var part = new Part(req.body);
    part.user = req.user;

    part.save(function (err) {
        if (!err) {
            req.flash('success', 'Материал опубликован!');
            return res.redirect('/parts/'+part._id)
        }

        res.render('parts/new', {
            title: 'Новый материал',
            part: part,
            error: utils.errors(err.errors || err)
        })
    })
};

/**
 * Edit an part
 */

exports.edit = function (req, res) {
    res.render('parts/edit', {
        title: 'Редактирование ' + req.part.title,
        part: req.part
    })
};

/**
 * Update part
 */

exports.update = function(req, res){
    var part = req.part;
    part = extend(part, req.body);

    part.save(req.files.image, function(err) {
        if (!err) {
            return res.redirect('/parts/' + part._id)
        }

        res.render('parts/edit', {
            title: 'Редактирование материала',
            part: part,
            error: utils.errors(err.errors || err)
        })
    })
};

/**
 * Show
 */

exports.show = function(req, res){
    res.render('parts/show', {
        title: req.part.title,
        part: req.part
    })
};

/**
 * Delete an part
 */

exports.destroy = function(req, res){
    var part = req.part;
    part.remove(function(err){
        req.flash('info', 'Материал удален');
        res.redirect('/parts')
    })
};
