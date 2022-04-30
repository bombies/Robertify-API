const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config')

// Middle wares
app.use(express.json());
app.use(cors());

app.get('/', (req,res) => {
    res.status(200).send({ message: 'Welcome to the Robertify API'});
});

// Conncect to MongoDB
mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER_NAME}.${process.env.MONGO_HOSTNAME}/${process.env.MONGO_DATABASE_NAME}`,
    { useNewUrlParser: true },
    () => {
        console.log('Connected to MongoDB');
    }
);

app.listen(process.env.LISTEN_PORT || 3000, () => {
    console.log('The API is now running!');
})