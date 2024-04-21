import { Stack, StackProps } from 'aws-cdk-lib';
import { Repository } from 'aws-cdk-lib/aws-codecommit';
import {
  CodeBuildStep,
  CodePipeline,
  CodePipelineSource,
} from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { WorkshopPipelineStage } from './pipeline-stage';

export class WorkshopPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const repo = new Repository(this, 'WorkshopRepo', {
      repositoryName: 'WorkshopRepo',
    });

    const synth = new CodeBuildStep('SynthStep', {
      input: CodePipelineSource.codeCommit(repo, 'master'),
      commands: ['npm ci', 'npm run build', 'npx cdk synth'],
      installCommands: ['npm install -g aws-cdk'],
    });

    const pipeline = new CodePipeline(this, 'Pipeline', {
      synth,
    });

    const deploy = new WorkshopPipelineStage(this, 'Deploy');
    const deployStage = pipeline.addStage(deploy);

    deployStage.addPost(
      new CodeBuildStep('TestViewerEndpoint', {
        projectName: 'TestViewerEndpoint',
        envFromCfnOutputs: {
          ENDPOINT_URL: deploy.hcViewerUrl,
        },
        commands: ['curl -Ssf $ENDPOINT_URL'],
      }),

      new CodeBuildStep('TestAPIGatewayEndpoint', {
        projectName: 'TestAPIGatewayEndpoint',
        envFromCfnOutputs: {
          ENDPOINT_URL: deploy.hcEndpoint,
        },
        commands: [
          'curl -Ssf $ENDPOINT_URL',
          'curl -Ssf $ENDPOINT_URL/hello',
          'curl -Ssf $ENDPOINT_URL/test',
        ],
      })
    );
  }
}
