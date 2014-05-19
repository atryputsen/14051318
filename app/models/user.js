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
  name: {
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

UserSchema.path('name').validate(function (name) {
  return name.length
}, 'Имя не было введено');

UserSchema.path('email').validate(function (email) {
  return email.length
}, 'Email не был введен');

UserSchema.path('email').validate(function (email, fn) {
  var User = mongoose.model('User');

  // Check only when it is a new user or when email field is modified
  if (this.isNew || this.isModified('email')) {
    User.find({ email: email }).exec(function (err, users) {
      fn(!err && users.length === 0)
    })
  } else fn(true)
}, 'Email already exists');

UserSchema.path('group').validate(function (group) {
  return group.length
}, 'Номер группы введен не был');

UserSchema.path('hashed_password').validate(function (hashed_password) {
  return hashed_password.length
}, 'Пароль введен не был');


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