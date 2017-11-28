# Supercharge your website with Lambda@Edge

## Overview

In this workshop you will learn how you can use Lambda@Edge to extend functionality of your web-application or a website.

**Backstory**: Aliens have arrived. Humanity cannot communicate with them because we do not speak a common language. However, the aliens are curious and willing to learn the language by looking at beautiful images with short text descriptions. Let's build a website to help the aliens learn our language using simple learning cards!

The workshop will demonstrate the usage of the following AWS services:
* **Amazon S3**: the website's static files will be stored in an S3 bucket
* **Amazon DynamoDB**: the dynamic data will be stored in a DynamoDB table
* **Amazon CloudFront**: the fast and secure content delivery will performed by a CloudFront distribution
* **AWS Lambda@Edge**: the dynamic content generation and content customization will be driven by Lambda@Edge functions

Here is how the website looks like at the beginning of the workshop:  
https://d3c0w2j5uywzfw.cloudfront.net

Here is how the website will look like at the end of the workshop with all labs completed:  
https://d3c0w2j5uywzfw.cloudfront.net

## Lab 0 - Launch the Stack

To start the workshop, launch the CloudFormation stack to bootstrap the resources in the us-east-1 (N.Virginia) region.

Click the launch stack button below to kick it off, accept all default values and wait for CloudFormation to complete the creation of the stack.

Region | Button
------------ | -------------
us-east-1 | [![Launch stack in us-east-1](https://s3.amazonaws.com/cloudformation-examples/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new?stackName=WsLambdaAtEdgeAlienCards&templateURL=https://s3.amazonaws.com/ws-lambda-at-edge/bootstrap/cfn-template.json)

Need more detailed instructions? Proceed to  
[Lab 0 - Launch the stack (steps with screenshots)](./Lab0_LaunchTheStack/README.md)

## Lab 1 - Security

Security is always the top priority.

Learn how to check and improve website security by configuring HTTP to HTTPs redirect and adding standard security headers to enforce HTTPS connection is always used by the client and prevent XSS.

[Lab 1 - Security headers](./Lab1_Security/README.md)

## Lab 2 - Content Generation

Learn how to create a Lambda function that dynamically generates HTML content which can be cached by CloudFront and returned back to your viewers.

[Lab 2 - Content generation](./Lab2_ContentGeneration/README.md)

## Lab 3 - Simple API

Learn how you can use Lambda@Edge to implement a simple API that accepts POST requests from the viewers and modifies the web application state in a DynamoDB table.

[Lab 3 - Simple API](./Lab3_SimpleAPI/README.md)

## Lab 4 - Pretty URLs

Use Lambda@Edge to introduce pretty semantic URLs to your web application. Pretty URLs are easy to read and remember, they also help with search engine optimization and allow your viewers to use the descriptive links in social media.

[Lab 4 - Pretty URLs](./Lab4_PrettyUrls/README.md)

## Lab 5 - Customization

Learn how to serve content customized for the device type of a viewer.

[Lab 5 - Customization](./Lab5_Customization/README.md)

## Cleanup

1. Delete all files from the S3 bucket `ws-lambda-at-edge-<unique_id>` created by CloudFormation stack for this workshop.
1. Delete the CloudFormation stack named `WsLambdaAtEdgeAlienCards`.
