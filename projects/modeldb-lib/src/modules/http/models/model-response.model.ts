export class ModelResponse<T> {

    public data: T;

    public fromCache: boolean;

    public expirationDate: Date;

    public loadingDate: Date;

    public loadElapsedTime: number;

}