
import { productsMock } from "./mocks/products.js";
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';

//TO CHECK SCRIPT please specify "type": "module" in package.json and change credentials profile to yours

const csvWriter = createCsvWriter({
  path: 'products.csv',
  header: [
    { id: 'title', title: 'Title' },
    { id: 'price', title: 'Price' },
    { id: 'imgUrl', title: 'Image URL' },
    { id: 'count', title: 'Count' },
    { id: 'description', title: 'Description' },
    { id: 'id', title: 'ID' },
  ]
});

csvWriter
  .writeRecords(productsMock)
  .then(() => console.log('CSV file successfully created'))
  .catch(err => console.error('An error occurred while creating the CSV file: ', err));