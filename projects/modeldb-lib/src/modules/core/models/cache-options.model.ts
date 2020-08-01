export class CacheOptions {

    public static DefaultSubCollection = "default";

    public subcollection?: string = CacheOptions.DefaultSubCollection;
    public expirationTime?: Date = null;
    public enabled?: boolean = true;

    public static expiresIn(options: { subcollection?: string, minutes?: number } = null): CacheOptions {
        let expirationTime = new Date();
        expirationTime.setMinutes(expirationTime.getMinutes() + options.minutes);

        return this.expires({
            subcollection: options.subcollection,
            expirationTime
        });
    }

    public static expires(options: { subcollection?: string, expirationTime?: Date } = null): CacheOptions {
        return {
            subcollection: (options ? options.subcollection : null) || CacheOptions.DefaultSubCollection,
            expirationTime: options ? options.expirationTime : null,
            enabled: true
        }
    }

    public static notExpires(subcollection: string = null): CacheOptions {
        return {
            subcollection: subcollection || CacheOptions.DefaultSubCollection,
            expirationTime: null,
            enabled: true
        }
    }

    public static disabled(): CacheOptions {
        return {
            enabled: false
        };
    }
}