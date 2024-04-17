#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkWorkshopStack } from './cdk-workshop-stack.js';

const app = new cdk.App();
new CdkWorkshopStack(app, 'CdkWorkshopStack');
