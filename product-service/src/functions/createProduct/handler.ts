import { ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from '@libs/api-gateway'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
    DynamoDBDocumentClient,
    PutCommand,
} from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid'

const client = new DynamoDBClient()
const docClient = DynamoDBDocumentClient.from(client, {
    marshallOptions: {
        removeUndefinedValues: true,
    },
})

const updateProductsTable = async (params) => {
    const command = new PutCommand({
        TableName: process.env.PRODUCTS_TABLE,
        Item: params,
    })

    const response = await docClient.send(command)
    return response
}

const updateProductsStockTable = async (params) => {
    const command = new PutCommand({
        TableName: process.env.PRODUCTS_STOCK_TABLE,
        Item: params,
    })

    const response = await docClient.send(command)
    return response
}


const createProduct: ValidatedEventAPIGatewayProxyEvent<any> = async (event, callback) => {

    //@ts-ignore
    const payload = JSON.parse(event.body);

    const payloadFieldValidation = (payloadField: string) => {
        if(payload[payloadField] === undefined) return ({
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: `Product data is invalid. ${payloadField.replace(/^\w/, (c) => c.toUpperCase())} is missing` })
        })
    };

    let validationResponse = payloadFieldValidation('title');
    if (validationResponse) return validationResponse;

    validationResponse = payloadFieldValidation('description');
    if (validationResponse) return validationResponse;

    validationResponse = payloadFieldValidation('price');
    if (validationResponse) return validationResponse;

    validationResponse = payloadFieldValidation('count');
    if (validationResponse)  return validationResponse;

    const productId = uuidv4()
    const product = {
        id: productId,
        title: payload.title,
        description: payload.description,
        price: payload.price,
        image: payload.image || '',
    }

    const productStockData = {
        product_id: productId,
        count: payload.count,
    }

    await updateProductsTable(product)
    await updateProductsStockTable(productStockData)

    let body = {
        data: 'Product created with id: ' + productId,
    }

    return formatJSONResponse(body)
}
export const main = createProduct