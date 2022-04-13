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
s3.middlewareStack.add(
  (next) => async (args) => {
    delete args.request.headers["content-type"];
    return next(args);
  },
  { step: "build" }
);

export default s3;
