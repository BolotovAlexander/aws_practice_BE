import { 
    GetObjectCommand, 
    S3Client,
    DeleteObjectCommand,
    PutObjectCommand
} from "@aws-sdk/client-s3";
import csv from 'csv-parser'
import { UPLOAD_FOLDER } from "../../../constants";

const parser = csv({separator: ','});
const s3Client = new S3Client({ region: 'eu-west-1' });

const importFileParser: any = async (event) => {
    const {
        bucket: { 
            name: bucketName 
        },
        object: {
            key
        }
    } = event.Records[0].s3;

    const getCommand = new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
    });

    try {
        console.log('Receiving reading stream from S3');

        const stream = await s3Client.send(getCommand);

        console.log('Stream Received');

        const jsonData = [];

        stream.Body.pipe(parser)
            .on('data', (data) => {
                jsonData.push(data);
            })
            .on('end', async () => {
                const jsonContent = JSON.stringify(jsonData);

                const newKey = key.replace(UPLOAD_FOLDER, 'parsed/') + '_parsed.json';

                const putCommand = new PutObjectCommand({
                    Bucket: bucketName,
                    Key: newKey,
                    Body: jsonContent,
                });

                console.log(`Saving processed data to ${newKey}`);

                try {
                    await s3Client.send(putCommand);
                } catch (error) {
                    console.log('Error saving processed data:', error);
                }

                const deleteCommand = new DeleteObjectCommand({
                    Bucket: bucketName,
                    Key: key,
                });

                console.log(`Deleting the original file from ${UPLOAD_FOLDER}`);

                try {
                    await s3Client.send(deleteCommand);
                } catch (error) {
                    console.log('Error deleting the original file:', error);
                }
            });
    } catch (e) {
        console.log('An Error occurs: ', e);
    }
};

export const main = importFileParser;

