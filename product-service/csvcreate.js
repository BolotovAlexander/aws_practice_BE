
import { productsMock } from "./mocks/products.js";
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';

//TO CHECK SCRIPT please specify "type": "module" in package.json and change credentials profile to yours

const csvWriter = createCsvWriter({
  path: 'products.csv',
  header: [
    { id: 'title', title: 'title' },
    { id: 'price', title: 'price' },
    { id: 'imgUrl', title: 'imgUrl' },
    { id: 'count', title: 'count' },
    { id: 'description', title: 'description' },
    { id: 'id', title: 'id' },
  ]
});

csvWriter
  .writeRecords(productsMock)
  .then(() => console.log('CSV file successfully created'))
  .catch(err => console.error('An error occurred while creating the CSV file: ', err));