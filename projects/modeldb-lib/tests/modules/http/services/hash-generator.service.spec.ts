import { TestBed } from '@angular/core/testing';
import { HashGeneratorService } from './../../../../src/modules/http/services/hash-generator.service';

describe('HashGeneratorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HashGeneratorService = TestBed.get(HashGeneratorService);
    expect(service).toBeTruthy();
  });
});
