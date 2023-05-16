import axios, {AxiosInstance, CreateAxiosDefaults} from 'axios';
import {nanoid} from "nanoid";
import * as process from "process";

export class PayPalWebClient {
    protected readonly instance: AxiosInstance;
    protected static INSTANCE?: PayPalWebClient;

    constructor(private options?: CreateAxiosDefaults<any>) {
        this.instance = axios.create({
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${process.env.PAYPAL_CLIENT_SECRET}`,
            },
            timeout: 5 * 1000,
            ...options,
            baseURL: process.env.NODE_ENV === 'production' ? 'https://api.paypal.com' : 'https://api-m.sandbox.paypal.com'
        });

        this.instance.interceptors.request.use(
            request => {
                request.headers['PayPal-Request-Id'] = nanoid(8)
                return request;
            }
        )
    }

    public static getInstance(options?: CreateAxiosDefaults<any>) {
        if (!options) {
            if (this.INSTANCE) return this.INSTANCE.instance;

            const client = new PayPalWebClient();
            this.INSTANCE = client;
            return client.instance;
        }

        // Options provided
        const client = new PayPalWebClient({
            ...options,
        });
        return client.instance;
    }
}
