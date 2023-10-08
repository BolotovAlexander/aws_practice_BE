const { getProductsList } = require('../handlers/getProductsList');


const mockEvent = {};

describe('getProductsList', () => {
  it('should return a list of products with a 200 status code', async () => {
    const response = await getProductsList(mockEvent);

    expect(response.statusCode).toBe(200);

    expect(response.headers['Access-Control-Allow-Origin']).toBe('*');
    expect(response.headers['Access-Control-Allow-Credentials']).toBe(true);

    const productList = JSON.parse(response.body);
    console.log("WWW", productList)
    expect(Array.isArray(productList)).toBe(true);

  });
});
