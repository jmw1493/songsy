import { S3Handler } from "aws-lambda";
import AWS from "aws-sdk";
import sharp from "sharp";

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
      const imageBuffer = s3Object.Body as Buffer;
      // Compress the image
      const compressedImageBuffer = await sharp(imageBuffer)
        .resize({ width: 800 }) // Resize to 800px width, change as needed
        .jpeg({ quality: 80 }) // Adjust JPEG quality, change as needed
        .toBuffer();
      console.log(compressedImageBuffer);

      // Upload the compressed image back to S3
      await s3
        .putObject({
          Bucket: bucketName,
          Key: key,
          Body: compressedImageBuffer,
          ContentType: s3Object.ContentType,
        })
        .promise();

      console.log(`Successfully compressed and uploaded image ${key}`);
    } catch (e) {
      console.error(`Failed to process image ${key}:`, e);
    }
  }
};

// songzy-files_BUCKET_NAME
