/* eslint-disable no-extend-native */
Array.prototype.flatten = function () {
  return [].concat.apply([], this);
}

Array.prototype.last = function () {
  return this[this.length - 1];
}