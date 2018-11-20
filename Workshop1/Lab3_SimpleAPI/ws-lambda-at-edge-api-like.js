'use strict';

const QS = require('querystring');
const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-10-08', region: 'us-east-1'});

// Copy your DynamoDB table name here, for example, 'AlienCards-1201c610'
const ddbTableName = FIXME;

exports.handler = async (event) => {

    console.log('Event: ', JSON.stringify(event, null, 2));
    const request = event.Records[0].cf.request;
    const params = QS.parse(request.querystring);
    
    if (request.method != 'POST') {
        return getResponse({
            status: '400', body: { error: "Bad HTTP verb, expecting POST" }
        });
    }
    if (!params.id) {
        return getResponse({
            status: '400', body: { error: "Couldn't parse id parameter" }
        });
    }

    try {
        let data = await ddb.update({
            TableName: ddbTableName,
            ReturnValues: "ALL_NEW",
            UpdateExpression: "SET Likes = Likes + :one",
            ExpressionAttributeValues: { ":one": 1 },
            Key: { CardId: params.id }
        }).promise();

        return getResponse({ status: '200', body: data.Attributes });
    } catch (err) {
        return getResponse({ status: '500', body: { error: err } });
    }
};

function getResponse(resp) {
    const response = {
        status: resp.status,
        headers: addSecurityHeaders({
            'content-type': [{ value: 'application/json' }]
        }),
        body: JSON.stringify(resp.body, null, 2)
    };
    console.log('response: ' + JSON.stringify(response));
    return response;
}

function addSecurityHeaders(headers) {
    headers['strict-transport-security'] = [{ value: 'max-age=31536000; includeSubDomains' }];
    headers['content-security-policy'] = [{ value: "default-src 'self'" }];
    headers['x-xss-protection'] = [{ value: '1; mode=block' }];
    headers['x-content-type-options'] = [{ value: 'nosniff' }];
    headers['x-frame-options'] = [{ value: 'DENY' }];
    return headers;
}
