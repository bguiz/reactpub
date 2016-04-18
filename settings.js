'use strict';

let settings = {};

function setValues(info) {
  settings = Object.assign({}, settings, info);
}

function getKey(key) {
  return settings[key];
}

module.exports = {
  set: setValues,
  get: getKey,
};
