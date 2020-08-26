var tty = require('tty');
var ttys = require('ttys');
var rl = require('readline');

var stdin = ttys.stdin;
var stdout = ttys.stdout;

// var stdin = process.stdin;

stdin.setRawMode(true);

stdin.resume();

stdin.setEncoding('utf-8');

function getChar() {
  return new Promise(res => {
    stdin.on('data', function (key) {
      res(key);
    });
  });
}

function up(n = 1) {
  stdout.write('\033[' + n + 'A');
}

function down(n = 1) {
  stdout.write('\033[' + n + 'B');
}

function right(n = 1) {
  stdout.write('\033[' + n + 'C');
}

function left(n = 1) {
  stdout.write('\033[' + n + 'D');
}

void (async function () {
  stdout.write('which framework do you want?\n');
  let ans = await select(['vue', 'react', 'angular']);
  stdout.write('you selected:' + ans + '\b');
  process.exit();
})();

async function select(choices) {
  let selected = 0;
  for (let i = 0; i < choices.length; i++) {
    if (i === selected) {
      stdout.write('[x]' + choices[i] + '\n');
    } else {
      stdout.write('[ ]' + choices[i] + '\n');
    }
  }

  up(choices.length);
  right();
  while (1) {
    let char = await getChar();
    // ctrl + c
    if (char === '\u0003') {
      process.exit();
      break;
    }

    if (char === 'w' && selected > 0) {
      stdout.write(' ');
      left();
      selected--;
      up();
      stdout.write('x');
      left();
    }
    if (char === 's' && selected < choices.length - 1) {
      stdout.write(' ');
      left();
      selected++;
      down();
      stdout.write('x');
      left();
    }
    if (char === '\r') {
      down(choices.length - selected);
      left();
      return choices[selected];
    }
  }
}
