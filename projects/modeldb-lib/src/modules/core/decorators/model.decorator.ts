const modelByName = {};
const nameByModel = {};
const discriminatorByModel = {};

export function model(modelName: string, discriminatorProperty?: string): (string) => void {
    return function (target: Function) {
        modelByName[modelName] = target;
        nameByModel[target as any] = modelName;
        discriminatorByModel[target as any] = discriminatorProperty;
        target.prototype.__modelName = modelName;
    };
};

export function getType(name: string): Function {
    return modelByName[name];
};

export function typeOfModel(object: any): Function {
    return getType(object.__modelName);
};

export function nameOfModel(type: any): string {
    return nameByModel[type];
};

export function discriminatorOfModel(type: any): string {
    return discriminatorByModel[type];
};