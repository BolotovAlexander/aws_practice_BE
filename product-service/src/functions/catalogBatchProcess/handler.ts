import { SNS } from '@aws-sdk/client-sns'
import { main as createProduct } from '@functions/createProduct/handler'

export const catalogBatchProcess = async (event) => {
    console.log('catalogBatchProcess called!')

    const products = event.Records

    console.log('products', products)

    if (!products || !products?.length) throw new Error('No records found!');

    try {
        for (const product of products) {

            console.log('Trying to add product: ',product)

            //const data = JSON.stringify(product)
            // await createProduct({ body: data })
            await createProduct({ body: product.body })

            const sns = new SNS()

            const productBody = JSON.parse(product.body)

            const message = {
                Subject: `Product "${productBody.Title}" was added to DB of the "Electric tools shop"`,
                Message: product.body,
                TopicArn: process.env.SNS_ARN,
            }
            await sns.publish(message)

            console.log('Product was added',product)

        }
    } catch (error) {
        console.log('Error:', error)
    }
}

export const main = catalogBatchProcess