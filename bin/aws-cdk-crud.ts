#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { AwsCdkCrudStack } from '../lib/aws-cdk-crud-stack';
import { DynamoDBStack } from '../lib/dynamodb-stack';
const app = new cdk.App();
const dynamodbStack = new DynamoDBStack(app, 'DynamoDBStack');
const usersApiStack = new AwsCdkCrudStack(app, 'AwsCdkCrudStack', {dynamodbStack});
usersApiStack.addDependency(dynamodbStack)
