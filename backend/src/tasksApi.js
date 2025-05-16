require('dotenv').config();
const express = require('express');
const { DynamoDBClient, ScanCommand, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Load config from .env
const REGION     = process.env.AWS_REGION;
const TABLE_NAME = process.env.TASKS_TABLE;
const POOL_ID    = process.env.COGNITO_USER_POOL_ID;
const CLIENT_ID  = process.env.COGNITO_CLIENT_ID;

// Initialize DynamoDB client
const ddb = new DynamoDBClient({ region: REGION });

// Configure JWKS client to fetch Cognito public keys
const jwks = jwksClient({
  jwksUri: `https://cognito-idp.${REGION}.amazonaws.com/${POOL_ID}/.well-known/jwks.json`
});
function getKey(header, callback) {
  jwks.getSigningKey(header.kid, (err, key) => {
    callback(err, key && key.getPublicKey());
  });
}

// Middleware: verify JWT and extract username
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing token' });

  jwt.verify(token, getKey, {
    audience: CLIENT_ID,
    issuer:   `https://cognito-idp.${REGION}.amazonaws.com/${POOL_ID}`
  }, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.username = decoded.username;
    next();
  });
}

// GET /tasks -> list tasks owned by the authenticated user
app.get('/tasks', authMiddleware, async (req, res) => {
  const cmd = new ScanCommand({
    TableName: TABLE_NAME,
    FilterExpression: 'owner = :u',
    ExpressionAttributeValues: { ':u': { S: req.username } }
  });
  try {
    const data = await ddb.send(cmd);
    return res.json(data.Items || []);
  } catch (err) {
    return res.status(500).json({ error: 'Error scanning tasks', details: err.message });
  }
});

// POST /tasks -> create a new task
app.post('/tasks', authMiddleware, async (req, res) => {
  const { title, details } = req.body;
  if (!title) return res.status(400).json({ error: 'Missing title' });

  const taskId = Date.now().toString();
  const item = {
    id:      { S: taskId },
    owner:   { S: req.username },
    title:   { S: title },
    details: { S: details || '' }
  };

  try {
    await ddb.send(new PutItemCommand({ TableName: TABLE_NAME, Item: item }));
    return res.status(201).json({ taskId });
  } catch (err) {
    return res.status(500).json({ error: 'Error creating task', details: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Tasks API listening at http://localhost:${PORT}`));
