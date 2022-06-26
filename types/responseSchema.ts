// keep _id to match type of mongodb
export interface ImageSchema {
    _id: string,
    origin: string,
    originID: string,
    extension: string,
    path: string,
    width: number,
    height: number,
    title: string,
    description: string,
    license: string,
    creationDate: string
    tags: TagSchema[] | undefined,
}

// keep _id to match type of mongodb
export interface TagSchema {
    _id: string,
    name: string,
    origin: string,
    creationDate: string,
}