import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      sqs: {
        batchSize: 5,
        maximumConcurrency: 2,
        arn: { 'Fn::GetAtt': ['CatalogItemsQueue', 'Arn'] }
      }
    }
  ]
};