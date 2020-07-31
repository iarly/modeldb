import { Injectable } from '@angular/core';
import ObjectHash from 'object-hash';

@Injectable({
  providedIn: 'root'
})
export class HashGeneratorService {

  constructor() {

  }

  public hashObject(object: any): string {
    return ObjectHash(object);
  }

}
