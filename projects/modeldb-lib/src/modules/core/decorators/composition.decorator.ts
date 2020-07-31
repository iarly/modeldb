import "reflect-metadata";

const symbol = Symbol("Composition");

export function many(classType: any) {
    return Reflect.metadata(symbol, { classType, hasMany: true });
};

export function composition(classType: any) {
    return Reflect.metadata(symbol, { classType, hasMany: false });
};

export function isComposition(target: any, propertyKey: string) {
    return getClassType(target, propertyKey) != null;
};

export function hasMany(target: any, propertyKey: string): boolean {
    const metadata = Reflect.getMetadata(symbol, target, propertyKey);
    return metadata ? metadata.hasMany : false;
};

export function getClassType(target: any, propertyKey: string) {
    const metadata = Reflect.getMetadata(symbol, target, propertyKey);
    return metadata ? metadata.classType : null;
};