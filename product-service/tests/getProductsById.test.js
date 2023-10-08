const { getProductsById } = require('../handlers/getProductsById');

const mockEvent = {
  pathParameters: {
    productId: '1Bosch BFG 500',
  },
};

describe('getProductsById', () => {
  it('should return product details if productId is valid', async () => {
    const response = await getProductsById(mockEvent);

    
    expect(response.statusCode).toBe(200);


    expect(response.headers['Access-Control-Allow-Origin']).toBe('*');
    expect(response.headers['Access-Control-Allow-Credentials']).toBe(true);

    
    const product = JSON.parse(response.body);
    expect(product.id).toBe('1Bosch BFG 500');
  });

  it('should return an error if productId is missing', async () => {
    const invalidEvent = { pathParameters: null };

    const response = await getProductsById(invalidEvent);

    expect(response.statusCode).toBe(400);

 
    expect(response.headers['Access-Control-Allow-Origin']).toBe('*');
    expect(response.headers['Access-Control-Allow-Credentials']).toBe(true);

   
    const errorResponse = JSON.parse(response.body);
    expect(errorResponse.error).toBe('productId is missing');
  });
});
