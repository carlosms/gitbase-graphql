var mysql = require("promise-mysql");

export default mysql.createConnection({
  host: "127.0.0.1",
  user: "root"
});
