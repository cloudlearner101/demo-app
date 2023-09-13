const express = require('express');
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors package

const app = express();
const port = process.env.PORT;

// Configure AWS SDK
AWS.config.update({
  region: process.env.REGION,
  accessKeyId: process.env.ACCESSID,
  secretAccessKey: process.env.SECRETACCESSKEY,
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TABLENAME;


app.use(cors());


app.get('/fetch-all', (req, res) => {
  const params = {
    TableName: tableName,
  };

  dynamoDB.scan(params, (err, data) => {
    if (err) {
      console.error('Error fetching data from DynamoDB:', err);
      res.status(500).json({ error: 'Error fetching data from DynamoDB' });
    } else {
      res.json(data.Items);
    }
  });
});

app.use(bodyParser.json());

// Define a route to fetch data based on a date attribute
app.get('/fetch-data', async (req, res) => {
  try {
    const startDate = req.query.startDate; // Start date as a query parameter, e.g., "9/5/2023"
    const endDate = req.query.endDate; // End date as a query parameter, e.g., "9/10/2023"

    const startDateFormatted = startDate;
    const endDateFormatted = endDate;

    const params = {
      TableName: tableName,
      FilterExpression: '#startDateAttribute <= :endDate AND #endDateAttribute >= :startDate',
      ExpressionAttributeNames: {
        '#startDateAttribute': 'SDT', // start date
        '#endDateAttribute': 'EDT', // end date
      },
      ExpressionAttributeValues: {
        ':startDate': startDateFormatted,
        ':endDate': endDateFormatted,
      },
    };

    const result = await dynamoDB.scan(params).promise();
    res.json(result.Items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
