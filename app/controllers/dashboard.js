/**
 * Module dependencies.
 */

var mongoose = require('mongoose');

exports.index = function(req, res) {
    res.render('dashboard/index', {
        title: 'Dashboard'
    });
};