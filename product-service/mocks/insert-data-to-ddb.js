import { v4 as uuidv4 } from 'uuid'
import { productsMock } from './products.js'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import { fromIni } from '@aws-sdk/credential-providers'

//TO CHECK SCRIPT please specify "type": "module" in package.json and change credentials profile to yours

const client = new DynamoDBClient({
    region: 'eu-west-1',
    credentials: fromIni({
        profile: 'aws_bolotov',
    }),
})
const docClient = DynamoDBDocumentClient.from(client)

const productsWithUniqueID = productsMock.map((product) => ({
    ...product,
    id: uuidv4(),
}))
const products = productsWithUniqueID.map((product) => ({
    id: product.id,
    title: product.title,
    description: product.description,
    price: Number(product.price),
    imgUrl: product.imgUrl,
}))
const stocks = productsWithUniqueID.map((product) => ({
    product_id: product.id,
    count: product.count,
}))

const insertData = async (params, tableName) => {
    const command = new PutCommand({
        TableName: tableName,
        Item: params,
    })
    try {
        await docClient.send(command)
        console.log('Success', params)
    } catch (error) {
        console.log('Error', error)
    }
}

// Insert products data
await Promise.all(
    products.map(async (product) => {
        await insertData(product, 'products')
    })
)

// Insert stocks data
await Promise.all(
    stocks.map(async (stock) => {
        await insertData(stock, 'products_stock')
    })
)