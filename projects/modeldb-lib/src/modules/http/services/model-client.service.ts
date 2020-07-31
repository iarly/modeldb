import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { HashGeneratorService } from './hash-generator.service';
import { ModelDBFacadeService, ModelClass } from '../../core/services/model-db-facade.service';
import { CacheOptions } from '../../core/models/cache-options.model';
import { Content } from '@angular/compiler/src/render3/r3_ast';

@Injectable({
  providedIn: 'root'
})
export class ModelClient {

  constructor(protected httpClient: HttpClient,
    protected modelDb: ModelDBFacadeService,
    protected hashGenerator: HashGeneratorService) {

  }

  public async get<TElement, TReturn>(resultType: ModelClass<TElement>,
    url: string, expirationTime: Date = null): Promise<TReturn> {

    const argumentsHash = this.hashGenerator.hashObject(url);

    const cacheOptions: CacheOptions = this.createCacheOptions(argumentsHash, expirationTime);

    const response = this.httpClient.get<any>(url);

    const content = await response.toPromise();

    return this.convertContentToResult<TElement, TReturn>(resultType, content, cacheOptions);
  }

  public async post<TElement, TReturn>(resultType: ModelClass<TElement>,
    url: string, body: any | null, expirationTime: Date = null): Promise<TReturn> {

    const argumentsHash = this.hashGenerator.hashObject({ url, body });

    const cacheOptions: CacheOptions = this.createCacheOptions(argumentsHash, expirationTime);

    const response = this.httpClient.post<any>(url, body);

    const content = await response.toPromise();

    return this.convertContentToResult<TElement, TReturn>(resultType, content, cacheOptions);
  }

  private createCacheOptions(argumentsHash: string, expirationTime: Date): CacheOptions {
    return {
      subcollection: argumentsHash,
      expirationTime
    };
  }

  private convertContentToResult<TElement, TReturn>(resultType: ModelClass<TElement>, content: any, cacheOptions: CacheOptions) {
    if (!content) {
      return null;
    }

    if (content.length) {
      const resultList = [];

      for (let item of content) {
        resultList.push(item ? this.modelDb.upsert(resultType, item, cacheOptions) : null);
      }

      return (resultList as any) as TReturn;
    }

    return (this.modelDb.upsert(resultType, content) as any) as TReturn;
  }

}
