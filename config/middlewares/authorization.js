
/*
 *  Generic require login routing middleware
 */

exports.requiresLogin = function (req, res, next) {
  if (req.isAuthenticated()) return next();
  if (req.method == 'GET') req.session.returnTo = req.originalUrl;
  res.redirect('/login')
};

/*
 *  User authorization routing middleware
 */

exports.user = {
  hasAuthorization: function (req, res, next) {
    if (req.profile.id != req.user.id) {
      req.flash('info', 'Вы не авторизированны в системе!');
      return res.redirect('/users/' + req.profile.id)
    }
    next()
  }
};

/*
 *  Article authorization routing middleware
 */

exports.article = {
  hasAuthorization: function (req, res, next) {
    if (req.article.user.id != req.user.id) {
      req.flash('info', 'Вы не авторизированны в системе!');
      return res.redirect('/articles/' + req.article.id)
    }
    next()
  }
};
