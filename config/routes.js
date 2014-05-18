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
    dashboard = require('../app/controllers/dashboard');

/**
 * Route middlewares
 */

var articleAuth = [auth.requiresLogin, auth.article.hasAuthorization];

/**
 * Expose routes
 */

module.exports = function (app, passport) {
    // home route
    app.get('/', dashboard.index);
    app.get('/dashboard', dashboard.index);

    // user routes
    app.get('/login', users.login);
    app.get('/signup', users.signup);
    app.get('/logout', users.logout);
    app.post('/users', users.create);
    app.post('/users/session',
        passport.authenticate('local', {
            failureRedirect: '/login',
            failureFlash: 'Invalid email or password.'
        }), users.session);
    app.get('/users/:userId', users.show);

    app.param('userId', users.user);

    // article routes
    app.param('id', articles.load);

    app.get('/articles', articles.index);
    app.get('/articles/new', auth.requiresLogin, articles.new);
    app.post('/articles', auth.requiresLogin, articles.create);
    app.get('/articles/:id', articles.show);
    app.get('/articles/:id/edit', articleAuth, articles.edit);
    app.put('/articles/:id', articleAuth, articles.update);
    app.del('/articles/:id', articleAuth, articles.destroy);

    // tag routes
    var tags = require('../app/controllers/tags');
    app.get('/tags/:tag', tags.index)

};
