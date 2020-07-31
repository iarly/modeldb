import { ModelDBModule } from '../../../src/modules/core/model-db.module';

describe('ModelDBModule', () => {
  let modelDBModule: ModelDBModule;

  beforeEach(() => {
    modelDBModule = new ModelDBModule();
  });

  it('should create an instance', () => {
    expect(modelDBModule).toBeTruthy();
  });
});
