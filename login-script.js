const { spawn } = require('child_process');
const fs = require('fs');

const child = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['--yes', 'firebase-tools', 'login:ci', '--interactive']);

child.stdout.on('data', data => {
  fs.appendFileSync('firebase_out.txt', data.toString());
});
child.stderr.on('data', data => {
  fs.appendFileSync('firebase_out.txt', data.toString());
});
