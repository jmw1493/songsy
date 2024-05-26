import { S3Handler } from "aws-lambda";

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
};

// songzy-files_BUCKET_NAME
