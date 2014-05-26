"use strict";

var stream = require('stream');
var util = require('util');
var path = require('path');
var fs = require('fs');

var existsSync = fs.existsSync || path.existsSync;

module.exports = Stoream;

function Stoream(name, options) {
    if (!(this instanceof Stoream)) {
        return new Stoream(name, options);
    }

    stream.Stream.call(this);
    this.writable = true;

    var adapter;
    if (typeof name === 'object') {
        adapter = name;
        this.name = adapter.name;
    } else if (name.match(/^\//)) {
        // try absolute path
        adapter = require(name);
    } else if (existsSync(__dirname + '/adapters/' + name + '.js')) {
        // try built-in adapter
        adapter = require('./adapters/' + name);
    } else {
        // try foreign adapter
        try {
            adapter = require('jugglingdb-' + name);
        } catch (e) {
            return console.log('\nWARNING: Stoream adapter "' + name + '" is not installed, to fix run:\n\n    npm install stoream-' + name, '\n');
        }
    }

    adapter.init(this, options);

    if (!this.adapter) {
        throw new Error('Adapter "' + name + '" is not defined correctly: it should define `adapter` member of stoream synchronously');
    }
}

util.inherits(Stoream, stream.Stream);

Stoream.prototype.write = function(data) {
    this.adapter.save(data);
};

Stoream.prototype.get = function (name, cb) {
    return this.adapter.get(name, cb);
};

Stoream.prototype.end = function(chunk) {
    this.writable = false;
};

Stoream.prototype.destroy = function() {
    this.writable = false;
};
