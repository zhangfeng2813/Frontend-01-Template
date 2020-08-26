const path = require('path');
const fsevents = require('fsevents');

const { exec } = require('child_process');

exec('http-server');

const stop = fsevents.watch(path.resolve(__dirname), (path, flags, id) => {
  const info = fsevents.getInfo(path, flags, id);
  console.log('info', info);

  exec('webpack');
}); // To start observation
// stop(); // To end observation
