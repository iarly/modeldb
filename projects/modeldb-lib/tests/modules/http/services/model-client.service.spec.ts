import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ModelClient } from 'projects/modeldb-lib/src/modules/http/services/model-client.service';
import { AuthorModel } from '../../core/stubs/models';
import { ModelDbService } from 'projects/modeldb-lib/src/public_api';
import { ModelDbSession } from 'projects/modeldb-lib/src/modules/core/models/model-db-session.model';

describe('ModelClientService', () => {
    let injector: TestBed;
    let service: ModelClient;
    let httpMock: HttpTestingController;
    let modelDb: ModelDbService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                ModelClient,
                ModelDbService,
                ModelDbSession
            ]
        });

        injector = getTestBed();
        service = injector.get(ModelClient);
        httpMock = injector.get(HttpTestingController);
        modelDb = injector.get(ModelDbService);

        spyOn(modelDb, "upsert");
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should make a new request when sending get request', () => {
        const url = "https://cine.ma/api/authors";

        service.get<AuthorModel>(AuthorModel, url)
            .toPromise();

        const req = httpMock.expectOne(url);
        expect(req.request.method).toBe("GET");
        req.flush([]);
    });

    it('should make a new request when sending post request', () => {
        const url = "https://cine.ma/api/authors";
        const body = {};

        service.post<AuthorModel>(AuthorModel, url, body)
            .toPromise();

        const req = httpMock.expectOne(url);
        expect(req.request.method).toBe("POST");
        req.flush([]);
    });

    it('should call modelClient when requesting', () => {
        const url = "https://cine.ma/api/authors";

        service.get<AuthorModel>(AuthorModel, url)
            .toList()
            .toPromise()
            .then(_ => {
                expect(modelDb.upsert).toHaveBeenCalledTimes(1);
            });

        const req = httpMock.expectOne(url);
        expect(req.request.method).toBe("GET");
        req.flush([{}]);
    });

    it('should call modelClient when requesting', () => {
        const url = "https://cine.ma/api/authors";

        service.get<AuthorModel>(AuthorModel, url)
            .toList()
            .toPromise()
            .then(_ => {
                expect(modelDb.upsert).toHaveBeenCalledTimes(1);
            });

        const req = httpMock.expectOne(url);
        expect(req.request.method).toBe("GET");
        req.flush([{
            uid: 1,
            name: 'teste'
        }]);
    });

    it('should make two calls to modelClient when the request returns two models', () => {
        const url = "https://cine.ma/api/authors";

        service.get<AuthorModel>(AuthorModel, url)
            .toList()
            .toPromise()
            .then(_ => {
                console.log(_);
                expect(modelDb.upsert).toHaveBeenCalledTimes(2);
            });

        const req = httpMock.expectOne(url);
        expect(req.request.method).toBe("GET");
        req.flush([{
            uid: 1,
            name: 'the first model'
        }, {
            uid: 2,
            name: 'the second model'
        }]);
    });
});
