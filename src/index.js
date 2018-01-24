/**
 *
 * @module fun-object
 */
;(() => {
  'use strict'

  /* imports */
  const curry = require('fun-curry')
  const { inputs } = require('guarded')
  const { any, tuple, arrayOf, objectOf, fun, string, object, record } =
    require('fun-type')

  const id = x => x
  const k = x => () => x

  /**
   *
   * @function module:fun-object.zipWith
   *
   * @param {Function} f - to apply to each pair of elements from o1 and o2
   * @param {Object} o1 - first arguments to f
   * @param {Object} o2 - second arguments to f
   *
   * @return {Object} {k1: f(o1[k1], o2[k1]), k2: f(o1[k2], o2[k2]), ...}
   */
  const zipWith = (f, o1, o2) =>
    keys(o1).reduce((r, k) => set(k, f(get(k, o1), get(k, o2)), r), {})

  /**
   *
   * @function module:fun-object.transition
   *
   * @param {Object} options - for transitioning
   * @param {Array<String>} options.inputs - keys from source to use as inputs
   * @param {Function} options.f - function to accept inputs
   * @param {String} options.output - what key to set the result of f to
   * @param {Object} o - source object to get inputs from and put output in
   *
   * @return {Object} source object with output key set to result of f({inputs})
   */
  const transition = ({ output, f, inputs }, o) =>
    set(output, f(keep(inputs, o)), o)

  /**
   *
   * @function module:fun-object.drop
   *
   * @param {Array<String>} keys - to drop
   * @param {Object} o - object to drop keys from
   *
   * @return {Object} without keys specified
   */
  const drop = (keys, o) => filterKeys(k => keys.indexOf(k) === -1, o)

  /**
   *
   * @function module:fun-object.keep
   *
   * @param {Array<String>} keys - to keep
   * @param {Object} o - object to keep keys from
   *
   * @return {Object} containing only keys specified
   */
  const keep = (keys, o) => filterKeys(k => keys.indexOf(k) !== -1, o)

  /**
   *
   * @function module:fun-object.reKey
   *
   * @param {Object} keyMap - object of { oldKey: newKey, ... }
   * @param {Object} o - object to reKey
   *
   * @return {Object} with values at new keys
   */
  const reKey = (keyMap, o) => apKeys(map(k, keyMap), o)

  /**
   *
   * @function module:fun-object.filter
   *
   * @param {Function} p - x -> bool
   * @param {Object} o - object to get values from
   *
   * @return {Object} of values that passed predicate
   */
  const filter = (p, o) =>
    keys(o).reduce((r, k) => p(get(k, o)) ? set(k, get(k, o), r) : r, {})

  /**
   *
   * @function module:fun-object.filterKeys
   *
   * @param {Function} p - x -> bool
   * @param {Object} o - object to get values from
   *
   * @return {Object} of values whos keys passed predicate
   */
  const filterKeys = (p, o) =>
    keys(o).reduce((r, k) => p(k) ? set(k, get(k, o), r) : r, {})

  /**
   *
   * @function module:fun-object.apKeys
   *
   * @param {Object} fs - functions to apply
   * @param {Object} o - object to get values from
   *
   * @return {Object} of newly keyed values
   */
  const apKeys = (fs, o) => [...keys(fs), ...keys(o)]
    .reduce((r, k) => set((get(k, fs) || id)(k), get(k, o), r), {})

  /**
   *
   * @function module:fun-object.ap
   *
   * @param {Object} fs - functions to apply
   * @param {Object} o - object to get value from
   *
   * @return {*} value at key
   */
  const ap = (fs, o) => [...keys(fs), ...keys(o)]
    .reduce((r, k) => set(k, (get(k, fs) || id)(get(k, o)), r), {})

  /**
   *
   * @function module:fun-object.map
   *
   * @param {Function} f - x -> y
   * @param {Object} o - object to get value from
   *
   * @return {*} value at key
   */
  const map = (f, o) => keys(o).reduce((r, k) => set(k, f(get(k, o)), r), {})

  /**
   *
   * @function module:fun-object.mapKeys
   *
   * @param {Function} f - String -> String
   * @param {Object} o - object to get value from
   *
   * @return {*} value at key
   */
  const mapKeys = (f, o) =>
    keys(o).reduce((r, k) => set(f(k), get(k, o), r), {})

  /**
   *
   * @function module:fun-object.get
   *
   * @param {String} key - indexing value
   * @param {Object} o - object to get value from
   *
   * @return {*} value at key
   */
  const get = (key, o) => o[key]

  /**
   *
   * @function module:fun-object.set
   *
   * @param {String} key - indexing value
   * @param {*} value - to set
   * @param {Object} o - object to set value on
   *
   * @return {Object} copy of source object containing value at key
   */
  const set = (key, value, o) => [...keys(o), key]
    .reduce((r, k) => {
      r[k] = (k === key ? value : get(k, o))

      return r
    }, {})

  /**
   *
   * @function module:fun-object.update
   *
   * @param {String} key - indexing value
   * @param {Function} f - a -> b
   * @param {Object} o - object to set value on
   *
   * @return {Object} copy of source object with source[key] = f(source[key])
   */
  const update = (key, f, o) => set(key, f(get(key, o)), o)

  /**
   *
   * @function module:fun-object.defaults
   *
   * @param {Object} o1 - first object
   * @param {Object} o2 - second object
   *
   * @return {Object} a new object with all keys from o1 and o2, prefering o2
   */
  const defaults = (o1, o2) => concat((a, b) => b !== undefined ? b : a, o1, o2)

  /**
   *
   * @function module:fun-object.merge
   *
   * @param {Object} o1 - first object
   * @param {Object} o2 - second object
   *
   * @return {Object} a new object with all keys from o1 and o2, prefering o1
   */
  const merge = (o1, o2) => defaults(o2, o1)

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
  const concat = (valueConcat, o1, o2) => [...keys(o1), ...keys(o2)]
    .reduce((r, k) => set(k, valueConcat(get(k, o1), get(k, o2)), r), {})

  /**
   *
   * @function module:fun-object.empty
   *
   * @return {Object} {}
   */
  const empty = () => ({})

  /**
   *
   * @function module:fun-object.ofPairs
   *
   * @param {Array<Array>} pairs - [[k1, v1], [k2, v2], ...]
   *
   * @return {Object} { k1: v1, k2: v2, ... }
   */
  const ofPairs = pairs => pairs.reduce((r, [k, v]) => set(k, v, r), {})

  /**
   *
   * @function module:fun-object.ofPairs
   *
   * @param {Object} o - source object to get key value pairs from
   *
   * @return {Array<Array>} [[k1, v1], [k2, v2], ... ]
   */
  const toPairs = o => keys(o).map(k => [k, get(k, o)])

  /**
   *
   * @function module:fun-object.of
   *
   * @param {String} key - to put value at
   * @param {*} value - to put at key
   *
   * @return {Object} { key: value }
   */
  const of = (key, value) => ({ [key]: value })

  /**
   *
   * @function module:fun-object.values
   *
   * @param {Object} o - object to get values from
   *
   * @return {Array} of enumerable values
   */
  const values = o => keys(o).map(k => get(k, o))

  /**
   *
   * @function module:fun-object.keys
   *
   * @param {Object} o - object to get keys from
   *
   * @return {Array} of enumerable keys
   */
  const keys = Object.keys

  const api = { keep, drop, keys, values, reKey, of, ofPairs, empty, concat,
    defaults, merge, map, mapKeys, ap, apKeys, get, set, update, filterKeys,
    filter, transition, zipWith, toPairs }

  const guards = map(inputs, {
    keep: tuple([arrayOf(string), object]),
    drop: tuple([arrayOf(string), object]),
    keys: tuple([object]),
    values: tuple([object]),
    reKey: tuple([objectOf(string), object]),
    of: tuple([string, any]),
    ofPairs: tuple([arrayOf(tuple([string, any]))]),
    concat: tuple([fun, object, object]),
    defaults: tuple([object, object]),
    merge: tuple([object, object]),
    map: tuple([fun, object]),
    mapKeys: tuple([fun, object]),
    ap: tuple([objectOf(fun), object]),
    apKeys: tuple([objectOf(fun), object]),
    get: tuple([string, object]),
    set: tuple([string, any, object]),
    update: tuple([string, fun, object]),
    filterKeys: tuple([fun, object]),
    filter: tuple([fun, object]),
    transition: tuple([
      record({ inputs: arrayOf(string), f: fun, output: string }),
      object
    ]),
    zipWith: tuple([fun, object, object]),
    toPairs: tuple([object])
  })

  /* exports */
  module.exports = map(curry, ap(guards, api))
})()

