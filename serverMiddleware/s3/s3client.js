// Create service client module using ES6 syntax.
import { S3Client } from '@aws-sdk/client-s3'

const sourceCredentials = {
  accessKeyId: process.env.YB_SOURCE_ACCESS,
  secretAccessKey: process.env.YB_SOURCE_SECRET
}

const destCredentials = {
  accessKeyId: process.env.YB_DEST_ACCESS,
  secretAccessKey: process.env.YB_DEST_SECRET
}

const sourceBucketParams = {
  Region: process.env.YB_SOURCE_REGION,
  Bucket: process.env.YB_SOURCE_BUCKET,
  Prefix: process.env.YB_SOURCE_PREFIX || ''
}
const destBucketParams = {
  Region: process.env.YB_DEST_REGION,
  Bucket: process.env.YB_DEST_BUCKET,
  Prefix: process.env.YB_DEST_PREFIX || ''
}

// Create an Amazon S3 service client object.
const sourceClient = new S3Client({
  region: sourceBucketParams.Region,
  credentials: sourceCredentials
})

const destClient = new S3Client({
  region: destBucketParams.Region,
  credentials: destCredentials
})

// sanity check
if (destBucketParams.Bucket === sourceBucketParams.Bucket) {
  throw new Error(`s3client: Destination bucket MUST be different from source bucket. Both source and dest were: ${sourceBucketParams.Bucket}`)
}

export {
  sourceBucketParams, destBucketParams, sourceClient, destClient
}
