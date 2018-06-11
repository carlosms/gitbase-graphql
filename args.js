const args = {
  port: process.env.GITBASE_GQL_DB_PORT || 3306,
  host: process.env.GITBASE_GQL_DB_HOST || 'localhost',
  user: process.env.GITBASE_GQL_DB_USER || 'gitbase',
  password: process.env.GITBASE_GQL_DB_PASSWORD || '',
  'listen-port': process.env.GITBASE_GQL_PORT || 3000,
};

export default args;
