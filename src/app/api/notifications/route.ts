import { NextResponse } from 'next/server';
import { SQS } from 'aws-sdk';

const sqsClient = new SQS();

export async function GET() {
  const queueUrl = process.env.SQS_QUEUE_URL!;
  const params = {
    QueueUrl: queueUrl,
    MaxNumberOfMessages: 10,
    WaitTimeSeconds: 0,
  };
  const data = await sqsClient.receiveMessage(params).promise();
  const messages = data.Messages || [];
  // Optionally, delete messages here to prevent reprocessing
  return NextResponse.json(messages.map(m => ({ id: m.MessageId, body: m.Body })));  
}
