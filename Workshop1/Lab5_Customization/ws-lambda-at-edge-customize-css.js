'use strict';

exports.handler = (event, context, callback) => {
    console.log('Event:', JSON.stringify(event, null, 2));
    const request = event.Records[0].cf.request;

    /**
     * Based on the value of the CloudFront-Is-Desktop-Viewer header, 
     * we can re-write the URL to serve customized content.
     */

     if (request.headers['cloudfront-is-desktop-viewer']) {
        const isDesktopViewer = request.headers['cloudfront-is-desktop-viewer'][0].value;
        if (isDesktopViewer !== 'true') {
            request.uri = request.uri.replace(new RegExp('^/css/'),'/css/mobile/');
        }
     } 
     
    callback(null, request);
};