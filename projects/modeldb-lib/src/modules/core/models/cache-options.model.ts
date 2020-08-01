export class CacheOptions {

    /**
     *
     */
    constructor(public subcollection: string = "default",
        public expirationTime: Date = null) {

    }

}