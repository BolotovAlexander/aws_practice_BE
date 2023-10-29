import {
    SNSClient,
    PublishCommand
} from '@aws-sdk/client-sns'
import { createProduct } from '..'

const snsClient = new SNSClient({
    region: 'eu-west-1'
})

const catalogBatchProcess = async (event) => {
    const data = event.Records.map(({body}) => JSON.parse(body))
    console.log('Receive create products request with data: ', data)

    const createRequests = data.map((product) => createProduct(product))

    console.log('createRequests', createRequests)
    try {
        console.log(`Attempt to create ${createRequests.length} products`)
        await Promise.all(createRequests)
        console.log('Products are created')

        const snsPublishCommand = new PublishCommand({
            TopicArn: process.env.SNS_ARN,
            Message: `${createRequests.length} products are created`
        })

        await snsClient.send(snsPublishCommand)
    } catch (e) {
        console.log('Error occurs while creating products, e: ', e)
    }


}

export const main = catalogBatchProcess