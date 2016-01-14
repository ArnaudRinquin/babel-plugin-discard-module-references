# babel-plugin-discard-module-references [![Build Status](https://travis-ci.org/ArnaudRinquin/babel-plugin-discard-module-references.svg)](https://travis-ci.org/ArnaudRinquin/babel-plugin-discard-module-references)

Babel plugin to discard all code using specified imported modules.

If other imported modules are not used anymore, they are discarded as well.

## Use cases

* write your tests along your code, run them in development but discard them on production
* discard analytics code in dev mode
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
        "targets": [ "some-module", "./or-even/relative-path" ]
      }]
    ]
  }
  ```

1. ... or any config you're using, seek help from [doc](https://babeljs.io/docs/setup/)

### Whitelisting unused imports

By default, all unused module imports will be discarded, wether or not it's because you target the only code that were using them. By example, if you import `sinon` for you tests but discard all of them, `sinon` becomes useless and gets discarded as well.

There is a potential issue with that when a module has expected side effects when imported.

To whitelist a module so its import never gets discarded, simply use the `unusedWhitelist` options:

```json
{
  "presets": ["es2015"],
  "plugins": [
    ["discard-module-references", {
      "targets": [ "assert" ],
      "unusedWhitelist": [ "sinon" ]
    }]
  ]
}
```

Note: unspecified `imports` such as `import 'foobar';` are kept by default as they obviously must have some expected side effects.

## Example

### Writing tests right in the tested code file

The original scenario that motivated the plugin was to be able to write tests along tested code, run them in development mode (so we don't need to run another tool, just use the code and see if it breaks) but of course remove all of them for production code.

With the following code, a production build that would use `babel-plugin-discard-module-references` with `assert` would just do the trick.

```js
import assert, { deepEqual } from 'assert';
import _ from 'lodash';
import path from 'path';

export default function add(n1, n2) {
  return n1 + n2;
}

function doSomethingWithLodash() {
  return _.pick({nose: 'big'}, 'nose');
}

assert(add(1, 2) === 3);
assert.equal(typeof add, 'function');
deepEqual({a:1}, {a:1});
assert(path.basename('foo/bar.html') === 'something');
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

Note how the import of `path` has been discarded.
