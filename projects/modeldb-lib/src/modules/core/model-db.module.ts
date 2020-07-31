import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModelDBFacadeService } from './services/model-db-facade.service';
import { DocumentRepository } from './repositories/document.repository';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    DocumentRepository,
    ModelDBFacadeService
  ]
})
export class ModelDBModule { }
