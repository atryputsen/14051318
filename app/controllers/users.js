/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    utils = require('../../lib/utils'),
    extend = require('util')._extend;;

var login = function (req, res) {
  var redirectTo = req.session.returnTo ? req.session.returnTo : '/';
  delete req.session.returnTo;
  res.redirect(redirectTo)
};

exports.signin = function (req, res) {};

/**
 * Auth callback
 */

exports.authCallback = login;

/**
 * Show login form
 */

exports.login = function (req, res) {
  res.render('users/login', {
    title: 'Авторизация',
    message: req.flash('error')
  })
};

/**
 * Show sign up form
 */

exports.signup = function (req, res) {
  res.render('users/signup', {
    title: 'Регистрация',
    user: new User()
  })
};

/**
 * Logout
 */

exports.logout = function (req, res) {
  req.logout();
  res.redirect('/login')
};

/**
 * Session
 */

exports.session = login;

/**
 * Create user
 */

exports.create = function (req, res) {
  var user = new User(req.body);
  user.provider = 'local';
  user.save(function (err) {
    if (err) {
      return res.render('users/signup', {
        error: utils.errors(err.errors),
        user: user,
        title: 'Регистрация'
      })
    }

    // manually login the user once successfully signed up
    req.logIn(user, function(err) {
      if (err) return next(err);
      return res.redirect('/')
    })
  })
};

/**
 *  Show profile
 */

exports.show = function (req, res) {
  var user = req.profile;
  res.render('users/show', {
    title: user.firstname + ' ' + user.lastname,
    user: user
  })
};

/**
 * Find user by id
 */

exports.user = function (req, res, next, id) {
  User
    .findOne({ _id : id })
    .exec(function (err, user) {
      if (err) return next(err);
      if (!user) return next(new Error('Не удалось загрузить пользователя ' + id));
      req.profile = user;
      next()
    })
};

/**
 *  User Settings
 */
exports.edit = function (req, res) {
    res.render('users/edit', {
        title: 'Настройки',
        user: req.user
    })
};

/**
* User Update
*/
exports.update = function(req, res){
    var user = req.user;
    user = extend(user, req.body);
    user.avatar = req.files['input-file-preview'].path.replace(/\\/g, '/').replace('resources', '');
    user.save(function(err) {
        if (!err) {
            return res.redirect('/users/' + user._id)
        }

        res.render('users/edit', {
            title: 'Редактирование материала',
            user: user,
            error: utils.errors(err.errors || err)
        })
    })
};