import type { AWS } from '@serverless/typescript';
import {
  importProductsFile,
  importFileParser
} from './src/functions';
import { S3_BUCKET_NAME, QUEUE_NAME } from './constants';


const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  plugins: [
    'serverless-esbuild',
    'serverless-prune-versions',
    'serverless-auto-swagger',
    'serverless-offline',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    region: 'eu-west-1',
    profile: 'aws_bolotov',
    stage: 'dev',
    httpApi: {cors: true},
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      SQS_QUEUE_URL: `https://sqs.eu-west-1.amazonaws.com/389725452142/${QUEUE_NAME}`,
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['s3:*'],
        Resource: [`arn:aws:s3:::${S3_BUCKET_NAME}`, `arn:aws:s3:::${S3_BUCKET_NAME}/*`],
      },
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: `arn:aws:sqs:eu-west-1:389725452142:${QUEUE_NAME}`,
      },
    ],
  },

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
      host: '2wxociqh1k.execute-api.eu-west-1.amazonaws.com'
    },
    prune:{
      automatic: true,
    }
  },
};

module.exports = serverlessConfiguration;
