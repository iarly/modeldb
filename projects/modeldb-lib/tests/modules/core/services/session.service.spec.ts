import { TestBed } from '@angular/core/testing';

import { SessionService } from '../../../../src/modules/core/services/session.service';

describe('SessionService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      SessionService
    ]
  }));

  it('should be created', () => {
    const service: SessionService = TestBed.get(SessionService);
    expect(service).toBeTruthy();
  });

  it('should have default uniqueindetifier when created without constructor params', () => {
    const service: SessionService = TestBed.get(SessionService);
    expect(service.uniqueIdentifier).toBe("default");
  });

  it('should have default uniqueindetifier when created without constructor params', () => {
    const expectedUniqueIdentifier = "my-unique-identifier";
    const service: SessionService = { uniqueIdentifier: expectedUniqueIdentifier };
    expect(service.uniqueIdentifier).toBe(expectedUniqueIdentifier);
  });

});
