/**
 * Module dependencies.
 */

var async = require('async');

/**
 * Controllers
 */

var users = require('../app/controllers/users'),
    auth = require('./middlewares/authorization'),
    articles = require('../app/controllers/articles'),
    tags = require('../app/controllers/tags'),
    dashboard = require('../app/controllers/dashboard');

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
    // home route
    app.get('/', dashboard.index);
    app.get('/dashboard', dashboard.index);

    /**
     * User Route
     */
    app.param('userId', users.user);

    app.get('/login', users.login);
    app.get('/signup', users.signup);
    app.get('/logout', users.logout);
    app.post('/users', users.create);
    app.post('/users/session',
        passport.authenticate('local', {
            failureRedirect: '/login',
            failureFlash: 'Введен неверный Email или Пароль.'
        }), users.session);
    app.get('/users/:userId', users.show);

    /**
     * Article Route
     */
    app.param('id', articles.load);

    app.get('/articles', articles.index);
    app.get('/articles/new', auth.requiresLogin, articles.new);
    app.post('/articles', auth.requiresLogin, articles.create);
    app.get('/articles/:id', articles.show);
    app.get('/articles/:id/edit', articleAuth, articles.edit);
    app.put('/articles/:id', articleAuth, articles.update);
    app.del('/articles/:id', articleAuth, articles.destroy);

    /**
     * Tags Route
     */
    app.get('/tags/:tag', tags.index);
};
