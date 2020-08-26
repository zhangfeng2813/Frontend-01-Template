import assert from 'assert';
import add from '../src/add.js';

it('should add to numbers from an es module', () => {
  assert.equal(add(3, 5), 8);
});