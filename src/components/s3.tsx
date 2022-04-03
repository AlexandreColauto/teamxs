import AWS from "aws-sdk";

const S3_BUCKET = "kittie-kat-rescue";
const REGION = "eu-west-3";

AWS.config.update({
  accessKeyId: process.env.NEXT_PUBLIC_ACCESSKEYID,
  secretAccessKey: process.env.NEXT_PUBLIC_SECRETACCESSKEY,
});

const s3 = new AWS.S3({
  params: { Bucket: S3_BUCKET },
  region: REGION,
});

export default s3;
