import assert, { equal } from 'assert';
import tap from 'tape';

// the following lines are breaking the tests on purpose
// they should be removed from compiled code
// if they are not, the tests will fail
tap.test('imported module references', function(t){
  t.plan(1);

  assert(false, 'should not run default import function calls');
  assert.fail(1, 2, 'should not run default import member calls');
  equal(1, 2, 'should not run import non-default function calls');

  t.ok(true, 'are removed');

})
tap.test('import statement', function(t){
  t.plan(2);
  t.equal(eval('typeof assert'), 'undefined', 'for default import is discarded');
  t.equal(eval('typeof equal'), 'undefined', 'for non-default import are discarded');
});

tap.test('unrelated references', function(t){
  t.plan(1);
  let called = false;
  // different scope, different `assert`
  function assert(){
    called = true;
  }

  assert(); // that'd better remain
  t.ok(called, 'are left untouched');
});
