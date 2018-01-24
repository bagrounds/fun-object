;(() => {
  'use strict'

  /* imports */
  const curry = require('fun-curry')
  const arrange = require('fun-arrange')
  const { map, ap } = require('fun-array')
  const { equalDeep } = require('fun-predicate')
  const { sync } = require('fun-test')
  const { sub, add, lt } = require('fun-scalar')
  const { prepend, append } = require('fun-string')
  const { compose } = require('fun-function')

  const get = (key, object) => object[key]
  const concatSum = (a, b) => a !== undefined && b !== undefined
    ? a + b
    : a !== undefined
      ? a
      : b

  const equalityTests = map(
    compose(
      arrange({ inputs: 0, predicate: 1, contra: 2 }),
      ap([x => x, equalDeep, curry(get)])
    ),
    [
      [
        [{ inputs: ['a', 'b'], f: Object.keys, output: 'c' }, { a: 1, b: 2 }],
        { a: 1, b: 2, c: ['a', 'b'] },
        'transition'
      ],
      [[sub, { a: 2, b: 4 }, { a: 1, b: 2 }], { a: -1, b: -2 }, 'zipWith'],
      [
        [concatSum, { a: 9, c: 3 }, { a: 1, b: 2 }],
        { a: 10, b: 2, c: 3 },
        'concat'
      ],
      [[{ a: 9, c: 3}, { a: 1, b: 2 }], { a: 1, b: 2, c: 3 }, 'defaults'],
      [[{ a: 9, c: 3}, { a: 1, b: 2 }], { a: 9, b: 2, c: 3 }, 'merge'],
      [[{ a: append('z') }, { a: 1, b: 2 }], { az: 1, b: 2 }, 'apKeys'],
      [[prepend('p'), { a: 1, b: 2 }], { pa: 1, pb: 2 }, 'mapKeys'],
      [[add(3), { a: 1, b: 2 }], { a: 4, b: 5 }, 'map'],
      [[equalDeep('a'), { a: 1, b: 2 }], { a: 1 }, 'filterKeys'],
      [[lt(3), { a: 1, b: 2, c: 3 }], { a: 1, b: 2 }, 'filter'],
      [['a', add(1), { a: 1, b: 1 }], { a: 2, b: 1 }, 'update'],
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
      [[{ a: add(3) }, { a: 1, b: 2 }], { a: 4, b: 2 }, 'ap'],
      [[{ a: 1, b: 2 }], [['a', 1], ['b', 2]], 'toPairs'],
      [[{ a: 1 }], [['a', 1]], 'toPairs'],
      [[{}], [], 'toPairs']
    ])

  /* exports */
  module.exports = map(sync, equalityTests)
})()

