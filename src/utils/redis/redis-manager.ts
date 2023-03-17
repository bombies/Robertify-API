import Redis from "ioredis";

export class RedisManager {
    protected cacheID: string;

    public constructor(private readonly redis: Redis, cacheID: string) {
        this.cacheID = `${cacheID}#${process.env.MONGO_DATABASE_NAME}#`;
    }

    protected async setex(identifier: string, value: Object | any[], seconds: number) {
        return this.redis.setex(this.cacheID + identifier, seconds, JSON.stringify(value));
    }

    protected async set(identifier: string, value: Object | any[]) {
        return this.redis.set(this.cacheID + identifier, JSON.stringify(value));
    }

    protected async get<T>(identifier: string): Promise<T> {
        const str = await this.redis.get(this.cacheID + identifier)
        return JSON.parse(str);
    }

    protected async getAll<T>() {
        const keys = await this.keys(`*${this.cacheID}*`)
        if (keys.length === 0)
            return [];
        const entries = (await this.mget<T>(keys)).values();
        const ret: T[] = [];

        let currentEntry = entries.next();
        while (currentEntry.value) {
            ret.push(currentEntry.value);
            currentEntry = entries.next();
        }

        return ret;
    }

    protected async mget<T>(identifiers: string[]): Promise<Map<string, T>> {
        const strArr = await this.redis.mget(identifiers);
        const retMap = new Map<string, T>();
        strArr.forEach((str, i) => retMap.set(identifiers[i], JSON.parse(str)))
        return retMap;
    }

    protected async keys(filter: string) {
        return this.redis.keys(filter);
    }

    protected async getRaw<T>(identifier: string): Promise<T> {
        console.log(identifier);
        const str = await this.redis.get(identifier)
        console.log(str);
        return JSON.parse(str);
    }

    protected async del(identifier: string) {
        return this.redis.del(this.cacheID + identifier);
    }

}