"use strict";

var fs = require("fs");
var path = require("path");
var util = require('util');
var events = require('events');
var utils = require('../utils');

exports.create = function (stoream, options) {
    var adapter = new File(options);
    adapter.on('save', stoream.emit.bind(stoream, 'save'));
    stoream.adapter = adapter;
};

var File = function(options) {
    events.EventEmitter.call(this);

    options = options || {};
    this.path = options.path || "./";
    if (typeof options.filename === 'string') {
        this.filename = utils.remember(options.filename);
    } else {
        this.filename = options.filename || Date.now;
    }
    this.transform = options.transform || utils.identity;
    this.ext = options.ext || "";
    this.sync = options.sync;
    this.scope = options.scope;

    if (!fs.existsSync(this.path)) fs.mkdirSync(this.path);
};

util.inherits(File, events.EventEmitter);

File.prototype.save = function(data) {
    var file = path.join(this.path, this.filename.call(this.scope, data) + this.ext);
    var write = this.transform.call(this.scope, data);
    if (this.sync) {
        fs.writeFileSync(file, write);
    } else {
        fs.writeFile(file, write, function(err) { if (err) throw new Error(err); });
    }
};

File.prototype.get = function(name, cb) {
    if (typeof cb === 'function') {
        fs.readFile(name, cb);
    } else {
        return fs.readFileSync(name);
    }
};
