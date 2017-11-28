'use strict';

exports.handler = (event, context, callback) => {
    console.log('Event: ', JSON.stringify(event, null, 2));
    console.log('Context: ', JSON.stringify(context, null, 2));
    const request = event.Records[0].cf.request;

    // You can also store and read the redirect map
    // in DynamoDB or S3, for example.

    const redirects = {
        '/r/music':    '/card/bcbd2481',
        '/r/tree':     '/card/da8398f4',
        '/r/food':     '/card/e51c848c',
        '/r/computer': '/card/fe2f80a7',
        '/r/cat':      '/card/k9b430fc',
        '/r/beer':     '/card/vc7efa69',
    };

    if (redirects[request.uri]) {
        return callback(null, {
            status: '302',
            statusDescription: 'Found',
            headers: {
                'location': [{ 
                    key: 'Location',
                    value: redirects[request.uri] }]
            }
        });
    }

    callback(null, request);
};
