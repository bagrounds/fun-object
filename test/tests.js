;(function () {
  'use strict'

  /* imports */
  var predicate = require('fun-predicate')
  var funTest = require('fun-test')
  var arrange = require('fun-arrange')
  var scalar = require('fun-scalar')
  var array = require('fun-array')
  var fn = require('fun-function')
  var string = require('fun-string')

  var get = fn.curry(function (key, object) {
    return object[key]
  })

  var equalityTests = [
    [[{ a: string.append('z') }, { a: 1, b: 2 }], { az: 1, b: 2 }, 'apKeys'],
    [[string.prepend('p'), { a: 1, b: 2 }], { pa: 1, pb: 2 }, 'mapKeys'],
    [[scalar.sum(3), { a: 1, b: 2 }], { a: 4, b: 5 }, 'map'],
    [[predicate.equal('a'), { a: 1, b: 2 }], { a: 1 }, 'filterKeys'],
    [[scalar.lt(3), { a: 1, b: 2, c: 3 }], { a: 1, b: 2 }, 'filter'],
    [['b', 2, { a: 1 }], { a: 1, b: 2 }, 'set'],
    [['a', { a: 1 }], 1, 'get'],
    [[], {}, 'empty'],
    [[[['a', 1], ['b', 2]]], { a: 1, b: 2 }, 'ofPairs'],
    [['a', 1], { a: 1 }, 'of'],
    [[{ a: 'z', b: 'q' }, { a: 1, b: 2 }], { z: 1, q: 2 }, 'reKey'],
    [[{ a: 1, b: 2, c: 3 }], [1, 2, 3], 'values'],
    [[{ a: 1, b: 2, c: 3 }], ['a', 'b', 'c'], 'keys'],
    [[['a', 'c'], { a: 1, b: 2, c: 3 }], { b: 2 }, 'drop'],
    [[['a', 'c'], { a: 1, b: 2, c: 3 }], { a: 1, c: 3 }, 'keep'],
    [[{ a: scalar.sum(3) }, { a: 1, b: 2 }], { a: 4, b: 2 }, 'ap']
  ].map(array.ap([fn.id, predicate.equalDeep, get]))
    .map(arrange({ inputs: 0, predicate: 1, contra: 2 }))

  /* exports */
  module.exports = equalityTests.map(funTest.sync)
})()

