import { S3Handler } from "aws-lambda";
import AWS from "aws-sdk";
import Jimp from "jimp";
import jo from "jpeg-autorotate";

const s3 = new AWS.S3();
const bucketName = process.env.SONGZY_FILES_BUCKET_NAME ?? "";

export const handler: S3Handler = async (event) => {
  const imageMimeType = /^image\//;

  const uploadedFilesContainImage = event.Records.some((record) => {
    return imageMimeType.test(record.s3.object.key);
  });

  if (!uploadedFilesContainImage) {
    console.log("No images");
    // If the file is not an image, do nothing
    return;
  }

  console.log("yes images");

  for (const record of event.Records) {
    const key = record.s3.object.key;
    if (!imageMimeType.test(key)) {
      continue;
    }
    try {
      const s3Object = await s3
        .getObject({ Bucket: bucketName, Key: key })
        .promise();

      const objectMetadata = s3Object.Metadata;
      if (objectMetadata && objectMetadata["compressed"]) {
        console.log(`Image ${key} is already compressed.`);
        continue;
      }

      const imageBuffer = s3Object.Body as Buffer;

      const rotatedProperly = await jo.rotate(imageBuffer, {});
      console.log(`rotated`);

      // Compress the image
      const image = await Jimp.read(rotatedProperly.buffer);

      // Ensure correct orientation using EXIF data
      image.rotate(0); // This corrects the orientation based on EXIF data

      // Resize the image, making sure not to upscale
      if (image.getWidth() > 300) {
        image.resize(300, Jimp.AUTO);
      }

      image.quality(80); // Adjust JPEG quality

      const compressedImageBuffer = await image.getBufferAsync(Jimp.MIME_JPEG);

      // Upload the compressed image back to S3
      await s3
        .putObject({
          Bucket: bucketName,
          Key: key,
          Body: compressedImageBuffer,
          ContentType: s3Object.ContentType,
          Metadata: {
            compressed: "true",
          },
        })
        .promise();

      console.log(`Successfully compressed and uploaded image ${key}`);
    } catch (e) {
      console.error(`Failed to process image ${key}:`, e);
    }
  }
};
