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
  s3: {
    bucketRegion: process.env.S3_BUCKET_REGION,
    accessKey: process.env.S3_ACCESS_KEY,
    secretKey: process.env.S3_SECRET_KEY,
    bucketName: process.env.S3_BUCKET_NAME,
  },
});
