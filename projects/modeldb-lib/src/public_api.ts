/*
 * Public API Surface of modeldb-lib
 */

/*
 * Core
 */

// Decorators
export * from './modules/core/decorators/extended.decorator';
export * from './modules/core/decorators/model.decorator';
export * from './modules/core/decorators/composition.decorator';
export * from './modules/core/decorators/date.decorator';
export * from './modules/core/decorators/primary-key.decorator';

// Models
export * from './modules/core/models/cache-options.model';
export * from './modules/core/models/model-db-session.model';

// Repositories
export * from './modules/core/repositories/document.repository';

// Services
export * from './modules/core/services/model-db.service';

// Module
export * from './modules/core/model-db.module';


/*
 * Http
 */

// Services
export * from './modules/http/services/model-client.service';
export * from './modules/http/services/hash-generator.service';

// Models
export * from './modules/http/models/model-response.model'

// Module
export * from './modules/http/model-db-http.module';

/*
 * Localdb
 */

// Services

// Module
export * from './modules/localdb/modeldb-localdb.module';