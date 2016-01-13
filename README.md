# babel-plugin-discard-module-references [![Build Status](https://travis-ci.org/ArnaudRinquin/babel-plugin-discard-module-references.svg)](https://travis-ci.org/ArnaudRinquin/babel-plugin-discard-module-references)

Babel plugin to discard all code using specified imported modules

## Use cases

* write your tests along your code, run them in development but discard them on production
* _???_

## Usage

1. Install the plugin

  ```bash
  npm i -D babel-plugin-discard-module-references
  ```
1. Update your `.babelrc` with plugin settings

  ```json
  {
    "presets": ["es2015"],
    "plugins": [
      ["discard-module-references", {
        "for": [
          "some-module", "./or-even/relative-path"]
      }]
    ]
  }
  ```

1. ... or any config you're using, seek help from [doc](https://babeljs.io/docs/setup/)

## Example

### Writing tests right in the tested code file

The original scenario that motivated the plugin was to be able to write tests along tested code, run them in development mode (so we don't need to run another tool, just use the code and see if it breaks) but of course remove all of them for production code.

With the following code, a production build that would use `babel-plugin-discard-module-references` with `assert` would just do the trick.

```js
import assert, { deepEqual } from 'assert';
import _ from 'lodash';

export default function add(n1, n2) {
  return n1 + n2;
}

function doSomethingWithLodash() {
  return _.pick({nose: 'big'}, 'nose');
}

assert(add(1, 2) === 3);
assert.equal(typeof add, 'function');
deepEqual({a:1}, {a:1});
```

Would be compiled to the following, where all tests are removed;

```js
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = add;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function add(n1, n2) {
  return n1 + n2;
}

function doSomethingWithLodash() {
  return _lodash2.default.pick({ nose: 'big' }, 'nose');
}
```
