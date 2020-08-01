import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ModelClient } from 'projects/modeldb-lib/src/modules/http/services/model-client.service';
import { AuthorModel } from '../../core/stubs/models';
import { ModelDBFacadeService } from 'projects/modeldb-lib/src/public_api';

describe('ModelClientService', () => {
    let injector: TestBed;
    let service: ModelClient;
    let httpMock: HttpTestingController;
    let modelDb: ModelDBFacadeService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                ModelClient,
                ModelDBFacadeService
            ]
        });

        injector = getTestBed();
        service = injector.get(ModelClient);
        httpMock = injector.get(HttpTestingController);
        modelDb = injector.get(ModelDBFacadeService);

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

        service.get<AuthorModel, AuthorModel[]>(AuthorModel, url);

        const req = httpMock.expectOne(url);
        expect(req.request.method).toBe("GET");
        req.flush([]);
    });

    it('should make a new request when sending post request', () => {
        const url = "https://cine.ma/api/authors";
        const body = {};

        service.post<AuthorModel, AuthorModel[]>(AuthorModel, url, body);

        const req = httpMock.expectOne(url);
        expect(req.request.method).toBe("POST");
        req.flush([]);
    });

    it('should call modelClient when requesting', () => {
        const url = "https://cine.ma/api/authors";

        service.get<AuthorModel, AuthorModel[]>(AuthorModel, url).then(_ => {
            expect(modelDb.upsert).toHaveBeenCalledTimes(1);
        });

        const req = httpMock.expectOne(url);
        expect(req.request.method).toBe("GET");
        req.flush([{}]);
    });
});
