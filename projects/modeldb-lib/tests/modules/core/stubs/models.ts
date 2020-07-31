import { model } from "projects/modeldb-lib/src/modules/core/decorators/model.decorator";
import { primaryKey } from "projects/modeldb-lib/src/modules/core/decorators/primary-key.decorator";
import { composition, many } from "projects/modeldb-lib/src/modules/core/decorators/composition.decorator";
import { extended } from "projects/modeldb-lib/src/modules/core/decorators/extended.decorator";
import { date } from "projects/modeldb-lib/src/modules/core/decorators/date.decorator";

@model("Person", "__type")
export class PersonModel {

    @primaryKey()
    public uid: string;

    public name: string;

}

@extended('AuthorModel', PersonModel)
export class AuthorModel extends PersonModel {

    public initials: string;

    get initialAndName(): string {
        return `${this.initials} is ${this.name}`;
    };

}

@extended('ActorModel', PersonModel)
export class ActorModel extends PersonModel {

    public charactersName: string;

    get realAndCharactersName(): string {
        return `${name} is ${this.charactersName}`;
    };

}

@extended('DirectorModel', PersonModel)
export class DirectorModel extends PersonModel {

    public charactersName: string;

}

@model("Movie")
export class MovieModel {

    @primaryKey()
    public uid: string;

    public name: string;

    @date()
    public releaseDate: Date;

    @composition(AuthorModel)
    public author: PersonModel;

    @many(PersonModel)
    public casting: PersonModel[];

}

