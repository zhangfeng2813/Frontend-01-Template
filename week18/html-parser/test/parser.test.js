import { parserHTML } from '../src/parser.js';
import assert from 'assert';

it('parse a single element', () => {
  let doc = parserHTML('<div></div>');
  let div = doc.children[0];
  assert.equal(div.tagName, 'div');
  assert.equal(div.children.length, 0);
  assert.equal(div.type, 'element');
  assert.equal(div.attributes.length, 0);
});

it('parse a single element with text content', () => {
  let doc = parserHTML('<div>hello</div>');
  let text = doc.children[0].children[0];

  assert.equal(text.type, 'text');
  assert.equal(text.content, 'hello');
});

it('tag mismatch', () => {
  try {
    let doc = parserHTML('<div></vid>');
  } catch (e) {
    assert.equal(e.message, 'Uncaught SyntaxError: Invalid or unexpected token');
  }
});

it('text with <', () => {
  let doc = parserHTML('<div>a < b</div>');
  let text = doc.children[0].children[0];

  assert.equal(text.type, 'text');
  assert.equal(text.content, 'a < b');
});

function hasProperty() {}

it('with property', () => {
  let doc = parserHTML('<div id=a class=\'cls\' data="abc" ></div>');
  let div = doc.children[0];

  let count = 0;
  for (let attr of div.attributes) {
    if (attr.name === 'id') {
      count++;
      assert.equal(attr.value, 'a');
    }
    if (attr.name === 'class') {
      count++;
      assert.equal(attr.value, 'cls');
    }
    if (attr.name === 'data') {
      count++;
      assert.equal(attr.value, 'abc');
    }
  }
  assert.ok(count === 3);
});

it('with property 2', () => {
  let doc = parserHTML(`<div id=a class='cls' data="abc"></div>`);
  let div = doc.children[0];

  let count = 0;
  for (let attr of div.attributes) {
    if (attr.name === 'id') {
      count++;
      assert.equal(attr.value, 'a');
    }
    if (attr.name === 'class') {
      count++;
      assert.equal(attr.value, 'cls');
    }
    if (attr.name === 'data') {
      count++;
      assert.equal(attr.value, 'abc');
    }
  }
  assert.ok(count === 3);
});

it('with property 3', () => {
  let doc = parserHTML(`<div id=a class='cls' data="abc" />`);
  let div = doc.children[0];

  let count = 0;
  for (let attr of div.attributes) {
    if (attr.name === 'id') {
      count++;
      assert.equal(attr.value, 'a');
    }
    if (attr.name === 'class') {
      count++;
      assert.equal(attr.value, 'cls');
    }
    if (attr.name === 'data') {
      count++;
      assert.equal(attr.value, 'abc');
    }
  }
  assert.ok(count === 3);
});

it('with property 4', () => {
  let doc = parserHTML(`<div class='cls'/>`);
  let div = doc.children[0];

  let count = 0;
  for (let attr of div.attributes) {
    if (attr.name === 'class') {
      count++;
      assert.equal(attr.value, 'cls');
    }
  }
  assert.ok(count === 1);
});

it('with property 5', () => {
  let doc = parserHTML(`<div class=cls/>`);
  let div = doc.children[0];

  let count = 0;
  for (let attr of div.attributes) {
    if (attr.name === 'class') {
      count++;
      assert.equal(attr.value, 'cls');
    }
  }
  assert.ok(count === 1);
});

it('with property 5', () => {
  let doc = parserHTML(`<div class=cls data
=
a/>`);
  let div = doc.children[0];

  let count = 0;
  for (let attr of div.attributes) {
    if (attr.name === 'class') {
      count++;
      assert.equal(attr.value, 'cls');
    }
    if (attr.name === 'data') {
      count++;
      assert.equal(attr.value, 'a');
    }
  }
  assert.ok(count === 2);
});

it('with property 6', () => {
  let doc = parserHTML(`<div class=cls data
=
a><div>`);
  let div = doc.children[0];

  let count = 0;
  for (let attr of div.attributes) {
    if (attr.name === 'class') {
      count++;
      assert.equal(attr.value, 'cls');
    }
    if (attr.name === 'data') {
      count++;
      assert.equal(attr.value, 'a');
    }
  }
  assert.ok(count === 2);
});

it('with property 7', () => {
  let doc = parserHTML(`<div class=></div>`);
  let div = doc.children[0];
  assert.equal(div.attributes.length, 0);
});

it('with property 8', () => {
  let doc = parserHTML(`<div class="></div>`);
  let div = doc.children[0];
  let count = 0;
  for (let attr of div.attributes) {
    if (attr.name === 'class') {
      count++;
      assert.equal(attr.value, '');
    }
  }
  assert.ok(count === 1);
});

it('with property 9', () => {
  let doc = parserHTML(`<div class="/>`);
  let div = doc.children[0];
  let count = 0;
  for (let attr of div.attributes) {
    if (attr.name === 'class') {
      count++;
      assert.equal(attr.value, '');
    }
  }
  assert.ok(count === 1);
});

it('with property 10', () => {
  let doc = parserHTML(`<div class='/>`);
  let div = doc.children[0];
  let count = 0;
  for (let attr of div.attributes) {
    if (attr.name === 'class') {
      count++;
      assert.equal(attr.value, '');
    }
  }
  assert.ok(count === 1);
});

it('script', () => {
  let content = `
  <div>abcd</div>
  <span>x</span>
  /script>
  <script
  <
  </
  </s
  </sc
  </scr
  </scri
  </scrip
  </script 
`;
  let doc = parserHTML(`<script>${content}</script>`);
  let script = doc.children[0];
  let text = script.children[0];
  assert.equal(text.type, 'text');
  assert.equal(text.content, content);
});

it('attribute with no value', () => {
  let doc = parserHTML('<div class id/>');
  let div = doc.children[0];
  assert.deepEqual(div.attributes, []);
});

// it('char after /', () => {
//   let doc = parserHTML('<div class="/c">');
//   let div = doc.children[0];
//   console.log("hasProperty -> div", div)
// });