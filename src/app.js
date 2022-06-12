const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');
const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const bodyParser = require('body-parser');
require('dotenv/config')

// Middle wares
app.use(express.json());
app.use((req, res, next) => {
    let data = '';
    req.on('data', chunk => { data += chunk });
    req.on('end', () => {
        req.rawBody = data
        next();
    })
})
app.use(cors());
app.use(compression());
app.use(helmet());

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Express({ app }),
    ],
    tracesSampleRate: 1.0,
  });

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// Routes
const authRoute = require('./routes/auth')
const {computeHash} = require("./routes/auth");

app.use('/', authRoute);
app.post('/premiumhook', async (req, res) => {
    try {
        const verified = computeHash(req);
        if (verified) {
            console.log('Signature is valid!');
            return res.status(200).json({ success: true, message: 'Valid webhook signature!' });
        }
        else {
            console.log('Invalid signature!')
            return res.status(401).json({ success: false, error: 'Invalid webhook signature!' });
        }
    } catch (e) {
        console.log('Invalid webhook signature', e)
        res.status(401).json({ success: false, error: 'Invalid webhook signature!' });
    }
});

// Connect to MongoDB
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