'use strict';

exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));
    const request = event.Records[0].cf.request;

    // Based on the value of the CloudFront-Is-Desktop-Viewer header,
    // we can re-write the URL to serve customized content.

    if (request.headers['cloudfront-is-desktop-viewer'] &&
        request.headers['cloudfront-is-desktop-viewer'][0].value !== 'true') {

        // it's not a desktop (it's  mobile, tablet or tv), use the mobile css
        request.uri = request.uri.replace(new RegExp('^/css/'),'/css/mobile/');
    }
    return request;
};
