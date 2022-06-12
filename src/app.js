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
const rawBodySaver = function (req, res, buf, encoding) {
    if (buf && buf.length) {
        req.rawBody = buf.toString(encoding || 'utf8');
    }
}

app.use(bodyParser.json({ verify: rawBodySaver }));
app.use(bodyParser.urlencoded({ verify: rawBodySaver, extended: true }));
app.use(bodyParser.raw({ verify: rawBodySaver, type: '*/*' }));
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
const axios = require("axios");
const fs = require("fs");

app.use('/', authRoute);

// Patreon Webhook
app.post('/premiumhook', async (req, res) => {
    try {
        const verified = computeHash(req);
        if (verified) {
            console.log(req.body['included'][1]['attributes']['discord_id'])
            const discordID = req.body['included'][1]['attributes']['discord_id'];
            switch (req.headers['x-patreon-event']) {
                case "members:pledge:create": {
                    console.log('Handling create event');
                    await axios.post(`https://discord.com/api/v10/webhooks/${process.env.DISCORD_WEBHOOK_ID}/${process.env.DISCORD_WEBHOOK_SECRET}`, {
                        embeds: [
                            {
                                title: 'New Premium Pledge',
                                type: 'rich',
                                description: `<@${discordID}> has made a premium pledge!`,
                                color: '16740864'
                            }
                        ]
                    })

                    break;
                }
                case "members:pledge:update": {
                    console.log('Handling update event');
                    await axios.post(`https://discord.com/api/v10/webhooks/${process.env.DISCORD_WEBHOOK_ID}/${process.env.DISCORD_WEBHOOK_SECRET}`, {
                        embeds: [
                            {
                                title: 'Updated Premium Pledge',
                                type: 'rich',
                                description: `<@${discordID}> has made an update to their premium pledge!`,
                                color: '16740864'
                            }
                        ]
                    })
                    break;
                }
                case "members:pledge:delete": {
                    console.log('Handling delete event');
                    await axios.post(`https://discord.com/api/v10/webhooks/${process.env.DISCORD_WEBHOOK_ID}/${process.env.DISCORD_WEBHOOK_SECRET}`, {
                        embeds: [
                            {
                                title: 'Deleted Premium Pledge',
                                type: 'rich',
                                description: `<@${discordID}> has removed their premium pledge!`,
                                color: '16740864'
                            }
                        ]
                    })
                    break;
                }
                default: {
                    return res.status(401).json({ success: true, error: `This type of webhook trigger isn't handled: (${req.headers['x-patreon-event']})` })
                }
            }
            fs.writeFileSync('./reqBody.json', JSON.stringify(req.body))
            return res.status(200).json({ success: true, message: 'Valid webhook signature!' });
        }
        else return res.status(401).json({ success: false, error: 'Invalid webhook signature!' });
    } catch (e) {
        console.error('Invalid webhook signature', e);
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