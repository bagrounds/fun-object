/**
 *
 * @module fun-object
 */
;(function () {
  'use strict'

  /* imports */
  var curry = require('fun-curry')

  /* exports */
  module.exports = {
    keys: keys,
    values: values,
    reKey: curry(reKey),
    of: curry(of),
    empty: empty,
    concat: curry(concat),
    map: curry(map),
    mapKeys: curry(mapKeys),
    ap: curry(ap),
    apKeys: curry(apKeys),
    get: curry(get),
    set: curry(set),
    filterKeys: curry(filterKeys),
    filter: curry(filter)
  }

  /**
   *
   * @function module:fun-object.reKey
   *
   * @param {Object} keyMap - object of { oldKey: newKey, ... }
   * @param {Object} source - to reKey
   *
   * @return {Object} with values at new keys
   */
  function reKey (keyMap, source) {
    return apKeys(map(K, keyMap), source)
  }

  /**
   *
   * @function module:fun-object.filter
   *
   * @param {Function} predicate - to determine value membership
   * @param {Object} source - to get values from
   *
   * @return {Object} of values that passed predicate
   */
  function filter (predicate, source) {
    return Object.keys(source).reduce(function (result, key) {
      if (predicate(source[key])) {
        result[key] = source[key]
      }

      return result
    }, {})
  }

  /**
   *
   * @function module:fun-object.filterKeys
   *
   * @param {Function} predicate - to determine key membership
   * @param {Object} source - to get values from
   *
   * @return {Object} of values whos keys passed predicate
   */
  function filterKeys (predicate, source) {
    return Object.keys(source).reduce(function (result, key) {
      if (predicate(key)) {
        result[key] = source[key]
      }

      return result
    }, {})
  }

  /**
   *
   * @function module:fun-object.apKeys
   *
   * @param {Object} functions - to apply
   * @param {Object} source - to get values from
   *
   * @return {Object} of newly keyd values
   */
  function apKeys (functions, source) {
    return Object.keys(functions)
      .concat(Object.keys(source))
      .reduce(function (result, key) {
        result[(functions[key] || id)(key)] = source[key]

        return result
      }, {})
  }

  /**
   *
   * @function module:fun-object.ap
   *
   * @param {Object} functions - to apply
   * @param {Object} source - to get value from
   *
   * @return {*} value at key
   */
  function ap (functions, source) {
    return Object.keys(functions)
      .concat(Object.keys(source))
      .reduce(function (result, key) {
        result[key] = (functions[key] || id)(source[key])

        return result
      }, {})
  }

  /**
   *
   * @function module:fun-object.mapKeys
   *
   * @param {Function} f - * -> *
   * @param {Object} source - to get value from
   *
   * @return {*} value at key
   */
  function map (f, source) {
    return Object.keys(source).reduce(function (result, key) {
      result[key] = f(source[key])

      return result
    }, {})
  }

  /**
   *
   * @function module:fun-object.mapKeys
   *
   * @param {Function} f - String -> String
   * @param {Object} source - to get value from
   *
   * @return {*} value at key
   */
  function mapKeys (f, source) {
    return Object.keys(source).reduce(function (result, key) {
      result[f(key)] = source[key]

      return result
    }, {})
  }

  /**
   *
   * @function module:fun-object.get
   *
   * @param {String} key - indexing value
   * @param {Object} source - to get value from
   *
   * @return {*} value at key
   */
  function get (key, source) {
    return source[key]
  }

  /**
   *
   * @function module:fun-object.set
   *
   * @param {String} key - indexing value
   * @param {*} value - to set
   * @param {Object} source - to set value on
   *
   * @return {Object} copy of source object containing value at key
   */
  function set (key, value, source) {
    return Object.keys(source)
      .concat([key])
      .reduce(function (result, k) {
        result[k] = k === key ? value : source[k]

        return result
      }, {})
  }

  /**
   *
   * @function module:fun-object.concat
   *
   * @param {Function} valueConcat - (o1[v], o2[v]) -> o[v]
   * @param {Object} o1 - first object
   * @param {Object} o2 - second object
   *
   * @return {Object} result object
   */
  function concat (valueConcat, o1, o2) {
    return Object.keys(o1)
      .concat(Object.keys(o2))
      .reduce(function (result, key) {
        result[key] = valueConcat(o1[key], o2[key])

        return result
      }, {})
  }

  /**
   *
   * @function module:fun-object.empty
   *
   * @return {Object} {}
   */
  function empty () {
    return {}
  }

  /**
   *
   * @function module:fun-object.of
   *
   * @param {String} key - to put value at
   * @param {*} value - to put at key
   *
   * @return {Object} { key: value }
   */
  function of (key, value) {
    var result = {}
    result[key] = value

    return result
  }

  /**
   *
   * @function module:fun-object.values
   *
   * @param {Object} object - to get values from
   *
   * @return {Array} of enumerable values
   */
  function values (object) {
    return Object.keys(object).map(function (key) {
      return object[key]
    })
  }

  /**
   *
   * @function module:fun-object.keys
   *
   * @param {Object} object - to get keys from
   *
   * @return {Array} of enumerable keys
   */
  function keys (object) {
    return Object.keys(object)
  }

  function id (x) {
    return x
  }

  function K (x) {
    return function K () {
      return x
    }
  }
})()

