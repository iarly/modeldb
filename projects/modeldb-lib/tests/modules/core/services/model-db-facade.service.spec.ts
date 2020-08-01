import { TestBed } from '@angular/core/testing';

import { ModelDBFacadeService } from '../../../../src/modules/core/services/model-db-facade.service';

import { ActorModel, DirectorModel, MovieModel, AuthorModel } from '../stubs/models';
import { DocumentRepository } from './../../../../src/modules/core/repositories/document.repository';
import { typeOfModel } from './../../../../src/modules/core/decorators/model.decorator';
import { CacheOptions } from './../../../../src/modules/core/models/cache-options.model';
import { SessionService } from 'projects/modeldb-lib/src/modules/core/services/session.service';

describe('ModelDBFacadeService', () => {

  let service: ModelDBFacadeService;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      DocumentRepository,
      SessionService
    ]
  }));

  it('should be created', () => {
    service = TestBed.get(ModelDBFacadeService);
    expect(service).toBeTruthy();
  });

  it('should convert a raw document to a Movie', async () => {

    const rawDocument = {
      uid: '1',
      name: 'My First Movie'
    };

    const document = await service.upsert<MovieModel>(MovieModel, rawDocument);

    expect(document.uid).toBe(rawDocument.uid);
    expect(document.name).toBe(rawDocument.name);

  });

  it('should convert a date property to a date', async () => {

    const rawDocument = {
      releaseDate: '2020-07-31T01:02:03Z'
    };

    const document = await service.upsert<MovieModel>(MovieModel, rawDocument);

    expect(document.releaseDate.getUTCDate()).toBe(31);
    expect(document.releaseDate.getUTCFullYear()).toBe(2020);
    expect(document.releaseDate.getUTCMonth()).toBe(7 - 1);
    expect(document.releaseDate.getUTCHours()).toBe(1);
    expect(document.releaseDate.getUTCMinutes()).toBe(2);
    expect(document.releaseDate.getUTCSeconds()).toBe(3);
  });

  it('should convert a nested document to a Person', async () => {
    const rawDocument = {
      author: {
        uid: '1',
        name: 'K.L. Author'
      }
    };

    const document = await service.upsert<MovieModel>(MovieModel, rawDocument);

    expect(document.author.uid).toBe(rawDocument.author.uid);
    expect(document.author.name).toBe(rawDocument.author.name);
  });

  it('should convert a nested document to a Author', async () => {
    const rawDocument = {
      author: {
        uid: '1',
        name: 'K.L. Author',
        initials: 'KLA'
      }
    };

    const document = await service.upsert<MovieModel>(MovieModel, rawDocument);

    expect(typeOfModel(document.author)).toBe(AuthorModel);
    expect((document.author as AuthorModel).initialAndName).toBe("KLA is K.L. Author");
  });

  it('should convert a nested collection of a document to a array of Persons', async () => {
    const rawDocument = {
      casting: [{
        uid: '3',
        name: "Leo DiCaprio",
        __type: 'ActorModel'
      }, {
        uid: '4',
        name: "Manoel Jardim",
        __type: 'DirectorModel'
      }]
    };

    const document = await service.upsert<MovieModel>(MovieModel, rawDocument);

    expect(typeOfModel(document.casting[0])).toBe(ActorModel);
    expect(typeOfModel(document.casting[1])).toBe(DirectorModel);
  });

  it('should get the Movie from cache when it was previously loaded', async () => {
    const rawDocument = {
      uid: '1',
      name: 'My First Movie'
    };

    await service.upsert<MovieModel>(MovieModel, rawDocument);

    const document = await service.get<MovieModel>(MovieModel, '1');

    expect(document.uid).toBe(rawDocument.uid);
    expect(document.name).toBe(rawDocument.name);
  });

  it('should get two versions of the same Movie when it was previously loaded in different caches', async () => {
    const cache1: CacheOptions = {
      subcollection: "sub1",
      expirationTime: null
    };

    const cache2: CacheOptions = {
      subcollection: "sub2",
      expirationTime: null
    };

    const rawDocument = {
      uid: '1',
      name: 'My First Movie'
    };

    await service.upsert<MovieModel>(MovieModel, rawDocument, cache1);
    await service.upsert<MovieModel>(MovieModel, rawDocument, cache2);

    const document1 = await service.get<MovieModel>(MovieModel, '1', cache1);
    const document2 = await service.get<MovieModel>(MovieModel, '1', cache2);

    expect(document1).not.toBe(document2);
    expect(document1.uid).toBe(rawDocument.uid);
    expect(document1.name).toBe(rawDocument.name);
    expect(document2.uid).toBe(rawDocument.uid);
    expect(document2.name).toBe(rawDocument.name);
  });

  it('should not get a document when it was cached in different subcollection', async () => {
    const cache1: CacheOptions = {
      subcollection: "where-the-document-exists",
      expirationTime: null
    };

    const cache2: CacheOptions = {
      subcollection: "will-not-find",
      expirationTime: null
    };

    const rawDocument = {
      uid: '1',
      name: 'My First Movie'
    };

    await service.upsert<MovieModel>(MovieModel, rawDocument, cache1);

    const document = await service.get<MovieModel>(MovieModel, '1', cache2);

    expect(document).toBeFalsy();
  });

  it('should not get a document when its cache was expired', async () => {

    const expiredTime = new Date();
    expiredTime.setDate(expiredTime.getDate() - 1);

    const cache1: CacheOptions = {
      subcollection: "expired",
      expirationTime: expiredTime
    };

    const rawDocument = {
      uid: '1',
      name: 'My First Movie'
    };

    await service.upsert<MovieModel>(MovieModel, rawDocument, cache1);

    const document = await service.get<MovieModel>(MovieModel, '1', cache1);

    expect(document).toBeNull();
  });

  it('should get a document when its cache is not expired', async () => {

    const notExpiredTime = new Date();
    notExpiredTime.setDate(notExpiredTime.getDate() + 1);

    const cache1: CacheOptions = {
      subcollection: "not-expired",
      expirationTime: notExpiredTime
    };

    const rawDocument = {
      uid: '1',
      name: 'My First Movie'
    };

    await service.upsert<MovieModel>(MovieModel, rawDocument, cache1);

    const document = await service.get<MovieModel>(MovieModel, '1', cache1);

    expect(document).not.toBeNull();
  });

});
