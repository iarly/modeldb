import "reflect-metadata";

const modelByName = {};
const nameByModel = {};
const discriminatorByModel = {};

export function model(modelName: string, discriminatorProperty?: string) {
    return function (target: Function) {
        modelByName[modelName] = target;
        nameByModel[target as any] = modelName;
        discriminatorByModel[target as any] = discriminatorProperty;
        target.prototype.__modelName = modelName;
    };
}

export function getType(name: string) {
    return modelByName[name];
};

export function typeOfModel(object: any) {
    return getType(object.__modelName);
};

export function nameOfModel<T>(constructor: T): string {
    return nameByModel[constructor as any];
};

export function discriminatorOfModel<T>(constructor: T): string {
    return discriminatorByModel[constructor as any];
};