# Welcome to your CDK TypeScript project

This is code for [AWS CDK workshop](https://cdkworkshop.com/20-typescript.html)

## First part

create sample project `cdk init sample-app --language typescript`

You should explore the contents of this project. It demonstrates a CDK app with
an instance of a stack (`CdkWorkshopStack`) which contains an Amazon SQS queue
that is subscribed to an Amazon SNS topic.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template

## Second part

fix project for use TS files for use
[AWS SDK for Javasctipt V3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/introduction/)

used [project](https://github.com/hazardsoft/aws-cdk-workshop)
