import type { AWS } from '@serverless/typescript';
import importProductsFile from '@functions/importProductsFile';
import importFileParser from '@functions/importFileParser';
import { S3_BUCKET_NAME } from './constants';


const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild','serverless-prune-versions','serverless-auto-swagger','serverless-offline', 'serverless-export-env'],
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    region: 'eu-west-1',
    profile: 'aws_bolotov',
    stage: 'dev',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      SQS_QUEUE_URL: { 'Fn::ImportValue': 'CatalogItemsQueueArn' },
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['s3:ListBucket'],
        Resource: [`arn:aws:s3:::${S3_BUCKET_NAME}`],
      },
      {
        Effect: 'Allow',
        Action: ['s3:*'],
        Resource: [`arn:aws:s3:::${S3_BUCKET_NAME}/*`],
      },
    ],
  },
  // import the function via paths
  functions: { importProductsFile, importFileParser },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node18',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    autoswagger: {
      host: '4xodz2u761.execute-api.eu-west-1.amazonaws.com/dev'
    },
    prune:{
      automatic: true,
    },
    importEnv: {
      variables: ['SQS_URL', 'SNS_ARN'],
    },
    s3ImportBucketName: S3_BUCKET_NAME,
  },
  resources: {
    Resources: {
      ImportServiceCatalogItemsQueueUrl: {
        Type: 'AWS::CloudFormation::CustomResource',
        Properties: {
          ServiceToken: { 'Fn::ImportValue': 'CatalogItemsQueueArn' },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
