import { basicAuthorizer } from './src/functions';
import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'authorization-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild','serverless-prune-versions','serverless-auto-swagger','serverless-offline','serverless-dotenv-plugin'],
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
    },
  },

  functions: { basicAuthorizer },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    prune:{ automatic: true },
    autoswagger: {
      host: 'https://3ybu9zhgwf.execute-api.eu-west-1.amazonaws.com/swagger'
    },
  },
};

module.exports = serverlessConfiguration;
