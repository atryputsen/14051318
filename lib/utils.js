/**
 * Formats mongoose errors into proper array
 * @param errors
 * @returns {*}
 */
exports.errors = function (errors) {
  var keys = Object.keys(errors);
  var errs = [];

  if (!keys) {
    return ['Oops! There was an error']
  }

  keys.forEach(function (key) {
    errs.push(errors[key].message)
  });

  return errs
};

/**
 * Index of object within an array
 * @param arr
 * @param obj
 * @returns {number}
 */
exports.indexof = function (arr, obj) {
    var index = -1;
    var keys = Object.keys(obj);
    var result = arr.filter(function (doc, idx) {
        var matched = 0;

        for (var i = keys.length - 1; i >= 0; i--) {
            if (doc[keys[i]] === obj[keys[i]]) {
                matched++;

                if (matched === keys.length) {
                    index = idx;
                    return idx;
                }
            }
        }
    });
    return index;
};

/**
 * Find object in an array of objects that matches a condition
 * @param arr
 * @param obj
 * @param cb
 * @returns {*}
 */
exports.findByParam = function (arr, obj, cb) {
    var index = exports.indexof(arr, obj);

    if (~index && typeof cb === 'function') {
        return cb(undefined, arr[index])
    } else if (~index && !cb) {
        return arr[index]
    } else if (!~index && typeof cb === 'function') {
        return cb('not found')
    }
};