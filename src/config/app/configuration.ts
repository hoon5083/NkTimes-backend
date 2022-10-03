export default () => ({
  app: {
    env: process.env.APP_ENV,
    port: parseInt(process.env.APP_PORT),
  },
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
  },
});
