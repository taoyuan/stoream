"use strict";

var util = require('util');
var events = require('events');
var utils = require('../utils');

exports.init = function (stoream, options) {
    var adapter = new Memory(options);
    adapter.on('save', stoream.emit.bind(stoream, 'save'));
    stoream.adapter = adapter;
};

function Memory(options) {

    events.EventEmitter.call(this);

    if (typeof options.name === 'string') {
        this.name = utils.remember(options.name)
    } else {
        this.name = options.name || Date.now;
    }
    this.transform = options.transform || utils.identity;
    this.scope = options.scope;

    this.store = {};
}

util.inherits(Memory, events.EventEmitter);

Memory.prototype.save = function (data) {
    var name = this.name.call(this.scope, data);
    this.store[name] = this.transform.call(this.scope, data);
    this.emit('save', name, data);
};

Memory.prototype.get = function (name, cb) {
    if (typeof cb === 'function') {
        var self = this;
        process.nextTick(function () {
            cb(null, self.store[name]);
        })
    } else {
        return this.store[name];
    }
};