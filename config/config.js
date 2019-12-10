/**
 * Express Config Logic
 * @author Anthony Loukinas <anthony.loukinas@redhat.com>
 */

/**
 * Module dependencies
 */
const _ = require('lodash'),
    gruntFile = require('grunt').file;

/**
 * Load app configurations
 */
var exports = _.extend(
    require('./env/all'),
    //require('./env/' + process.env.NODE_ENV) || {}
);

module.exports = exports;

/**
 * Get files by glob patterns
 */
module.exports.getGlobbedFiles = function(globPatterns, removeRoot, addRoot) {

    let files = gruntFile.expand(globPatterns);
    if (removeRoot) {
        files = files.map(function(file) {
            if(addRoot) return file.replace(removeRoot, addRoot);
            return file.replace(removeRoot, '');
        });
    }

    return files;
};