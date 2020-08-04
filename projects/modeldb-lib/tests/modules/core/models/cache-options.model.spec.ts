import { CacheOptions } from 'projects/modeldb-lib/src/modules/core/models/cache-options.model';

describe('CacheOptions', () => {
  let cacheOptions: CacheOptions = null;

  it('should be created with default values', () => {
    cacheOptions = new CacheOptions();

    expect(cacheOptions.collections.length).toBe(0);
    expect(cacheOptions.expirationTime).toBeNull();
    expect(cacheOptions.enabled).toBeTruthy();
  });

  it('should be disabled when using disabled option', () => {
    cacheOptions = new CacheOptions().not.enable();

    expect(cacheOptions.enabled).toBeFalsy();
  });

  it('should be enabled when using enabled option', () => {
    cacheOptions = new CacheOptions().not.enable();

    cacheOptions.enable();

    expect(cacheOptions.enabled).toBeTruthy();
  });

  it('should expires when using expires option', () => {
    const expectedExpirationTime = new Date();

    cacheOptions = new CacheOptions().expires(expectedExpirationTime);

    expect(cacheOptions.expirationTime).toBe(expectedExpirationTime);
  });

  it('should not expires when using not.expires command', () => {
    cacheOptions = new CacheOptions().not.expires();

    expect(cacheOptions.expirationTime).toBeNull();
  });

  it('should have one collection when using the "at" option one time', () => {
    const expectedCollection = "my-expected-collection";
    cacheOptions = new CacheOptions().at(expectedCollection);

    expect(cacheOptions.collections.length).toBe(1);
    expect(cacheOptions.collections[0]).toBe(expectedCollection);
  });

  it('should expect the last collection inputed when using the "at" option two times', () => {
    const expectedCollection = "my-expected-collection";
    const notExpectedCollection = "not-expected-collection";

    cacheOptions = new CacheOptions().at(notExpectedCollection);

    cacheOptions.at(expectedCollection);

    expect(cacheOptions.collections.length).toBe(1);
    expect(cacheOptions.collections[0]).toBe(expectedCollection);
  });

  it('should expect two collections inputed when using the "at" and "and.at" options', () => {
    const expectedCollection = "my-expected-collection";
    const expectedCollection2 = "my-expected-collection-2";

    cacheOptions = new CacheOptions();

    cacheOptions.at(expectedCollection).and.at(expectedCollection2);

    expect(cacheOptions.collections.length).toBe(2);
    expect(cacheOptions.collections[0]).toBe(expectedCollection);
    expect(cacheOptions.collections[1]).toBe(expectedCollection2);
  });

  it('should expires in 10 minutes when create the session using the expiresIn method with parameter 10', () => {
    const beforeExpirationTime = new Date();
    beforeExpirationTime.setMinutes(beforeExpirationTime.getMinutes() + 9);

    const afterExpirationTime = new Date();
    afterExpirationTime.setMinutes(afterExpirationTime.getMinutes() + 11);

    cacheOptions = new CacheOptions().expiresIn(10);

    expect(cacheOptions.expirationTime >= beforeExpirationTime).toBeTruthy();
    expect(cacheOptions.expirationTime <= afterExpirationTime).toBeTruthy();
  });


});
