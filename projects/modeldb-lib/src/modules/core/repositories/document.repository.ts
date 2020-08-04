import { Injectable } from "@angular/core";
import { CacheOptions } from "../models/cache-options.model";
import { CachedDocument } from "../models/cached-document.model";

@Injectable({
  providedIn: 'root'
})
export class DocumentRepository {

  private static theCache = new Map<string, Map<string, Map<string, Map<string, CachedDocument<any>>>>>();

  public set(session: string, modelName: string, primaryKeyValue: any, document: any, cacheOptions: CacheOptions): Promise<void> {

    if (!DocumentRepository.theCache.has(session))
      DocumentRepository.theCache.set(session, new Map());

    if (!DocumentRepository.theCache.get(session).has(modelName))
      DocumentRepository.theCache.get(session).set(modelName, new Map());

    let collections = this.getCollectionsOrDefault(cacheOptions);

    for (let collection of collections) {

      if (!DocumentRepository.theCache.get(session).get(modelName).has(collection)) {
        DocumentRepository.theCache.get(session).get(modelName).set(collection, new Map());
      }

      const cachedDocument = new CachedDocument<any>();
      cachedDocument.document = document;
      cachedDocument.cachedDate = new Date();
      cachedDocument.expirationDate = cacheOptions.expirationTime;

      DocumentRepository.theCache.get(session).get(modelName).get(collection).set(primaryKeyValue, cachedDocument);
    }

    return Promise.resolve<void>(null);
  }

  private getCollectionsOrDefault(cacheOptions: CacheOptions) {
    let collections = cacheOptions.collections;

    if (collections.length == 0)
      collections = ["default"];
    return collections;
  }

  public get<T>(session: string, modelName: string, primaryKeyValue: any, cacheOptions: CacheOptions): Promise<CachedDocument<T>> {

    let wasFoundInAllCollections = true;
    let document: CachedDocument<T> = null;
    let collections = this.getCollectionsOrDefault(cacheOptions);

    for (let collection of collections) {

      if (DocumentRepository.theCache.has(session)
        && DocumentRepository.theCache.get(session).has(modelName)
        && DocumentRepository.theCache.get(session).get(modelName).has(collection)
        && DocumentRepository.theCache.get(session).get(modelName).get(collection).get(primaryKeyValue)) {

        const cachedValue = DocumentRepository.theCache
          .get(session)
          .get(modelName)
          .get(collection)
          .get(primaryKeyValue);

        if (cachedValue) {
          let expirationDate = cachedValue.expirationDate;

          document = cachedValue;

          if (expirationDate && document) {
            if (new Date() > expirationDate) {
              DocumentRepository.theCache.get(session).get(modelName).get(collection).delete(primaryKeyValue);
              wasFoundInAllCollections = false;
              document = null;
              break;
            }
          }
        }
        else {
          wasFoundInAllCollections = false;
          break;
        }
      }
    }

    return Promise.resolve<CachedDocument<T>>(document);
  }

  public getAll<T>(session: string, modelName: string, cacheOptions: CacheOptions): Promise<CachedDocument<T>[]> {
    let foundObjects = new Map<string, CachedDocument<any>>();

    if (DocumentRepository.theCache.has(session)
      && DocumentRepository.theCache.get(session).has(modelName)) {

      const collections = this.getCollectionsOrDefault(cacheOptions);

      for (let collection of collections) {

        if (!DocumentRepository.theCache.get(session).get(modelName).has(collection))
          break;

        const collectionDocuments = DocumentRepository.theCache.get(session).get(modelName).get(collection);

        if (foundObjects.size == 0) {
          foundObjects = collectionDocuments;
        } else {
          for (const foundObject in foundObjects) {
            if (!collectionDocuments.has(foundObject)) {
              collectionDocuments.delete(foundObject);
            }
          }
        }
      }

    }

    const returnedObjects = [];

    foundObjects.forEach((value) => returnedObjects.push(value));

    return Promise.resolve<CachedDocument<T>[]>(returnedObjects);
  }

}
