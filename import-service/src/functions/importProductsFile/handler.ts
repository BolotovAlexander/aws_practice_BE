import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { UPLOAD_FOLDER, S3_BUCKET_NAME } from "../../../constants";

const uploadFile = async (fileName, fileContents) => {
  
  const putCommand = new PutObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: UPLOAD_FOLDER + fileName,
    Body: fileContents, 
  });
  
  console.log('creating Signed Url with params:', putCommand)

  try {
    const s3Client = new S3Client({ region: 'eu-west-1' });
    const url = await getSignedUrl(s3Client, putCommand, { expiresIn: 20 });

   
    await s3Client.send(putCommand);

    return url;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw error;
  }
};

const importProductsFile = async (event) => {
  const fileName = event.queryStringParameters.name;
  const fileContents = event.body;
  
  if(fileContents) {
    console.log('fileContents',fileContents)
    try {
      const url = await uploadFile(fileName, fileContents);

      return {
        statusCode: 200,
        body: url,
        headers: { 'Access-Control-Allow-Origin': '*' },
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'File download error' }),
        headers: { 'Access-Control-Allow-Origin': '*' },
      };
    }
  } else {
    console.log('fileContents is empty');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'File download error' }),
      headers: { 'Access-Control-Allow-Origin': '*' },
    }
  }
};

export const main = importProductsFile;
