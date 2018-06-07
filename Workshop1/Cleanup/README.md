## Cleanup

1. Delete DynamoDB table `AlienCards-<unique_id>`  in "EU (Frankfurt)" region.
2. Disable replication for S3 bucket `ws-lambda-at-edge-us-<unique_id>`. Open bucket, go to `Management` > `Replication` and select the only entry and click `Delete`.
3. Delete all versions of all files from S3 bucket `ws-lambda-at-edge-us-<unique_id>` by clicking on `Show` for versions and selecting all files to delete.
4. Delete all versions of all files from S3 bucket `ws-lambda-at-edge-eu-<unique_id>` by clicking on `Show` for versions and selecting all files to delete.
5. Delete the CloudFormation stack named `WsLambdaAtEdgeAlienCards` in "US West (Oregon)" region.