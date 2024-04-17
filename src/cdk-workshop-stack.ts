import { Stack, StackProps } from 'aws-cdk-lib';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { Hello } from './constructs/hello.js';
import { HitCounter } from './constructs/hitcounter.js';

export class CdkWorkshopStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const hello = new Hello(this, 'Hello');

    const helloWithCounter = new HitCounter(this, 'HelloHitCounter', {
      downstream: hello.handler,
    });

    new LambdaRestApi(this, 'Endpoint', {
      handler: helloWithCounter.handler,
    });
  }
}
