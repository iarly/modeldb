import "reflect-metadata";

const primaryKeyToken = Symbol("PrimaryKey");

export function primaryKey() {
    return Reflect.metadata(primaryKeyToken, true);
};

export function isPrimaryKey(target: any, propertyName: string) {
    return Reflect.getMetadata(primaryKeyToken, target, propertyName);
};