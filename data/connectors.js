import args from "../args";
var mysql = require("promise-mysql");

export default mysql.createConnection({
  host: args.host,
  port: args.port,
  user: args.user,
  password: args.password
});
