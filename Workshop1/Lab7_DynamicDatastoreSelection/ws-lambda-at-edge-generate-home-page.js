'use strict';

const http = require('https');
const AWS = require('aws-sdk');
const ddbEU = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-10-08', region: 'eu-central-1'});
const ddbUS = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-10-08', region: 'us-west-2'});
let ddb = ddbEU;

const ddbTableName = FIXME; // Copy DynamoDB table name here, for example, 'AlienCards-1201c610'
const cfDomainName = FIXME; // Copy CloudFront domain name here, for example, 'd1dienny4yhppe.cloudfront.net';
const pathIndxTmpl = '/templates/index.html';
const countryToRegionMapping  =  {
    'US': 'us-west-2',
    'CA': 'us-west-2'
};

exports.handler = (event, context, callback) => {
    console.log('Event: ', JSON.stringify(event, null, 2));
    console.log('Context: ', JSON.stringify(context, null, 2));
    const request = event.Records[0].cf.request;

    updateDynamoDbClientRegion(request);

    // Get HTML template from the CloudFront cache
    // and data from the DynamoDB table
    Promise.all([
        httpGet({ hostname: cfDomainName, path: pathIndxTmpl }),
        ddbScan({ TableName: ddbTableName }),
    ])
    .then(responses => {
        const tmpl = responses[0];
        const data = responses[1];

        let html = tmpl;
        for (let i = 0; i < data.length; i++) {
            const n = i + 1;
            html = html
                .replace(new RegExp(`{{id${n}}}`, "g"), data[i].CardId)
                .replace(new RegExp(`{{desc${n}}}`, "g"), data[i].Description)
                .replace(new RegExp(`{{likes${n}}}`, "g"), data[i].Likes);
        }

        callback(null, getResponseOK(html));
    })
    .catch(error => {
        callback(null, getResponseError(error));
    });
};

function updateDynamoDbClientRegion(request) {
    let region;

    // Check if viewer country header is available
    if (request.headers['cloudfront-viewer-country']) {
        const countryCode = request.headers['cloudfront-viewer-country'][0].value;
        region = countryToRegionMapping[countryCode];
    }

    // Update DynamoDB client with nearer region 
    if (region) {
        ddb = ddbUS;
    }
}

function getResponseOK(html) {
    return {
        status: '200',
        statusDescription: 'OK',
        headers: addSecurityHeaders({
            'content-type': [{ key: 'Content-Type',  value: 'text/html;charset=UTF-8' }]
        }),
        body: html
    };
}

function getResponseError(error) {
    return {
        status: '500',
        statusDescription: 'Internal Server Error',
        headers: addSecurityHeaders({
            'content-type': [{ key: 'Content-Type',  value: 'application/json' }]
        }),
        body: JSON.stringify(error, null, 2)
    };
}

function httpGet(params) {
    console.log(`Fetching ${params.hostname}${params.path}`);
    return new Promise((resolve, reject) => {
        http.get(params, (resp) => {
            console.log('Response status code:: ' + resp.statusCode);
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
    console.log('DDB scan params: ' + JSON.stringify(params, null, 2));
    return new Promise((resolve, reject) =>
        ddb.scan(params, (err, data) => {
            if (err) {
                console.log('ddb err: ' + JSON.stringify(err, null, 2));
                reject(err);
            } else {
                console.log('ddb data: ' + JSON.stringify(data, null, 2));
                const items = data.Items
                    .sort((a, b) => { return (a.Likes > b.Likes) ? -1 : 1; });
                console.log('ddb sorted items: ' + JSON.stringify(items, null, 2));
                resolve(items);
            }
        })
    );
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
