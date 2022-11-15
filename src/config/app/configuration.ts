export default () => ({
  app: {
    env: process.env.APP_ENV,
    port: parseInt(process.env.APP_PORT),
    root: process.env.PWD,
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
  minio: {
    endPoint: process.env.MINIO_END_POINT,
    port: parseInt(process.env.MINIO_PORT),
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
    bucketName: process.env.MINIO_BUCKET_NAME,
  },
});
