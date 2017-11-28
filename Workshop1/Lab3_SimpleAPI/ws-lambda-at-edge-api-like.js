'use strict';

const QS = require('querystring');
const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-10-08', region: 'us-east-1'});

const ddbTableName = FIXME; // Copy DynamoDB table name here, for example, 'AlienCards-1201c610'

exports.handler = (event, context, callback) => {
    console.log('Event: ', JSON.stringify(event, null, 2));
    console.log('Context: ', JSON.stringify(context, null, 2));
    const request = event.Records[0].cf.request;
    const params = QS.parse(request.querystring);
    
    if (request.method != 'POST')
        return callback(null, getResponse(
            { status: '400', body: { error: "Bad HTTP verb, expected POST" } }));

    if (!params.id)
        return callback(null, getResponse(
            { status: '400', body: { error: "Couldn't parse id parameter" } }));

    ddb.update({
        TableName: ddbTableName,
        ReturnValues: "ALL_NEW",
        UpdateExpression: "SET Likes = Likes + :one",
        ExpressionAttributeValues: { ":one": 1 },
        Key: { CardId: params.id }
    }, (err, data) => {
        console.log('err: ' + JSON.stringify(err));
        console.log('data: ' + JSON.stringify(data));
        if (err)
            return callback(null, getResponse({ status: '500', body: err }));
        else
            return callback(null, getResponse({ status: '200', body: data.Attributes }));
    });
};

function getResponse(resp) {
    const desc = { '200': 'OK', '400': 'Bad Request', '500': 'Internal Server Error' };
    return {
        status: resp.status,
        statusDescription: desc[resp.status],
        headers: addSecurityHeaders({
            'content-type': [{ key: 'Content-Type',  value: 'application/json' }]
        }),
        body: JSON.stringify(resp.body, null, 2)
    };
}

function addSecurityHeaders(headers) {
    headers['strict-transport-security'] = [{
        key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains'
    }];
    headers['content-security-policy'] = [{
        key: 'Content-Security-Policy', value: "default-src 'self'"
    }];
    headers['x-xss-protection'] = [{
        key: 'X-XSS-Protection', value: '1; mode=block'
    }];
    headers['x-content-type-options'] = [{
        key: 'X-Content-Type-Options', value: 'nosniff'
    }];
    headers['x-frame-options'] = [{
        key: 'X-Frame-Options', value: 'DENY'
    }];
    return headers;
}
