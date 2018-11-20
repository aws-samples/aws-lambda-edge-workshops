'use strict';

const http = require('https');
const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-10-08', region: 'us-east-1'});

// Copy DynamoDB table name here, for example, 'AlienCards-1201c610'
const ddbTableName = FIXME;

const indexTemplate = '/templates/index.html';

exports.handler = async (event) => {
    console.log('Event: ', JSON.stringify(event, null, 2));
    const cf = event.Records[0].cf;

    let response = '';
    try {
        // Get HTML template from the CloudFront cache
        // and data from the DynamoDB table
        const responses = await Promise.all([
            httpGet({ hostname: cf.config.distributionDomainName, path: indexTemplate }),
            ddbScan({ TableName: ddbTableName }),
        ]);

        const template = responses[0];
        const data = responses[1];

        const items = data.Items
              .sort((a, b) => { return (a.Likes > b.Likes) ? -1 : 1; });
        console.log('ddb sorted items: ' + JSON.stringify(items, null, 2));

        let html = template;
        for (let i = 0; i < items.length; i++) {
            const n = i + 1;
            html = html
                .replace(new RegExp(`{{id${n}}}`, "g"), items[i].CardId)
                .replace(new RegExp(`{{desc${n}}}`, "g"), items[i].Description)
                .replace(new RegExp(`{{likes${n}}}`, "g"), items[i].Likes);
        }

        response = {
            status: '200',
            headers: addSecurityHeaders({
                'content-type': [{ value: 'text/html;charset=UTF-8' }]
            }),
            body: html
        };
    } catch (error) {
        response = {
            status: '500',
            headers: addSecurityHeaders({
                'content-type': [{ value: 'application/json' }]
            }),
            body: JSON.stringify(error, null, 2)
        };
    }
    console.log('response: ' + JSON.stringify(response));
    return response;
};

function httpGet(params) {
    return new Promise((resolve, reject) => {
        http.get(params, (resp) => {
            console.log(`Fetching ${params.hostname}${params.path}, status code : ${resp.statusCode}`);
            let data = '';
            resp.on('data', (chunk) => { data += chunk; });
            resp.on('end', () => { resolve(data); });
        }).on('error', (err) => {
            console.log(`Couldn't fetch ${params.hostname}${params.path} : ${err.message}`);
            reject(err, null);
        });
    });
}

function ddbScan(params) {
    console.log('DynamoDB scan params: ' + JSON.stringify(params, null, 2));
    return ddb.scan(params).promise();
}

function addSecurityHeaders(headers) {
    headers['strict-transport-security'] = [{ value: 'max-age=31536000; includeSubDomains' }];
    headers['content-security-policy'] = [{ value: "default-src 'self'" }];
    headers['x-xss-protection'] = [{ value: '1; mode=block' }];
    headers['x-content-type-options'] = [{ value: 'nosniff' }];
    headers['x-frame-options'] = [{ value: 'DENY' }];
    return headers;
}
