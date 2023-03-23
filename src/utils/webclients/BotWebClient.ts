import axios, {AxiosInstance, CreateAxiosDefaults} from 'axios';
import {SchedulerRegistry} from "@nestjs/schedule";

export class BotWebClient {
    protected readonly instance: AxiosInstance;
    protected static INSTANCE?: BotWebClient;

    constructor(private options?: CreateAxiosDefaults<any>) {
        this.instance = axios.create({
            headers: {
                Accept: 'application/json',
                'User-Agent': 'Robertify API (https://github.com/bombies/Robertify-API)',
                Authorization: process.env.BOT_API_MASTER_PASSWORD,
            },
            timeout: 5 * 1000,
            ...options,
            baseURL: process.env.BOT_API_HOSTNAME,
        });

        this.instance.interceptors.response.use(
            response => response,
            async (error) => {
                const originalRequest = error.config;

                if (error.response.status === 403 && !originalRequest._retry) {
                    const token = await this.getAccessToken();
                    originalRequest.headers['Authorization'] = `Bearer ${token}`;
                    originalRequest._retry = true;
                    return axios(originalRequest);
                }

                return Promise.reject(error);
            }
        )
    }

    private async getAccessToken(): Promise<string> {
        const data = (
            await this.instance.post('/auth/login', {
                username: 'bombies',
                password: process.env.BOT_API_MASTER_PASSWORD,
            })
        ).data;
        return data?.token;
    }

    public static async getInstance(options?: CreateAxiosDefaults<any>) {
        if (!options) {
            if (this.INSTANCE) return this.INSTANCE.instance;

            const client = new BotWebClient();
            this.INSTANCE = client;
            return client.instance;
        }

        // Options provided
        const client = new BotWebClient({
            ...options,
        });
        return client.instance;
    }
}
