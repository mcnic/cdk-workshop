import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { Hello } from './constructs/hello.js';
import { HitCounter } from './constructs/hitcounter.js';
import { TableViewer } from 'cdk-dynamo-table-viewer';

export class CdkWorkshopStack extends Stack {
  public readonly hcViewerUrl: CfnOutput;
  public readonly hcEndpoint: CfnOutput;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const hello = new Hello(this, 'Hello');

    const helloWithCounter = new HitCounter(this, 'HelloHitCounter', {
      downstream: hello.handler,
    });

    const gateway = new LambdaRestApi(this, 'Endpoint', {
      handler: helloWithCounter.handler,
    });

    const tv = new TableViewer(this, 'ViewHitCounter', {
      title: 'Hello Hits',
      table: helloWithCounter.table,
    });

    this.hcEndpoint = new CfnOutput(this, 'GatewayUrl', {
      value: gateway.url,
    });

    this.hcViewerUrl = new CfnOutput(this, 'TableViewerUrl', {
      value: tv.endpoint,
    });
  }
}
