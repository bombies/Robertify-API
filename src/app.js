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

app.use('/', authRoute);

// Patreon Webhook
app.post('/premiumhook', async (req, res) => {
    try {
        const verified = computeHash(req);
        if (verified) {
            const discordID = req.body['included'][1]['attributes']['discord_id'];
            const entitledTiers = req.body['data']['relationships']['currently_entitled_tiers'];

            switch (req.headers['x-patreon-event']) {
                case "members:pledge:create": {
                    console.log('Handling create event');
                    const startDate = Date.parse(req.body['data']['attributes']['pledge_relationship_start']);
                    const endDate = Date.parse(req.body['data']['attributes']['next_charge_date']);

                    if (!entitledTiers) {
                        console.error('There was no tier data. The field doesn\'t seem to exist.');
                        return res.status(400).json({
                            success: false,
                            error: 'Bad request. Missing currently entitled tiers field.'
                        })
                    }

                    const entitledTiersData = entitledTiers['data'];
                    if (!entitledTiersData) {
                        console.error('There was no tier data.')
                        return res.status(200).json({success: false, error: 'There was no tier data!'});
                    }

                    if (entitledTiersData.length === 0) {
                        console.error('There was no tier data.')
                        return res.status(200).json({success: false, error: 'There was no tier data!'});
                    }

                    const tierID = entitledTiersData[0]['id'];
                    const rewards = req.body['included'].filter(obj => obj['id'] === tierID)[0];
                    const tierName = rewards['attributes']['title'];
                    console.log(rewards);

                    if (discordID) {
                        const accessKeyRequest = await axios.post(`${process.env.BASE_URL}/login`, {
                            user_name: 'bombies',
                            master_password: process.env.MASTER_PASSWORD
                        });
                        const accessKey = accessKeyRequest.data.token;

                        let tierID;
                        switch (tierName.toLowerCase()) {
                            case "bronze": {
                                tierID = 0;
                                break;
                            }
                            case "silver": {
                                tierID = 1;
                                break;
                            }
                            case "gold": {
                                tierID = 2;
                                break;
                            }
                            case "diamond": {
                                tierID = 3;
                                break;
                            }
                            case "emerald": {
                                tierID = 4;
                                break;
                            }
                            case "test3": {
                                tierID = 5;
                                break;
                            }
                            default: {
                                console.error(`${tierName} is an invalid tier name. I couldn't assign a tier ID!`);
                                return res.status(500).json({ success: false, error: `${tierName} is an invalid tier name. I couldn't assign a tier ID!`});
                            }
                        }

                        axios.post(`${process.env.BASE_URL}/premium`, {
                            user_id: discordID,
                            premium_type: 0,
                            premium_tier: tierID,
                            premium_started: startDate,
                            premium_expires: endDate
                        }, {
                            headers: {
                                'auth-token': accessKey
                            }
                        })
                            .then(() => {
                                axios.post(`https://discord.com/api/v10/webhooks/${process.env.DISCORD_WEBHOOK_ID}/${process.env.DISCORD_WEBHOOK_SECRET}`, {
                                    embeds: [
                                        {
                                            title: 'New Premium Pledge',
                                            type: 'rich',
                                            description: `<@${discordID}> has made a premium pledge to \`${rewards['attributes']['title']}\`!`,
                                            color: '16740864'
                                        }
                                    ]
                                })
                                res.status(200).json({
                                    success: true,
                                    message: `<@${discordID}> has made a premium pledge to \`${rewards['attributes']['title']}\`!`
                                });
                            })
                            .catch(err => {
                                console.error('There was an error handling the request promise', err);
                                res.status(500).json({
                                    success: false,
                                    error: err
                                });
                            });
                    } else {
                        await axios.post(`https://discord.com/api/v10/webhooks/${process.env.DISCORD_WEBHOOK_ID}/${process.env.DISCORD_WEBHOOK_SECRET}`, {
                            embeds: [
                                {
                                    title: 'New Premium Pledge',
                                    type: 'rich',
                                    description: `**${req.body['data']['attributes']['full_name']}** (${req.body['data']['attributes']['email']}) has made a premium pledge to \`${rewards['attributes']['title']}\`!\nThey don't have a Discord account linked to their account, however, so I wasn't able to update their information in the database.`,
                                    color: '16740864'
                                }
                            ]
                        })
                        res.status(400).json({
                            success: false,
                            error: `**${req.body['data']['attributes']['full_name']}** (${req.body['data']['attributes']['email']}) has made a premium pledge to \`${rewards['attributes']['title']}\`!\nThey don't have a Discord account linked to their account, however, so I wasn't able to update their information in the database.`
                        });
                    }

                    break;
                }
                case "members:pledge:update": {
                    console.log('Handling update event');
                    const startDate = Date.parse(req.body['data']['attributes']['pledge_relationship_start']);
                    const endDate = Date.parse(req.body['data']['attributes']['next_charge_date']);

                    if (!entitledTiers) {
                        console.error('There was no tier data. The field doesn\'t seem to exist.');
                        return res.status(400).json({
                            success: false,
                            error: 'Bad request. Missing currently entitled tiers field.'
                        })
                    }

                    const entitledTiersData = entitledTiers['data'];
                    if (!entitledTiersData) {
                        console.error('There was no tier data.')
                        return res.status(200).json({success: false, error: 'There was no tier data!'});
                    }

                    if (entitledTiersData.length === 0) {
                        console.error('There was no tier data.')
                        return res.status(200).json({success: false, error: 'There was no tier data!'});
                    }

                    const tierID = entitledTiersData[entitledTiersData.length - 1]['id'];
                    const rewards = req.body['included'].filter(obj => obj['id'] === tierID)[0];
                    console.log(rewards);

                    if (discordID) {
                        await axios.post(`https://discord.com/api/v10/webhooks/${process.env.DISCORD_WEBHOOK_ID}/${process.env.DISCORD_WEBHOOK_SECRET}`, {
                            embeds: [
                                {
                                    title: 'Updated Premium Pledge',
                                    type: 'rich',
                                    description: `<@${discordID}> has made an update to their premium pledge to \`${rewards['attributes']['title']}\`!`,
                                    color: '16740864'
                                }
                            ]
                        })
                    } else {
                        await axios.post(`https://discord.com/api/v10/webhooks/${process.env.DISCORD_WEBHOOK_ID}/${process.env.DISCORD_WEBHOOK_SECRET}`, {
                            embeds: [
                                {
                                    title: 'New Premium Pledge',
                                    type: 'rich',
                                    description: `**${req.body['data']['attributes']['full_name']}** (${req.body['data']['attributes']['email']}) has made an update to their premium pledge to \`${rewards['attributes']['title']}\`!\nThey don't have a Discord account linked to their account, however, so I wasn't able to update their information in the database.`,
                                    color: '16740864'
                                }
                            ]
                        })
                    }
                    break;
                }
                case "members:pledge:delete": {
                    console.log('Handling delete event');
                    if (discordID) {
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
                    } else {
                        await axios.post(`https://discord.com/api/v10/webhooks/${process.env.DISCORD_WEBHOOK_ID}/${process.env.DISCORD_WEBHOOK_SECRET}`, {
                            embeds: [
                                {
                                    title: 'Deleted Premium Pledge',
                                    type: 'rich',
                                    description: `**${req.body['data']['attributes']['full_name']}** (${req.body['data']['attributes']['email']}) has removed their premium pledge!\nThey don't have a Discord account linked to their account, however, so I wasn't able to update their information in the database.`,
                                    color: '16740864'
                                }
                            ]
                        })
                    }
                    break;
                }
                default: {
                    return res.status(401).json({ success: true, error: `This type of webhook trigger isn't handled: (${req.headers['x-patreon-event']})` })
                }
            }
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