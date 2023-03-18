import axios, {AxiosInstance, CreateAxiosDefaults} from "axios";

export class BotWebClient {
    protected readonly instance: AxiosInstance;
    protected static INSTANCE?: BotWebClient;

    constructor(private options?: CreateAxiosDefaults<any>) {
        this.instance = axios.create({
            headers: {
                Accept: 'application/json',
                "User-Agent": 'Robertify API (https://github.com/bombies/Robertify-API)',
                'Authorization': process.env.BOT_API_MASTER_PASSWORD
            },
            timeout: 5 * 1000,
            ...options,
            baseURL: process.env.BOT_API_HOSTNAME,
        });
    }

    private async getAccessToken() {
        const data = (await this.instance.post('/auth/login', {
            username: 'bombies',
            password: process.env.BOT_API_MASTER_PASSWORD
        })).data
        return data?.access_token;
    }

    private startTokenRefresh() {
        setInterval(async () => {
            await BotWebClient.setAccessToken(this);
        }, 60 * 60 * 1000)
    }

    private static async setAccessToken(client: BotWebClient) {
        const accessToken = await client.getAccessToken();
        client.instance.interceptors.request.use(config => {
            config.headers['Authorization'] = "Bearer " + accessToken;
            return config;
        });
    }

    public static async getInstance(options?: CreateAxiosDefaults<any>) {
        if (!options) {
            if (this.INSTANCE)
                return this.INSTANCE.instance;

            const client = new BotWebClient();
            this.INSTANCE = client;

            await BotWebClient.setAccessToken(client);
            client.startTokenRefresh();

            return client.instance;
        }

        // Options provided
        const client = new BotWebClient({
            ...options
        });

        await BotWebClient.setAccessToken(client);
        client.startTokenRefresh();

        return client.instance;
    }
}