import "reflect-metadata";

const symbol = Symbol("Date");

export function date() {
    return Reflect.metadata(symbol, true);
};

export function isDate(target: any, propertyKey: string) {
    return Reflect.getMetadata(symbol, target, propertyKey) != null;
};