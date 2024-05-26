import { S3Handler } from "aws-lambda";
import AWS from "aws-sdk";

const s3 = new AWS.S3();
const bucketName = process.env.SONGZY_FILES_BUCKET_NAME ?? "";

export const handler: S3Handler = async (event) => {
  const imageMimeType = /^image\//;

  const objectKeys = event.Records.map((record) => record.s3.object.key);
  console.log(`Upload handler invoked for objects [${objectKeys.join(", ")}]`);

  const uploadedFilesContainImage = event.Records.some((record) => {
    return imageMimeType.test(record.s3.object.key);
  });

  if (!uploadedFilesContainImage) {
    console.log("No images");
    // If the file is not an image, do nothing
    return;
  }

  console.log("Yes images");
  console.log("bucket name", bucketName);

  for (const record of event.Records) {
    const key = record.s3.object.key;
    if (!imageMimeType.test(key)) {
      console.log(`File ${key} is not an image, skipping...`);
      continue;
    }
    try {
      const s3Object = await s3
        .getObject({ Bucket: bucketName, Key: key })
        .promise();
      console.log("s3Object", s3Object);
    } catch (e) {
      console.error(e);
    }
  }
};

// songzy-files_BUCKET_NAME
