"use strict";

var Stoream = require('../');
var t = require('chai').assert;
var s = require('./support');
var async = require('async');

describe('stoream', function () {

    describe('#memory', function () {

        it('basic functions', function (done) {
            var stoream = new Stoream('memory', {
                name: 'foo'
            });

            var r = s.readable();
            r.pipe(stoream);

            async.series([
                function (callback) {
                    r.push('1');
                    stoream.get('foo', function (err, data) {
                        t.equal(data.toString(), '1');
                        callback();
                    });
                },

                function (callback) {
                    r.push('2');
                    stoream.get('foo', function (err, data) {
                        t.equal(data.toString(), '2');
                        callback();
                    });
                }

            ], done);

        })
    });

});