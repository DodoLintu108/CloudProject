// src/app/api/tasks/route.ts
import { NextResponse } from 'next/server';
import { awsConfig, dynamoDb } from '@/lib/aws-config';

export async function GET() {
  const data = await dynamoDb
    .scan({ TableName: awsConfig.tasksTable })
    .promise();
  return NextResponse.json(data.Items);
}

export async function POST(request: Request) {
  const task = await request.json();
  // Ensure timestamps and status are set server-side if missing
  const now = new Date().toISOString();
  const item = {
    ...task,
    createdAt: task.createdAt || now,
    updatedAt: task.updatedAt || now,
    status: task.status || 'pending',
  };
  await dynamoDb
    .put({ TableName: awsConfig.tasksTable, Item: item })
    .promise();
  return NextResponse.json(item, { status: 201 });
}

export async function DELETE(request: Request) {
  const { userId, taskId } = await request.json();
  await dynamoDb
    .delete({
      TableName: awsConfig.tasksTable,
      Key: { userId, taskId },
    })
    .promise();
  return NextResponse.json({ userId, taskId }, { status: 200 });
}

export async function PUT(request: Request) {
  const { userId, taskId, status } = await request.json();
  const now = new Date().toISOString();
  const result = await dynamoDb
    .update({
      TableName: awsConfig.tasksTable,
      Key: { userId, taskId },
      UpdateExpression: 'set #status = :status, updatedAt = :updatedAt',
      ExpressionAttributeNames: { '#status': 'status' },
      ExpressionAttributeValues: { ':status': status, ':updatedAt': now },
      ReturnValues: 'ALL_NEW',
    })
    .promise();
  return NextResponse.json(result.Attributes, { status: 200 });
}
