export type ExpiresOptions = {
    expirationTime?: Date;
};

export type ExpiresInOptions = {
    minutes?: number;
};

export class CacheOptions {

    public collections?: string[] = [];
    public expirationTime?: Date = null;
    public enabled?: boolean = true;

    clone(): CacheOptions {
        const cloned = Object.assign(new CacheOptions(), this);
        return cloned;
    }

    public expiresIn(minutes: number): CacheOptions {
        let expirationTime = new Date();
        expirationTime.setMinutes(expirationTime.getMinutes() + minutes);
        return this.expires(expirationTime);
    }

    public expires(expirationTime: Date): CacheOptions {
        this.expirationTime = expirationTime;
        return this;
    }

    public enable(): CacheOptions {
        this.enabled = true;
        return this;
    }

    public at(collection: string): CacheOptions {
        this.collections = [collection];
        return this;
    }

    public get and(): { at: (collection: string) => CacheOptions } {
        const me: CacheOptions = this;

        return {
            at(collection: string) {
                me.collections.push(collection);
                return me;
            }
        };
    }

    public get not(): { enable: () => CacheOptions, expires: () => CacheOptions } {
        const me: CacheOptions = this;

        return {
            enable() {
                me.enabled = false;
                return me;
            },
            expires() {
                me.expirationTime = null;
                return me;
            }
        };
    }
}