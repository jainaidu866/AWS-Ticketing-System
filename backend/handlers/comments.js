const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, QueryCommand } = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");
const { success, error } = require("../utils/response");

const client = new DynamoDBClient({});
const db = DynamoDBDocumentClient.from(client);
const TABLE = "Comments";

// ADD COMMENT
exports.addComment = async (event) => {
  try {
    const { ticketId } = event.pathParameters;
    const body = JSON.parse(event.body);
    const claims = event.requestContext.authorizer.jwt.claims;

    const comment = {
      ticketId,
      commentId: uuidv4(),
      text: body.text,
      createdBy: claims.sub,
      createdByEmail: claims.email,
      createdAt: new Date().toISOString()
    };

    await db.send(new PutCommand({ TableName: TABLE, Item: comment }));
    return success(comment);
  } catch (err) {
    return error(500, err.message);
  }
};

// GET COMMENTS
exports.getComments = async (event) => {
  try {
    const { ticketId } = event.pathParameters;

    const result = await db.send(new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: "ticketId = :ticketId",
      ExpressionAttributeValues: { ":ticketId": ticketId }
    }));

    const items = result.Items.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    return success(items);
  } catch (err) {
    return error(500, err.message);
  }
};