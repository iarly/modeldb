import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModelDBModule } from '../core/model-db.module';
import { ModelClient } from './services/model-client.service';
import { HashGeneratorService } from './services/hash-generator.service';

@NgModule({
  imports: [
    CommonModule,
    ModelDBModule
  ],
  declarations: [
    ModelClient,
    HashGeneratorService
  ]
})
export class ModelDBHttpModule { }
