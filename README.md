# Modeldb

ModelDB is a tiny model mapper and resolver with cache capabilities at client.

Currently, it has small development cycles driven by tests. The backlog is oriented by author's needs.

The library is Angular6+ compatible.

[![Build status](https://dev.azure.com/iarly/modeldb/_apis/build/status/Publish)](https://dev.azure.com/iarly/modeldb/_build/latest?definitionId=1)


## How to use

Create your favorite model:

```
@model("Movie")
class MovieModel {

    @primaryKey()
    public uid: string;

    public name: string;

    @date()
    public releaseDate: Date;

    @composition(AuthorModel)
    public author: PersonModel;

    @many(PersonModel)
    public casting: PersonModel[];
    
    public getUidAndName(): string {
      return uid + name;
    }

}
```

Second step, create the service that will get your model from your API...

The returned model by the ModelClient won't be only a simple JSON, it will have all features written in the original class like the local properties and methods.

Every model inside the same context will be stored in the same session. 
A model with primary key will have only one instance. This instance will be shared through every component in the same context.

```
class MovieRepository {

  constructor(protected modelClient: ModelClient) {
  }
  
  public async getAllAsync(uid: number): Promise<MovieModel[]> {
    const movies = await this.modelClient.get<MovieModel, MovieModel[]>(MovieModel, "https://cine.app/api/movies/");
    
    return movies;
  }

}
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
