const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand, ScanCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");
const { success, error } = require("../utils/response");

const client = new DynamoDBClient({});
const db = DynamoDBDocumentClient.from(client);
const TABLE = "Tickets";

// CREATE TICKET
exports.createTicket = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const claims = event.requestContext.authorizer.jwt.claims;
    const userId = claims.sub;
    const userEmail = claims.email;

    const ticket = {
      ticketId: uuidv4(),
      title: body.title,
      description: body.description,
      priority: body.priority || "Medium",
      category: body.category || "General",
      status: "Open",
      createdBy: userId,
      createdByEmail: userEmail,
      assignee: null,
      attachmentUrl: body.attachmentUrl || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await db.send(new PutCommand({ TableName: TABLE, Item: ticket }));
    return success(ticket);
  } catch (err) {
    return error(500, err.message);
  }
};

// LIST TICKETS
exports.listTickets = async (event) => {
  try {
    const claims = event.requestContext.authorizer.jwt.claims;
    const userId = claims.sub;
    const groups = claims["cognito:groups"] || [];
    const isAgent = groups.includes("Agent");

    const params = { TableName: TABLE };
    const result = await db.send(new ScanCommand(params));
    let items = result.Items;

    // Customers see only their tickets
    if (!isAgent) {
      items = items.filter(t => t.createdBy === userId);
    }

    // Filter by status if provided
    const { status, priority } = event.queryStringParameters || {};
    if (status) items = items.filter(t => t.status === status);
    if (priority) items = items.filter(t => t.priority === priority);

    // Sort newest first
    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return success(items);
  } catch (err) {
    return error(500, err.message);
  }
};

// GET SINGLE TICKET
exports.getTicket = async (event) => {
  try {
    const { ticketId } = event.pathParameters;
    const result = await db.send(new GetCommand({ TableName: TABLE, Key: { ticketId } }));
    if (!result.Item) return error(404, "Ticket not found");
    return success(result.Item);
  } catch (err) {
    return error(500, err.message);
  }
};

// UPDATE TICKET
exports.updateTicket = async (event) => {
  try {
    const { ticketId } = event.pathParameters;
    const body = JSON.parse(event.body);

    const result = await db.send(new UpdateCommand({
      TableName: TABLE,
      Key: { ticketId },
      UpdateExpression: "set #status = :status, assignee = :assignee, updatedAt = :updatedAt",
      ExpressionAttributeNames: { "#status": "status" },
      ExpressionAttributeValues: {
        ":status": body.status,
        ":assignee": body.assignee || null,
        ":updatedAt": new Date().toISOString()
      },
      ReturnValues: "ALL_NEW"
    }));

    return success(result.Attributes);
  } catch (err) {
    return error(500, err.message);
  }
};