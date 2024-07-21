import {
  CreateBucketCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

export const uploadWithR2 = async (files: File[], productId: string) => {
  const s3Client = new S3Client({
    endpoint: process.env.R2_ENDPOINT,
    region: "auto",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
  });

  const bucketName = "kiys-product-images";

  // Check if bucket exists
  try {
    await s3Client.send(
      new HeadBucketCommand({
        Bucket: bucketName,
      })
    );
  } catch (error) {
    if (error instanceof Error && error.name === "NotFound") {
      await s3Client.send(
        new CreateBucketCommand({
          Bucket: bucketName,
        })
      );
    } else {
      throw error;
    }
  }

  const generateUniqueFileName = (originalFileName: string) => {
    const currentDate = new Date();

    const timestamp = currentDate
      .toISOString()
      .replace(/[-T:]/g, "")
      .slice(0, 14); // Generate timestamp in the format: '20240627T123045'
    const fileNameWithoutExtension = originalFileName.split(".")[0];
    const fileExtension = originalFileName.split(".").pop(); // Get the file extension

    const uniqueFileName = `${fileNameWithoutExtension}_${timestamp}.${fileExtension}`;

    return uniqueFileName;
  };

  const uploadPromises = files.map(async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const uniqueFileName = generateUniqueFileName(file.name);

    // Upload file to bucket
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: uniqueFileName,
        Body: Buffer.from(arrayBuffer),
        Metadata: {
          "x-amz-meta-product_id": productId,
        },
      })
    );

    const url = `${process.env.R2_STORAGE_PUBLIC_BUCKET_ACCESS_URL}/${uniqueFileName}`;

    // return {
    //   bucketName,
    //   fileName: uniqueFileName,
    //   url,
    // };

    return url;
  });

  const uploadResults = await Promise.all(uploadPromises);

  return uploadResults;
};
