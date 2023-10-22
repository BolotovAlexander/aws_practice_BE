import { 
    GetObjectCommand, 
    S3Client, 
    CopyObjectCommand, 
    DeleteObjectCommand
} from "@aws-sdk/client-s3"
import csv from 'csv-parser'
import { UPLOAD_FOLDER } from "../../../constants";


const parser = csv({
    separator: ',',
})

parser.on('data', (data) => {
    console.log(data)
})
const s3Client = new S3Client({region: 'eu-west-1'})

const importFileParser: any = async (event) => {

    const {
        bucket: { 
            name: bucketName 
        },
        object: {
            key
        }
    } = event.Records[0].s3

    const getCommand = new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
    })

    try{
        console.log('Receiving reading stream from S3')
        const stream = await s3Client.send(getCommand)

        console.log('Stream Received')
        stream.Body.pipe(parser)
    } catch (e) {
        console.log('An Error occurs: ', e)
    }

    try {
        const copyCommand = new CopyObjectCommand({
            Bucket: bucketName,
            CopySource: bucketName + '/' + key,
            Key: key.replace(UPLOAD_FOLDER, 'parsed/')
        })

        console.log(`Attempt to copy ${key}, file`)

        await s3Client.send(copyCommand)

        console.log(`${key} file copied`)

        const deleteCommand = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: key
        })

        console.log(`Attempt to delete ${key}, file from /uploaded`)

        await s3Client.send(deleteCommand)

        console.log(`${key} file deleted`)
    } catch (e) {
        console.log('Something went wrong', e)
    }
}

export const main = importFileParser;