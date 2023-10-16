import createProduct from '@functions/createProduct'
import getProductsById from '@functions/getProductsById';
import getProductsList from '@functions/getProductsList';
import type { AWS } from '@serverless/typescript';


const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-auto-swagger','serverless-offline'],
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
  },
  functions: { getProductsList, getProductsById, createProduct },
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
      host: 'eyh3lukhaa.execute-api.eu-west-1.amazonaws.com/dev'
    },
  },
  resources: {
    Resources: {
        ProductsDynamoDBTable: {
            Type: 'AWS::DynamoDB::Table',
            Properties: {
                TableName: 'products',
                AttributeDefinitions: [
                    { AttributeName: 'id', AttributeType: 'S' },
                    { AttributeName: 'title', AttributeType: 'S' },
                ],
                KeySchema: [
                  { AttributeName: 'id', KeyType: 'HASH' },
                  { AttributeName: 'title', KeyType: 'RANGE' },
                ],
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
                AttributeDefinitions: [
                    { AttributeName: 'product_id', AttributeType: 'S' },
                    { AttributeName: 'count', AttributeType: 'N' },
                ],
                KeySchema: [
                    { AttributeName: 'product_id', KeyType: 'HASH' },
                    { AttributeName: 'count', KeyType: 'RANGE' },
                ],
                ProvisionedThroughput: {
                    ReadCapacityUnits: 1,
                    WriteCapacityUnits: 1,
                },
            },
        },
    },
},
}

module.exports = serverlessConfiguration;