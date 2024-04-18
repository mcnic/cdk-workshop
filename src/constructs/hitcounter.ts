import { Construct } from 'constructs';
import { Code, Runtime, Function, IFunction } from 'aws-cdk-lib/aws-lambda';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { RemovalPolicy } from 'aws-cdk-lib';

export interface HitCounterProps {
  downstream: IFunction;
}

export class HitCounter extends Construct {
  public readonly handler: Function;
  public readonly table: Table;

  constructor(scope: Construct, id: string, props: HitCounterProps) {
    super(scope, id);

    this.table = new Table(this, 'Hits', {
      partitionKey: { name: 'path', type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.handler = new Function(this, 'HitCounterHandler', {
      runtime: Runtime.NODEJS_20_X,
      handler: 'hitcounter.handler',
      code: Code.fromAsset('dist/lambdas/hitcounter'),
      environment: {
        DOWNSTREAM_FUNCTION_NAME: props.downstream.functionName,
        HITS_TABLE_NAME: this.table.tableName,
      },
    });

    this.table.grantReadWriteData(this.handler);

    props.downstream.grantInvoke(this.handler);
  }
}
