import { App, Stack } from 'aws-cdk-lib';
import { beforeAll, expect, test } from 'vitest';
import { Capture, Template } from 'aws-cdk-lib/assertions';
import { CdkWorkshopStack } from '../src/cdk-workshop-stack.js';
import { describe } from 'node:test';

let appStack: Stack;
let appTemplate: Template;

beforeAll(async () => {
  appStack = new CdkWorkshopStack(new App(), 'MyTestStack');
  appTemplate = Template.fromStack(appStack);
  console.log('template', appTemplate);
});

describe('DynamoDB', () => {
  test('DynamoDB created', () => {
    appTemplate.resourceCountIs('AWS::DynamoDB::Table', 1);
  });

  test('DynamoDB encryption', () => {
    appTemplate.hasResourceProperties('AWS::DynamoDB::Table', {
      SSESpecification: {
        SSEEnabled: true,
      },
    });
  });

  type HitLambdaEnvVars = {
    Variables: {
      DOWNSTREAM_FUNCTION_NAME: { Ref: string };
      HITS_TABLE_NAME: { Ref: string };
    };
  };

  test('Hitcounter Lambda has env vars', () => {
    const envCapture = new Capture();
    appTemplate.hasResourceProperties('AWS::Lambda::Function', {
      Environment: envCapture,
    });

    const envVars = envCapture.asObject() as HitLambdaEnvVars;

    expect(envVars.Variables.DOWNSTREAM_FUNCTION_NAME.Ref).toSatisfy(
      (val: string) => val.startsWith('HelloHelloHandler')
    );

    expect(envVars.Variables.HITS_TABLE_NAME.Ref).toSatisfy((val: string) =>
      val.startsWith('HelloHitCounterHits')
    );
  });
});

describe('Lambdas', () => {
  test('Hello Lambda created', () => {
    appTemplate.hasResourceProperties('AWS::Lambda::Function', {
      Handler: 'hello.handler',
    });
  });

  test('HitCounter Lambda created', () => {
    appTemplate.hasResourceProperties('AWS::Lambda::Function', {
      Handler: 'hitcounter.handler',
    });
  });

  test('Lambda function count', () => {
    appTemplate.resourceCountIs('AWS::Lambda::Function', 3);
  });
});
