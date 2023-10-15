import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { products } from "../../../mocks/products";

const getProductsList: ValidatedEventAPIGatewayProxyEvent<any> = async () => {
  return formatJSONResponse(products);
};

export const main = getProductsList;