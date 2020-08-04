import { TestBed } from '@angular/core/testing';

import { ModelDbService } from '../../../../src/modules/core/services/model-db.service';

import { ActorModel, DirectorModel, MovieModel, AuthorModel } from '../stubs/models';
import { DocumentRepository } from '../../../../src/modules/core/repositories/document.repository';
import { typeOfModel } from '../../../../src/modules/core/decorators/model.decorator';
import { CacheOptions } from '../../../../src/modules/core/models/cache-options.model';
import { ModelDbSession } from 'projects/modeldb-lib/src/modules/core/models/model-db-session.model';

describe('ModelDbService', () => {

  let service: ModelDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DocumentRepository,
        ModelDbSession
      ]
    });

    service = TestBed.get(ModelDbService);
  });

  it('should be created', () => {
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

    const document = await (await service.get<MovieModel>(MovieModel, '1')).document;

    expect(document.uid).toBe(rawDocument.uid);
    expect(document.name).toBe(rawDocument.name);
  });

  it('should get two versions of the same Movie when it was previously loaded in different caches', async () => {
    const cache1: CacheOptions = new CacheOptions().not.expires().at("sub1");

    const cache2: CacheOptions = new CacheOptions().not.expires().at("sub2");

    const rawDocument = {
      uid: '1',
      name: 'My First Movie'
    };

    await service.upsert<MovieModel>(MovieModel, rawDocument, cache1);
    await service.upsert<MovieModel>(MovieModel, rawDocument, cache2);

    const document1 = await (await service.get<MovieModel>(MovieModel, '1', cache1)).document;
    const document2 = await (await service.get<MovieModel>(MovieModel, '1', cache2)).document;

    expect(document1).not.toBe(document2);
    expect(document1.uid).toBe(rawDocument.uid);
    expect(document1.name).toBe(rawDocument.name);
    expect(document2.uid).toBe(rawDocument.uid);
    expect(document2.name).toBe(rawDocument.name);
  });

  it('should not get a document when it was cached in different subcollection', async () => {
    const cache1: CacheOptions = new CacheOptions().not.expires().at("where-the-document-exists");

    const cache2: CacheOptions = new CacheOptions().not.expires().at("will-not-find");

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

    const cache1: CacheOptions = new CacheOptions().expires(expiredTime).at("expired");

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

    const cache1: CacheOptions = new CacheOptions().expires(notExpiredTime).at("not-expired");

    const rawDocument = {
      uid: '1',
      name: 'My First Movie'
    };

    await service.upsert<MovieModel>(MovieModel, rawDocument, cache1);

    const document = await service.get<MovieModel>(MovieModel, '1', cache1);

    expect(document).not.toBeNull();
  });

  it('should not get a document when its cache is disabled', async () => {

    const cache: CacheOptions = new CacheOptions().not.enable();

    const rawDocument = {
      uid: '1',
      name: 'My First Movie'
    };

    await service.upsert<MovieModel>(MovieModel, rawDocument, cache);

    const document = await service.get<MovieModel>(MovieModel, '1', cache);

    expect(document).toBeFalsy();
  });


  it('should get two documents when two documents was previously loaded ', async () => {

    const cache: CacheOptions = new CacheOptions().at("my-two-documents");

    const rawDocument1 = {
      uid: '1',
      name: 'My First Movie'
    };

    const rawDocument2 = {
      uid: '2',
      name: 'My First Movie'
    };

    await service.upsert<MovieModel>(MovieModel, rawDocument1, cache);

    await service.upsert<MovieModel>(MovieModel, rawDocument2, cache);

    const documents = await service.getMany<MovieModel>(MovieModel, cache);

    expect(documents.length).toBe(2);
  });

});
