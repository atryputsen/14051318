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
    parts       = require('../app/controllers/parts'),
    tags        = require('../app/controllers/tags'),
    dashboard   = require('../app/controllers/dashboard');

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
    app.get('/',                    dashboard.index);
    app.get('/dashboard',           dashboard.index);

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
    app.get('/sections',            sections.read);
    app.get('/sections/new',        sections.new);
    app.post('/sections',           sections.create);
    app.get('/sections/:secId',     sections.show);
    app.get('/sections/:secId/edit',sections.edit);
    app.put('/sections/:secId',     sections.update);
    app.del('/sections/:secId',     sections.destroy);

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
     * Parts Route
     */
    app.param('partId',             parts.load);
    app.get('/parts',               parts.read);
    app.get('/parts/new',           parts.new);
    app.post('/parts',              parts.create);
    app.get('/parts/:partId',       parts.show);
    app.get('/parts/:partId/edit',  parts.edit);
    app.put('/parts/:partId',       parts.update);
    app.del('/parts/:partId',       parts.destroy);

    /**
     * Tags Route
     */
    app.get('/tags/:tag', tags.index);
};
