import { handlerPath } from '@libs/handler-resolver';
import { S3_BUCKET_NAME } from '../../../constants';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3:{
        bucket: S3_BUCKET_NAME,
        event: 's3:ObjectCreated:*',
        rules: [{
          prefix: 'uploaded/'
        }],
        existing: true,
      }
    },
  ],
};