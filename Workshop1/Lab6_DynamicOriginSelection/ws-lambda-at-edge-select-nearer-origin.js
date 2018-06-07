'use strict';

const regionToBucketMapping  =  {
    'us-west-2' : FIXME    // Copy S3 bucket name in us-west-2, for example, 'ws-lambda-at-edge-us-c0ea3af0'
};

const countryToRegionMapping  =  {
    'US': 'us-west-2',
    'CA': 'us-west-2'
};

let countryCode, region;

exports.handler = (event, context, callback) => {
    console.log('Event:', JSON.stringify(event, null, 2));
    const request = event.Records[0].cf.request;

    if (isViewerBelongsToNorthAmerica(request)) {
        updateS3Origin(request);
    }

    callback(null, request);
};

function isViewerBelongsToNorthAmerica(request) {
    let isViewerBelongsToNorthAmerica = false;

    // Get the viewer country code and nearer region
    if (request.headers['cloudfront-viewer-country']) {
        countryCode = request.headers['cloudfront-viewer-country'][0].value;
        region = countryToRegionMapping[countryCode];
    }

    if (countryCode && region) {
        isViewerBelongsToNorthAmerica = true;
    } else {
        console.log('Viewer country information is not available.');
    }

    return isViewerBelongsToNorthAmerica;
}

function updateS3Origin(request) {
    const bucketName = regionToBucketMapping[region];
    const domainName = `${bucketName}.s3.${region}.amazonaws.com`;

    // Set s3 origin fields
    request.origin = {
        s3: {
            authMethod: "none",
            domainName: domainName,
            region: region
        }
    };
    request.headers['host'] = [{ key: 'host', value: domainName }];
}