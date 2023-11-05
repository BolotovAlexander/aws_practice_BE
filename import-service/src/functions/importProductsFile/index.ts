import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: '/import',
        cors: true,
        request: {
          parameters: {
              querystrings: {
                  name: true,
              },
          },
        },
        authorizer: {
          arn: 'arn:aws:lambda:eu-west-1:640385011454:function:authorization-service-dev-basicAuthorizer',
          type: token,
          resultTtlInSeconds: 0,
          identitySource: method.request.header.Authorization,
        }
      },
    },
  ],
};