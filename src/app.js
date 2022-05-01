const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
require('dotenv/config')

// Middle wares
app.use(express.json());
app.use(cors());
app.use(compression());
app.use(helmet());

// Routes
const verify = require('./routes/verifyToken');
const authRoute = require('./routes/auth')
app.use('/api', verify, authRoute);
app.use('/', (req,res) => {
    res.status(200).send({ message: 'Welcome to the API!' })
})

// Conncect to MongoDB
mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER_NAME}.${process.env.MONGO_HOSTNAME}/${process.env.MONGO_DATABASE_NAME}`,
    { useNewUrlParser: true },
    () => {
        console.log('Connected to MongoDB');
    }
);

app.listen(process.env.PORT || 3000, process.env.LISTEN_IP || '0.0.0.0', () => {
    console.log('The API is now running!');
});