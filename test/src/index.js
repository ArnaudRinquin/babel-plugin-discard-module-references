import tap from 'tape';

// FOLLOWING MODULES ALL HAVE A SPECIFIC ROLE IN THE TEST:

// target module to remove: must discard
import assert, { equal } from 'assert';

// used on in target module code: must keep
import sinon, { spy } from 'sinon';

// no import specifier: must keep
import 'deep-extend';

// used only in target but whitelisted: must keep
import path from 'path';

// used both in target and outside: must keep
import assign from 'object-assign';

// not used in target: must keep
import { readFileSync } from 'fs';

// TESTS START

const thisVeryFile = readFileSync(__filename).toString();

tap.test('target modules', function(t){
  t.plan(1);
  // the following lines are breaking the tests on purpose
  // they should be removed from compiled code
  // if they are not, the tests will fail

  assert(false, 'should not run default import function calls');
  assert.fail(1, 2, 'should not run default import member calls');
  equal(1, 2, 'should not run import non-default function calls');
  assert(function(){
    sinon.doesNotEvenExist();
  });
  equal(function(){
    spy('whatever');
  });
  equal(function(){
    path.resolve('I dont care');
    path.yolo('I dont care');
    path.yeaheee('I dont care');
  });

  // ok, let's wrap up
  t.ok(true, 'code using them is removed');
});

function occurencesCount(str, substring) {
  const matcher = new RegExp(substring, 'g');
  return (str.match(matcher) || []).length
}

tap.test('module used only by target mode code', function(t){
  t.plan(2);
  // 1 because it's just right here
  t.equal(occurencesCount(thisVeryFile, 'sinon'), 1, 'default specifies are removed');
  t.equal(occurencesCount(thisVeryFile, 'spy'), 1, 'non-default specifies are removed');
});

tap.test('whitelisted modules', function(t){
  t.plan(1);
  // must have more
  t.notEqual(occurencesCount(thisVeryFile, 'path'), 1, 'are kept even if not used');
});

tap.test('modules used outside of target code', function(t){
  t.plan(1);
  t.ok(assign({a:1}, {b:2}), 'are kept');
});

tap.test('unrelated references', function(t){
  t.plan(1);
  let called = false;
  // different scope, different `assert`
  function assert(){
    called = true;
  }

  assert(); // that'd better remain
  t.ok(called, 'are kept');
});
