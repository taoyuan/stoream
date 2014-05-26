"use strict";

exports.identity = function (value) {
    return value;
};

exports.remember = function (value) {
    return function () {
        return value;
    }
};