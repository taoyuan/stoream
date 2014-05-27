"use strict";

var stream = require('stream');

exports.readable = function (read) {
    var r = new stream.Readable();
    r._read = function () {
        if (read) {
            read.call(this);
        }
    };
    return r;
};

exports.writable = function (write) {
    var w = new stream.Writable();
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