#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkWorkshopStack } from './cdk-workshop-stack.js';
import { WorkshopPipelineStack } from './pipeline-stack.js';

const app = new cdk.App();
new WorkshopPipelineStack(app, 'WorkshopPipelineStack');
