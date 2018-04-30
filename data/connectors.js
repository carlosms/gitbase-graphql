import args from '../args';

const mysql = require('promise-mysql');

export default mysql.createConnection({
  host: args.host,
  port: args.port,
  user: args.user,
  password: args.password,
});
