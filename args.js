const commandLineArgs = require('command-line-args');

const optionDefinitions = [
  { name: 'host', alias: 'h', defaultValue: 'localhost' },
  { name: 'port', alias: 'p', defaultValue: '3306' },
  { name: 'user', alias: 'u', defaultValue: 'root' },
  { name: 'password', alias: 'P', defaultValue: '' },
  { name: 'listen-port', defaultValue: 3000 },
];

const args = commandLineArgs(optionDefinitions);

export default args;
