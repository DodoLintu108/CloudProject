// src/app/api/tasks/route.ts
import { NextResponse } from 'next/server';
import { ScanCommand, PutCommand, DeleteCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { awsConfig, dynamoDb } from '@/lib/aws-config';

export async function GET() {
  const data = await dynamoDb.send(new ScanCommand({ 
    TableName: awsConfig.tasksTable 
  }));
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
  await dynamoDb.send(new PutCommand({ 
    TableName: awsConfig.tasksTable, 
    Item: item 
  }));
  return NextResponse.json(item, { status: 201 });
}

export async function DELETE(request: Request) {
  const { userId, taskId } = await request.json();
  await dynamoDb.send(new DeleteCommand({
    TableName: awsConfig.tasksTable,
    Key: { userId, taskId },
  }));
  return NextResponse.json({ userId, taskId }, { status: 200 });
}

export async function PUT(request: Request) {
  const { userId, taskId, status } = await request.json();
  const now = new Date().toISOString();
  const result = await dynamoDb.send(new UpdateCommand({
    TableName: awsConfig.tasksTable,
    Key: { userId, taskId },
    UpdateExpression: 'set #status = :status, updatedAt = :updatedAt',
    ExpressionAttributeNames: { '#status': 'status' },
    ExpressionAttributeValues: { ':status': status, ':updatedAt': now },
    ReturnValues: 'ALL_NEW',
  }));
  return NextResponse.json(result.Attributes, { status: 200 });
}
