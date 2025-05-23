import { NextResponse } from 'next/server';
import { awsConfig, s3, dynamoDb } from '@/lib/aws-config';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const { Item } = await dynamoDb
    .get({
      TableName: awsConfig.tasksTable,
      Key: { userId: 'test-user-1', taskId: id },
      ProjectionExpression: 'attachments',
    })
    .promise();
  return NextResponse.json(Item?.attachments || []);
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const formData = await request.formData();
  const file = formData.get('file') as File;
  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const key = `${id}/${Date.now()}_${file.name}`;
  // Upload without ACL (bucket owner enforced) using putObject
  await s3
    .putObject({
      Bucket: awsConfig.attachmentsBucket,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    })
    .promise();
  const url = `https://${awsConfig.attachmentsBucket}.s3.${awsConfig.region}.amazonaws.com/${key}`;
  await dynamoDb
    .update({
      TableName: awsConfig.tasksTable,
      Key: { userId: 'test-user-1', taskId: id },
      UpdateExpression: 'SET attachments = list_append(if_not_exists(attachments, :empty_list), :attachment)',
      ExpressionAttributeValues: { ':empty_list': [], ':attachment': [url] },
    })
    .promise();
  return NextResponse.json({ url }, { status: 201 });
}