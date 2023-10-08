import 'source-map-support/register';
import { products } from '../mocks/products';

export const getProductsList = async (event) => {

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(products),
    };
}