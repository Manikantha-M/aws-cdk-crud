import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import path from 'path';
import * as apigateway from 'aws-cdk-lib/aws-apigatewayv2';
import * as apigateway_integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';

export class AwsCdkCrudStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const userHandler = new NodejsFunction(this, 'UserHandler', {
      runtime:Runtime.NODEJS_22_X,
      entry: path.join(__dirname, '../src/lambda/handler.ts'),
      handler: 'handler',
      functionName: `${this.stackName}-user-handler`
    });
    const httpApi = new apigateway.HttpApi(this, 'UserApi', {
      apiName: 'Users API',
      description: 'Users Management API',
      corsPreflight: {
        allowOrigins: ['*'],
        allowMethods: [apigateway.CorsHttpMethod.ANY],
        allowHeaders: ['*']
      }
    });
    const routes = [
      {path:'/users', method: apigateway.HttpMethod.GET, name:'GetAllUsers'},
      {path:'/users', method: apigateway.HttpMethod.POST, name:'createUser'},
      {path:'/users/{id}', method: apigateway.HttpMethod.PUT, name:'GetUser'},
      {path:'/users/{id}', method: apigateway.HttpMethod.GET, name:'updateUser'},
      {path:'/users/{id}', method: apigateway.HttpMethod.GET, name:'DeleteUser'},
    ];
    routes.forEach(({path, method, name})=>{
      httpApi.addRoutes({
        path, methods:[method], integration: new apigateway_integrations.HttpLambdaIntegration(`${name}Integration`, userHandler)
      })
    });
    new cdk.CfnOutput(this, 'HttpApiUrl', {
      value: httpApi.url ?? '',
      description: 'HTTP API URL'
    })
  }
}
