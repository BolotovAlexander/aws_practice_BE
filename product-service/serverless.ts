import {
  createProduct,
  getProductsById,
  getProductsList,
  catalogBatchProcess
} from './src/functions';

import type { AWS } from '@serverless/typescript';


const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-auto-swagger','serverless-offline', 'serverless-export-env'],
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
      PRODUCTS_TABLE: 'products',
      PRODUCTS_STOCK_TABLE: 'products_stock',
    },
     iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
          'dynamodb:Scan',
          'dynamodb:GetItem',
          'dynamodb:PutItem',
          'dynamodb:UpdateItem',
          'dynamodb:DeleteItem',
        ],
        Resource: [
          'arn:aws:dynamodb:eu-west-1:389725452142:table/products',
          'arn:aws:dynamodb:eu-west-1:389725452142:table/products_stock',
        ],
      },
      {
        Effect: 'Allow',
        Action: ['sqs:*'],
        Resource: [{'Fn::GetAtt': ['CatalogItemsQueue', 'Arn']}],
      },
      {
        Effect: 'Allow',
        Action: ['sns:*'],
        Resource: [{'Ref': 'CreateProductTopic'}],
      },
    ],
  },
  functions: { getProductsList, getProductsById, createProduct, catalogBatchProcess },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: true,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node18',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    autoswagger: {
      host: 'f64qrzoas6.execute-api.eu-west-1.amazonaws.com'
    },
    exportEnv: {
      variables: ['SQS_URL', 'SNS_ARN'],
    },
  },
  resources: {
    Resources: {
        ProductsDynamoDBTable: {
            Type: 'AWS::DynamoDB::Table',
            Properties: {
                TableName: 'products',
                AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
                KeySchema: [ { AttributeName: 'id', KeyType: 'HASH' }],
                ProvisionedThroughput: {
                    ReadCapacityUnits: 1,
                    WriteCapacityUnits: 1,
                },
            },
        },
        ProductsStockDynamoDBTable: {
            Type: 'AWS::DynamoDB::Table',
            Properties: {
                TableName: 'products_stock',
                AttributeDefinitions: [{ AttributeName: 'product_id', AttributeType: 'S' }],
                KeySchema: [{ AttributeName: 'product_id', KeyType: 'HASH' }],
                ProvisionedThroughput: {
                    ReadCapacityUnits: 1,
                    WriteCapacityUnits: 1,
                },
            },
        },
        CatalogItemsQueue: {
          Type: 'AWS::SQS::Queue',
          Properties: { QueueName: 'CatalogItemsQueue' }
        },
        CreateProductTopic: {
          Type: 'AWS::SNS::Topic',
          Properties: { TopicName: 'CreateProductTopic' }
        },
        EmailSubscription: {
          Type: 'AWS::SNS::Subscription',
          Properties: {
            Protocol: 'email',
            TopicArn: {
              Ref: 'CreateProductTopic'
            },
            Endpoint: 'oleksandr_bolotov@epam.com'
          }
        },
        FilteredEmailSubscription: {
          Type: 'AWS::SNS::Subscription',
          Properties: {
            Protocol: 'email',
            TopicArn: {
              Ref: 'CreateProductTopic'
            },
            Endpoint: 'bolotovalexander57@gmail.com',
            FilterPolicy: { price:[10] }
          }
        }
    },
    Outputs: {
      CatalogItemsQueue: {
        Value: { 'Fn::GetAtt': ['CatalogItemsQueue', 'Arn'] },
        Export: { Name: 'CatalogItemsQueueArn' },
      },
    },
  },
};

module.exports = serverlessConfiguration;