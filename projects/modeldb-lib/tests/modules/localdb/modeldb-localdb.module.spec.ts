import { ModeldbLocaldbModule } from "./../../../src/modules/localdb/modeldb-localdb.module";


describe('ModeldbLocaldbModule', () => {
  let modeldbLocaldbModule: ModeldbLocaldbModule;

  beforeEach(() => {
    modeldbLocaldbModule = new ModeldbLocaldbModule();
  });

  it('should create an instance', () => {
    expect(modeldbLocaldbModule).toBeTruthy();
  });
});
