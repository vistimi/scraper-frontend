// keep _id to match type of mongodb
export interface ImageSchema {
    _id: string,
    flickId: string,
    path: string,
    width: number,
    height: number,
    title: string,
    description: string,
    license: string,
    creationDate: string
    tags: TagSchema[],
}

// keep _id to match type of mongodb
export interface TagSchema {
    _id: string,
    name: string,
    origin: string,
    creationDate: string,
}