import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';
import { APIGatewayEvent } from 'aws-lambda';

export const handler = async function (
  event: APIGatewayEvent
): Promise<string> {
  console.log('request:', JSON.stringify(event, undefined, 2));

  const dynamoDBClient = new DynamoDBClient();
  const lambdaClient = new LambdaClient();

  await dynamoDBClient.send(
    new UpdateItemCommand({
      TableName: process.env.HITS_TABLE_NAME,
      Key: { path: { S: event.path } },
      UpdateExpression: 'ADD hits :incr',
      ExpressionAttributeValues: { ':incr': { N: '1' } },
    })
  );

  const response = await lambdaClient.send(
    new InvokeCommand({
      FunctionName: process.env.DOWNSTREAM_FUNCTION_NAME,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify(event),
    })
  );

  console.log('downstream response:', JSON.stringify(response, undefined, 2));

  return response.Payload
    ? JSON.parse(response.Payload.transformToString())
    : '';
};
