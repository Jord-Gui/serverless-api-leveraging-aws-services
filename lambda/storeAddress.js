// TODO: Could convert this into TypeScript and have it automatically built before deploying.
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb")

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
    // TODO: Add input validation and sanitization
    const userID = event.pathParameters.userID;
    const addressID = new Date().toISOString();
    const { street, suburb, postcode } = JSON.parse(event.body);

    const params = {
        TableName: process.env.TABLE_NAME,
        Item: {
            userID,
            addressID,
            street,
            suburb,
            postcode
        }
    };

    try {
        // TODO: Handle duplicate addresses
        await docClient.send(new PutCommand(params));
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Address saved successfully' })
        };
    }
    catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error saving address', error: error.message })
        };
    }
};
