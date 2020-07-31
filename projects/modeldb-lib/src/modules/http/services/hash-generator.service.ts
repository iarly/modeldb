import { Injectable } from '@angular/core';
import { toBase64String } from '@angular/compiler/src/output/source_map';

@Injectable({
  providedIn: 'root'
})
export class HashGeneratorService {

  constructor() {

  }

  public hashObject(object: any): string {
    return toBase64String(JSON.stringify(object));
  }

}
