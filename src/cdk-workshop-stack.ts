import { Stack, StackProps } from 'aws-cdk-lib';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { Code, Runtime, Function } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
// import { HitCounter } from './hitcounter';

export class CdkWorkshopStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const hello = new Function(this, 'HelloHandler', {
      runtime: Runtime.NODEJS_20_X,
      code: Code.fromAsset('dist/lambdas/hello'),
      handler: 'hello.handler',
    });

    // const helloWithCounter = new HitCounter(this, 'HelloHitCounter', {
    //   downstream: hello,
    // });

    new LambdaRestApi(this, 'Endpoint', {
      // handler: helloWithCounter.handler,
      handler: hello,
    });
  }
}
