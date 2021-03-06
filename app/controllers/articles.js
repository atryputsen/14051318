/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Article = mongoose.model('Article'),
    utils = require('../../lib/utils'),
    extend = require('util')._extend;

/**
 * Load
 */

exports.load = function(req, res, next, arcId) {
  var User = mongoose.model('User');

  Article.load(arcId, function (err, article) {
    if (err) return next(err);
    if (!article) return next(new Error('Не найдено'));
    req.article = article;
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

  Article.list(options, function(err, articles) {
    if (err) return res.render('500');
    Article.count().exec(function (err, count) {
      res.render('articles/index', {
        title: 'Материалы',
        articles: articles,
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
  res.render('articles/new', {
    title: 'Новый материал',
    article: new Article({})
  })
};

/**
 * Create an article
 */

exports.create = function (req, res) {
  var article = new Article(req.body);
  article.user = req.user;

  article.save(function (err) {
    if (!err) {
      req.flash('success', 'Материал опубликован!');
      return res.redirect('/articles/'+article._id)
    }

    res.render('articles/new', {
      title: 'Новый материал',
      article: article,
      error: utils.errors(err.errors || err)
    })
  })
};

/**
 * Edit an article
 */

exports.edit = function (req, res) {
  res.render('articles/edit', {
    title: 'Редактирование ' + req.article.title,
    article: req.article
  })
};

/**
 * Update article
 */

exports.update = function(req, res){
  var article = req.article;
  article = extend(article, req.body);

  article.save(function(err) {
    if (!err) {
      return res.redirect('/articles/' + article._id)
    }

    res.render('articles/edit', {
      title: 'Редактирование материала',
      article: article,
      error: utils.errors(err.errors || err)
    })
  })
};

/**
 * Show
 */

exports.show = function(req, res){
  res.render('articles/show', {
    title: req.article.title,
    article: req.article
  })
};

/**
 * Delete an article
 */

exports.destroy = function(req, res){
  var article = req.article;
  article.remove(function(err){
    req.flash('info', 'Материал удален');
    res.redirect('/articles')
  })
};
