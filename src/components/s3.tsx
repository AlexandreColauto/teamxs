import AWS from "aws-sdk";

const S3_BUCKET = process.env.NEXT_PUBLIC_S3_BUCKET_NAME;
const REGION = process.env.NEXT_PUBLIC_AWS_REGION;

AWS.config.update({
  accessKeyId: process.env.NEXT_PUBLIC_ACCESSKEYID,
  secretAccessKey: process.env.NEXT_PUBLIC_SECRETACCESSKEY,
});

const s3 = new AWS.S3({
  params: { Bucket: S3_BUCKET },
  region: REGION,
});

export default s3;
