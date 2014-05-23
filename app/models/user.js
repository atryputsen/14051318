/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

/**
 * User Schema
 */

var UserSchema = new Schema({
  firstname: {
      type: String,
      default: ''
  },
  lastname: {
      type: String,
      default: ''
  },
  email: {
      type: String,
      default: ''
  },
  avatar: {
    type: String,
    default: ''
  },
  group: {
      type: String,
      default: ''
  },
  role: {
      type: String,
      default: 'Student'
  },
  provider: {
      type: String,
      default: ''
  },
  hashed_password: {
      type: String,
      default: ''
  },
  salt: {
      type: String,
      default: ''
  },
  authToken: {
      type: String,
      default: ''
  }
});

/**
 * Virtuals
 */

UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function() { return this._password });

/**
 * Validations
 */

var validatePresenceOf = function (value) {
  return value && value.length
};

UserSchema.path('firstname').validate(function (firstname) {
  return firstname.length
}, 'Имя не было введено');

UserSchema.path('lastname').validate(function (lastname) {
    return lastname.length
}, 'Фамилия не была введена' );

UserSchema.path('group').validate(function (group) {
    return group.length
}, 'Номер группы не был введен' );

UserSchema.path('email').validate(function (email) {
  return email.length
}, 'Email не был введен');

UserSchema.path('email').validate(function (email, fn) {
  var User = mongoose.model('User');

  if (this.isNew || this.isModified('email')) {
    User.find({ email: email }).exec(function (err, users) {
      fn(!err && users.length === 0)
    })
  } else fn(true)
}, 'Введенны Email уже зарегистрированн в системе');

UserSchema.path('hashed_password').validate(function (hashed_password) {
  return hashed_password.length
}, 'Вы не ввели пароль');

/**
 * Pre-save hook
 */

UserSchema.pre('save', function(next) {
  if (!this.isNew) return next();

  if (!validatePresenceOf(this.password)
    && !this.doesNotRequireValidation())
    next(new Error('Неверный пароль'));
  else
    next()
});

/**
 * Methods
 */

UserSchema.methods = {

  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */

  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */

  makeSalt: function () {
    return Math.round((new Date().valueOf() * Math.random())) + ''
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */

  encryptPassword: function (password) {
    if (!password) return '';
    var encrypred;
    try {
      encrypred = crypto.createHmac('sha1', this.salt).update(password).digest('hex');
      return encrypred
    } catch (err) {
      return ''
    }
  }
};

mongoose.model('User', UserSchema);