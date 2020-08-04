import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModelDbService } from './services/model-db.service';
import { DocumentRepository } from './repositories/document.repository';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    DocumentRepository,
    ModelDbService
  ],
  declarations: [
  ]
})
export class ModelDBModule { }
