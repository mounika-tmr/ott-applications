import bodyParser = require('body-parser');
import express = require('express');
import mongoose from 'mongoose';
import router from './routes';

const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use(router);


const MONGO_URL = 'mongodb+srv://sunkireddy553:Mounikanaveen1234$@cluster0.qmzmoam.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(MONGO_URL);

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB database connection established successfully');
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

export default app;