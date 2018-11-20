'use strict';

exports.handler = async (event) => {
    console.log('Event: ', JSON.stringify(event, null, 2));
    let request = event.Records[0].cf.request;

    // You can also use DynamoDB or S3 to store the redirect map
    // For demo purposes, we simply hardcode it here

    const redirects = {
        '/r/music':    '/card/bcbd2481',
        '/r/tree':     '/card/da8398f4',
        '/r/food':     '/card/e51c848c',
        '/r/computer': '/card/fe2f80a7',
        '/r/cat':      '/card/k9b430fc',
        '/r/beer':     '/card/vc7efa69',
    };

    if (redirects[request.uri]) {
        // generate 302 redirect response
        return {
            status: '302',
            statusDescription: 'Found',
            headers: {
                'location': [{ value: redirects[request.uri] }]
            }
        };
    }
    // pass through the request unchanged
    return request;
};
