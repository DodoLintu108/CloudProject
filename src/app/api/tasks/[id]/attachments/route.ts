import { NextRequest, NextResponse } from 'next/server';
import { awsConfig, s3, dynamoDb } from '@/lib/aws-config';
import { GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const { Item } = await dynamoDb.send(new GetCommand({
    TableName: awsConfig.tasksTable,
    Key: { userId: 'test-user-1', taskId: id },
    ProjectionExpression: 'attachments',
  }));
  return NextResponse.json(Item?.attachments || []);
}

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const formData = await request.formData();
  const file = formData.get('file') as File;
  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);  const key = `${id}/${Date.now()}_${file.name}`;
  // Upload without ACL (bucket owner enforced) using putObject
  await s3.send(new PutObjectCommand({
    Bucket: awsConfig.attachmentsBucket,
    Key: key,
    Body: buffer,
    ContentType: file.type,
  }));
  const url = `https://${awsConfig.attachmentsBucket}.s3.${awsConfig.region}.amazonaws.com/${key}`;
  await dynamoDb.send(new UpdateCommand({
    TableName: awsConfig.tasksTable,
    Key: { userId: 'test-user-1', taskId: id },
    UpdateExpression: 'SET attachments = list_append(if_not_exists(attachments, :empty_list), :attachment)',
    ExpressionAttributeValues: { ':empty_list': [], ':attachment': [url] },
  }));
  return NextResponse.json({ url }, { status: 201 });
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { url } = await request.json();  // Derive S3 object key from URL
  const key = new URL(url).pathname.slice(1);
  await s3.send(new DeleteObjectCommand({ Bucket: awsConfig.attachmentsBucket, Key: key }));
  // Fetch current attachments
  const { Item } = await dynamoDb.send(new GetCommand({
    TableName: awsConfig.tasksTable,
    Key: { userId: 'test-user-1', taskId: id },
    ProjectionExpression: 'attachments',
  }));
  const attachments: string[] = Item?.attachments || [];
  const newAttachments = attachments.filter(a => a !== url);
  await dynamoDb.send(new UpdateCommand({
    TableName: awsConfig.tasksTable,
    Key: { userId: 'test-user-1', taskId: id },
    UpdateExpression: 'SET attachments = :attachments',
    ExpressionAttributeValues: { ':attachments': newAttachments },
  }));
  return NextResponse.json({ attachments: newAttachments });
}