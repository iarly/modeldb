import "reflect-metadata";
import { nameOfModel, discriminatorOfModel, model } from './model.decorator';

const modelByDiscriminatorValue = {};

export function extended(modelName: string, baseClass: Function, discriminatorValue?: string, discriminatorProperty?: string) {
    discriminatorValue = discriminatorValue || modelName;

    return function (target: Function) {
        model(modelName, discriminatorProperty)(target);

        const baseClassName = nameOfModel(baseClass);
        modelByDiscriminatorValue[`${baseClassName}_${discriminatorValue}`] = target;
        target.prototype.__modelName = modelName;
        target.prototype.__discriminator = discriminatorValue;
    };
};

export function getDiscriminatorOfType<T>(baseClass: Function, rawDocument: any): string {
    const baseClassName = nameOfModel(baseClass);
    const discriminator = discriminatorOfModel(baseClass);

    const discriminatorValue = rawDocument[discriminator];

    return modelByDiscriminatorValue[`${baseClassName}_${discriminatorValue}`];
};