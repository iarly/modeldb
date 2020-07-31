import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HashGeneratorService {

  constructor() {

  }

  public hashObject(object: any): string {
    return btoa(JSON.stringify(object));
  }

}
