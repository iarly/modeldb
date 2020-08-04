import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { HashGeneratorService } from './hash-generator.service';
import { ModelDbService, ModelClass } from '../../core/services/model-db.service';
import { CacheOptions, ExpiresInOptions, ExpiresOptions } from '../../core/models/cache-options.model';
import { Observable, Subscriber } from 'rxjs';
import { map } from 'rxjs/operators';
import { ModelResponse } from '../models/model-response.model';

@Injectable({
  providedIn: 'root'
})
export class ModelClient {

  protected cacheByUrl: boolean = false;

  protected cacheByCollection: string = null;

  protected cacheOptions: CacheOptions = new CacheOptions().not.expires();

  constructor(protected httpClient: HttpClient,
    protected modelDbService: ModelDbService,
    protected hashGenerator: HashGeneratorService) {

  }

  protected clone(): ModelClient {
    return new ModelClient(this.httpClient, this.modelDbService, this.hashGenerator);
  }

  public expires(expirationTime: Date): ModelClient {
    const client = this.clone();
    client.cacheOptions.expires(expirationTime);
    return client;
  }

  public expiresIn(minutes: number): ModelClient {
    const client = this.clone();
    client.cacheOptions.expiresIn(minutes);
    return client;
  }

  public get cacheable() {
    const me: ModelClient = this;
    return {
      by: {
        url() {
          const client = me.clone();
          client.cacheByUrl = true;
          return client;
        },
        collection(name: string) {
          const client = me.clone();
          client.cacheByCollection = name;
          return client;
        }
      }
    }
  }

  public get not() {
    const me: ModelClient = this;

    return {
      expires(): ModelClient {
        const client = me.clone();
        client.cacheOptions.not.expires();
        return client;
      },
      get cacheable() {
        return {
          get by() {
            return {
              url() {
                const client = me.clone();
                client.cacheByUrl = false;
                return client;
              },
              collection() {
                const client = me.clone();
                client.cacheByCollection = null;
                return client;
              }
            }
          }
        };
      }
    };
  }

  public get is() {
    const me: ModelClient = this;
    return {
      get cacheable() {
        return {
          get by() {
            return {
              url() {
                return me.cacheByUrl;
              },
              collection() {
                return me.cacheByCollection;
              }
            }
          }
        }
      }
    }
  }

  public get<TModelType>(resultType: ModelClass<any>, url: string) {
    const urlHash = this.hashGenerator.hashObject(url);
    const response = this.httpClient.get<any>(url, { observe: "body" });

    return {
      single: () => {
        return this.convertContentToResult<TModelType>(resultType, false, urlHash, response);
      },
      toList: () => {
        return this.convertContentToResult<TModelType[]>(resultType, true, urlHash, response);
      },
      toPromise: () => {
        return response.toPromise();
      }
    };
  }

  public post<TModelType>(resultType: ModelClass<any>, url: string, body: any | null) {
    const urlBodyHash = this.hashGenerator.hashObject({ url, body });
    const response = this.httpClient.post<any>(url, body, { observe: "body" });

    return {
      single: () => {
        return this.convertContentToResult<TModelType>(resultType, false, urlBodyHash, response);
      },
      toList: () => {
        return this.convertContentToResult<TModelType[]>(resultType, true, urlBodyHash, response);
      },
      toPromise: () => {
        return response.toPromise();
      }
    };
  }

  private convertContentToResult<TReturn>(resultType: ModelClass<any>, convertToList: boolean, urlHash: string, response: Observable<any>): Observable<ModelResponse<TReturn>> {
    return new Observable<ModelResponse<TReturn>>((subcriber: Subscriber<ModelResponse<TReturn>>) => {

      const cacheOptions = this.cacheOptions.clone();

      if (this.is.cacheable.by.url()) {
        cacheOptions.at(urlHash);
      }

      if (this.is.cacheable.by.collection()) {
        cacheOptions.and.at(this.cacheByCollection);
      }

      if (this.is.cacheable.by.url()) {
        this.modelDbService.getMany<any>(resultType, cacheOptions).then(cachedDocuments => {
          if (cachedDocuments.length > 0) {
            const cachedModelResponse = new ModelResponse<TReturn>();

            if (convertToList) {
              cachedModelResponse.data = cachedDocuments.map(document => document.document) as any as TReturn;
            } else {
              cachedModelResponse.data = cachedDocuments.map(document => document.document)[0] as TReturn;
            }

            cachedModelResponse.expirationDate = cachedDocuments[0].expirationDate;
            cachedModelResponse.loadingDate = cachedDocuments[0].cachedDate
            cachedModelResponse.fromCache = true;
            subcriber.next(cachedModelResponse);
          }
        });
      }

      response.pipe(map((content) => {
        if (!content) {
          return null;
        }

        if (content.length) {
          const resultList = [];

          for (let item of content) {
            resultList.push(item ? this.modelDbService.upsert(resultType, item, cacheOptions) : null);
          }

          return (resultList as any) as TReturn;
        }

        return (this.modelDbService.upsert(resultType, content) as any) as TReturn;
      })).subscribe(content => {
        const cachedModelResponse = new ModelResponse<TReturn>();
        cachedModelResponse.data = content;
        cachedModelResponse.expirationDate = cacheOptions.expirationTime;
        cachedModelResponse.loadingDate = new Date();
        cachedModelResponse.fromCache = false;

        subcriber.next(cachedModelResponse);
        subcriber.complete();
      });

    });
  }

}
