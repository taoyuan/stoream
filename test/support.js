"use strict";

var Readable = require('stream').Readable;
var Writable = require('stream').Writable;

exports.readable = function (read) {
    var r = new Readable();
    r._read = function () {
        if (read) {
            read.call(this);
        }
    };
    return r;
};

exports.writable = function (write) {
    var w = new Writable();
    w._write = function (chunk, enc, next) {
        if (write) {
            if (write.length < 3) {
                write.call(this, chunk, enc);
                next();
            } else {
                write.call(this, chunk, enc, next);
            }
        } else {
            next();
        }
    };
    return w;
};