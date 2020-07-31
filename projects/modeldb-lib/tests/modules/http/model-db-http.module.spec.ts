import { ModelDBHttpModule } from './model-db-http.module';

describe('ModelDBHttpModule', () => {
  let modelDBHttpModule: ModelDBHttpModule;

  beforeEach(() => {
    modelDBHttpModule = new ModelDBHttpModule();
  });

  it('should create an instance', () => {
    expect(modelDBHttpModule).toBeTruthy();
  });
});
