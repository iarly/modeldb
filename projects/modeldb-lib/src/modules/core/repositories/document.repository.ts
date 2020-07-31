import { Injectable } from "@angular/core";
import { CacheOptions } from "../models/cache-options.model";

@Injectable({
  providedIn: 'root'
})
export class DocumentRepository {

  private static theCache: {} = {};

  public set(collection: string, primaryKeyValue: any, document: any, cacheOptions: CacheOptions): Promise<void> {
    DocumentRepository.theCache[collection] = DocumentRepository.theCache[collection] || {};
    DocumentRepository.theCache[collection][cacheOptions.subcollection] = DocumentRepository.theCache[collection][cacheOptions.subcollection] || {};
    DocumentRepository.theCache[collection][cacheOptions.subcollection][primaryKeyValue] = {
      document,
      expirationTime: cacheOptions.expirationTime
    };

    return Promise.resolve<void>(null);
  }

  public get<T>(collection: string, primaryKeyValue: any, cacheOptions: CacheOptions): Promise<T> {
    DocumentRepository.theCache[collection] = DocumentRepository.theCache[collection] || {};
    DocumentRepository.theCache[collection][cacheOptions.subcollection] = DocumentRepository.theCache[collection][cacheOptions.subcollection] || {};

    const cachedValue = DocumentRepository.theCache[collection][cacheOptions.subcollection][primaryKeyValue];

    if (cachedValue) {
      let document: T = cachedValue.document;
      let expirationTime = cachedValue.expirationTime;

      if (expirationTime && document) {
        if (new Date() > expirationTime) {
          delete DocumentRepository.theCache[collection][cacheOptions.subcollection][primaryKeyValue];
          document = null;
        }
      }

      return Promise.resolve<T>(document);
    }
  }

}
