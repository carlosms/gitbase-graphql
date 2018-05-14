import args from '../args';

const mysql = require('promise-mysql');

export default mysql.createPool({
  waitForConnections: false,
  connectionLimit: 10240,
  host: args.host,
  port: args.port,
  user: args.user,
  password: args.password,
});
