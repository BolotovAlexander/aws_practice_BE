import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { UPLOAD_FOLDER, S3_BUCKET_NAME } from "../../../constants";

const uploadFile = async (fileName, fileContents) => {
    const signedUrlKey = UPLOAD_FOLDER + fileName;
  
    const putCommand = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: signedUrlKey,
      Body: fileContents, 
    });
  
    const s3Client = new S3Client({ region: 'eu-west-1' });
    const url = await getSignedUrl(s3Client, putCommand, { expiresIn: 20 });
  
    await s3Client.send(putCommand);
  
    return url;
  };

  const importProductsFile = async (event) => {
    const fileName = event.queryStringParameters.name;
    const fileContents = event.body;
  
    const url = await uploadFile(fileName, fileContents);
  
    return {
      statusCode: 200,
      body: url,
      headers: { 'Access-Control-Allow-Origin': '*' },
    };
  };

export const main = importProductsFile;