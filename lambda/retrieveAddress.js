// TODO: Could convert this into TypeScript and have it automatically built before deploying.
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, QueryCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
    const userID = event.pathParameters.userID;
    const { suburb, postcode } = event.queryStringParameters || {};

    const params = {
        TableName: process.env.TABLE_NAME,
        KeyConditionExpression: "userID = :userID",
        ExpressionAttributeValues: {
            ":userID": userID,
        },
    };

    try {
        const result = await docClient.send(new QueryCommand(params));
        let addresses = result.Items;

        if (suburb) {
            addresses = addresses.filter(addr => addr.suburb === suburb);
        }
        if (postcode) {
            addresses = addresses.filter(addr => addr.postcode === postcode);
        }

        return {
            // TODO: Format return in human-readable format or based org requirements
            statusCode: 200,
            body: JSON.stringify(addresses.length > 0 ? addresses : { message: 'No addresses found' }),
        };
    } catch (error) {
        console.error('Error fetching addresses:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error fetching addresses', error: error.message }),
        };
    }
};
