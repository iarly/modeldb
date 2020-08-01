import { CacheOptions } from 'projects/modeldb-lib/src/modules/core/models/cache-options.model';

describe('CacheOptions', () => {
  let cacheOptions: CacheOptions = null;

  it('should be created with default values', () => {
    cacheOptions = new CacheOptions();

    expect(cacheOptions.subcollection).toBe("default");
    expect(cacheOptions.expirationTime).toBeNull();
    expect(cacheOptions.enabled).toBeTruthy();
  });

  it('shoud be create disabled when using disabled option', () => {
    cacheOptions = CacheOptions.disabled();

    expect(cacheOptions.enabled).toBeFalsy();
  });

  it('shoud be create with expiration date and default collection when using expires option with only expirationTime parameter', () => {
    const expectedExpirationTime = new Date();

    cacheOptions = CacheOptions.expires({ expirationTime: expectedExpirationTime });

    expect(cacheOptions.subcollection).toBe(CacheOptions.DefaultSubCollection);
    expect(cacheOptions.expirationTime).toBe(expectedExpirationTime);
  });

  it('shoud be create with expiration date and collection when using expires option with both parameter', () => {
    const expectedExpirationTime = new Date();
    const expectedCollection = "my-expected-collection";

    cacheOptions = CacheOptions.expires({ subcollection: expectedCollection, expirationTime: expectedExpirationTime });

    expect(cacheOptions.subcollection).toBe(expectedCollection);
    expect(cacheOptions.expirationTime).toBe(expectedExpirationTime);
  });

  it('shoud be create without expiration date and default subcollection when using notExpires option without parameter', () => {
    cacheOptions = CacheOptions.notExpires();

    expect(cacheOptions.subcollection).toBe(CacheOptions.DefaultSubCollection);
    expect(cacheOptions.expirationTime).toBeNull();
  });

  it('shoud be create without expiration date and with subcollection when using notExpires option with subcollection parameter', () => {
    const expectedCollection = "my-expected-collection";

    cacheOptions = CacheOptions.notExpires(expectedCollection);

    expect(cacheOptions.subcollection).toBe(expectedCollection);
    expect(cacheOptions.expirationTime).toBeNull();
  });

});
