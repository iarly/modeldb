import { Injectable, OnDestroy } from '@angular/core';
import { DocumentRepository } from '../repositories/document.repository';
import { isPrimaryKey } from '../decorators/primary-key.decorator';
import { nameOfModel } from '../decorators/model.decorator';
import { getClassType, isComposition, hasMany } from '../decorators/composition.decorator';
import { getDiscriminatorOfType } from '../decorators/extended.decorator';
import { CacheOptions } from '../models/cache-options.model';
import { isDate } from '../decorators/date.decorator';
import { SessionService } from './session.service';

export type ModelClass<T> = {
  new(): T;
};

@Injectable({
  providedIn: 'root'
})
export class ModelDBFacadeService implements OnDestroy {

  constructor(protected session: SessionService, protected documentRepository: DocumentRepository) {

  }

  public get<T>(rootDocumentType: ModelClass<T>, primaryKeyValue: string, cacheOptions: CacheOptions = null): Promise<T> {
    cacheOptions = cacheOptions || this.createDefaultCacheOptions();

    const modelName = nameOfModel(rootDocumentType);

    return this.getByModelName(modelName, primaryKeyValue, cacheOptions);
  }

  public async upsert<T>(rootDocumentType: ModelClass<T>, rawDocument: any, cacheOptions: CacheOptions = null): Promise<T> {
    cacheOptions = cacheOptions || this.createDefaultCacheOptions();

    const modelName = nameOfModel(rootDocumentType);

    const document = await this.createOrGetFromCache<T>(rootDocumentType, rawDocument, modelName, cacheOptions);

    await this.processProperties<T>(rawDocument, document);

    return document;
  }

  private createDefaultCacheOptions(): CacheOptions {
    return new CacheOptions(this.session.uniqueIdentifier);
  }

  private async processProperties<T>(rawDocument: any, document: T): Promise<void> {
    for (const propertyName in rawDocument) {
      if (isComposition(document, propertyName)) {
        const compositionDocument = await this.processComposition(document, propertyName, rawDocument);

        document[propertyName] = compositionDocument;
      }
      else if (isDate(document, propertyName)) {
        const rawDate = rawDocument[propertyName];

        if (rawDate) {
          document[propertyName] = new Date(rawDate);
        } else {
          document[propertyName] = null;
        }
      }
      else {
        document[propertyName] = rawDocument[propertyName];
      }
    }
  }

  private async processComposition<T>(document: T, propertyName: string, rawDocument: any): Promise<any> {
    const compositionTargetType = getClassType(document, propertyName);
    const compositionRawDocument = rawDocument[propertyName];

    if (compositionRawDocument) {
      if (hasMany(document, propertyName)) {
        const compositeArray = [];
        if (compositionRawDocument.length) {
          for (let rawElement of compositionRawDocument) {
            const discriminatedType = getDiscriminatorOfType(compositionTargetType, rawElement);

            const compositionDocument = await this.upsert<any>(discriminatedType || compositionTargetType, rawElement);

            compositeArray.push(compositionDocument)
          }
        }
        return compositeArray;
      }
      else {
        const discriminatedType = getDiscriminatorOfType(compositionTargetType, compositionRawDocument);

        const compositionDocument = await this.upsert<any>(discriminatedType || compositionTargetType, compositionRawDocument);

        return compositionDocument;
      }
    }

    return null;
  }

  private async createOrGetFromCache<T>(rootDocumentType: ModelClass<T>, rawDocument: any, modelName: string, cacheOptions: CacheOptions = null): Promise<T> {
    let document = new rootDocumentType();

    const primaryKeyValue = this.getPrimaryKeyValue<T>(document, rawDocument, modelName);
    const cachedDocument = await this.getByModelName<T>(modelName, primaryKeyValue, cacheOptions);

    document = cachedDocument || document;

    await this.documentRepository.set(modelName, primaryKeyValue, document, cacheOptions);

    return document;
  }

  private getPrimaryKeyValue<T>(document: T, rawDocument: any, modelName: string) {
    for (const propertyName in rawDocument) {
      if (isPrimaryKey(document, propertyName)) {
        return rawDocument[propertyName];
      }
    }
    return null;
  }

  private async getByModelName<T>(modelName: string, primaryKeyValue: any, cacheOptions: CacheOptions) {
    const cachedDocument = await this.documentRepository.get<T>(modelName, primaryKeyValue, cacheOptions);

    return cachedDocument;
  }

  public ngOnDestroy() {

  }

}
