/**
 * Module dependencies.
 */
var async = require('async');

/**
 * Controllers
 */
var users       = require('../app/controllers/users'),
    auth        = require('./middlewares/authorization'),
    sections    = require('../app/controllers/section'),
    articles    = require('../app/controllers/articles'),
    tags        = require('../app/controllers/tags');

/**
 * Route middlewares
 */
var articleAuth = [auth.requiresLogin, auth.article.hasAuthorization];

/**
 * Expose routes
 * @param app
 * @param passport
 */
module.exports = function (app, passport) {
    /**
     * Users Route
     */
    app.param('userId',             users.user);
    app.get('/login',               users.login);
    app.get('/signup',              users.signup);
    app.get('/logout',              users.logout);
    app.post('/users',              users.create);
    app.post('/users/session',
        passport.authenticate('local', {
            failureRedirect: '/login',
            failureFlash: 'Введен неверный Email или Пароль.'
        }), users.session);
    app.get('/users/:userId',       users.show);


    /**
     * Sections Route
     */
    app.param('secId',              sections.load);
    app.get('/',                    sections.read);
    app.get('/sections',            sections.read);
    app.get('/sections/new',        sections.new);
    app.post('/sections',           sections.create);
    app.get('/:secId/edit',         sections.edit);
    app.put('/:secId',              sections.update);
    app.del('/:secId',              sections.destroy);

    /**
     * Articles Route
     */
    app.param('arcId',              articles.load);
    app.get('/articles',            articles.read);
    app.get('/articles/new',        articles.new);
    app.post('/articles',           articles.create);
    app.get('/articles/:arcId',     articles.show);
    app.get('/articles/:arcId/edit',articles.edit);
    app.put('/articles/:arcId',     articles.update);
    app.del('/articles/:arcId',     articles.destroy);

    /**
     * Tags Route
     */
    app.get('/tags/:tag', tags.index);
};
