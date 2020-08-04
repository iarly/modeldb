import { TestBed } from '@angular/core/testing';

import { ModelDbSession } from '../../../../src/modules/core/models/model-db-session.model';

describe('SessionService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ModelDbSession
    ]
  }));

  it('should be created', () => {
    const service: ModelDbSession = TestBed.get(ModelDbSession);
    expect(service).toBeTruthy();
  });

  it('should have default uniqueindetifier when created without constructor params', () => {
    const service: ModelDbSession = TestBed.get(ModelDbSession);
    expect(service.uniqueIdentifier).toBe("default");
  });

  it('should have default uniqueindetifier when created without constructor params', () => {
    const expectedUniqueIdentifier = "my-unique-identifier";
    const service: ModelDbSession = { uniqueIdentifier: expectedUniqueIdentifier };
    expect(service.uniqueIdentifier).toBe(expectedUniqueIdentifier);
  });

});
