import 'source-map-support/register';
import { products } from '../mocks/products';

const getProductById = (id) => products.find((product)=>product.id === id)

export const getProductsById = async (event) => {
    const productId = event.pathParameters ? event.pathParameters.productId : null;
    const product = getProductById(productId)

    if (!productId || !product) {
        return {
            statusCode: 400,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({ error: 'productId is missing' }),
        };
    }

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(product),
    };
}