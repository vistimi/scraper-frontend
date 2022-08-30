// keep _id to match type of mongodb
export interface ImageSchema {
    _id: string,
    origin: string,
    originID: string,
    user: UserSchema,
    extension: string,
    name: string,
    size: ImageSizeSchema[],
    title: string,
    description: string,
    license: string,
    creationDate: Date,
    tags: TagSchema[] | undefined,
}

// keep _id to match type of mongodb
export interface TagSchema {
    _id: string,
    name: string,
    origin: TagOriginSchema,
    creationDate: Date,
}

export interface UserSchema {
    _id: string,
    origin: string,
    name: string,
    originID: string,
    creationDate: Date,
}

export interface BoxSchema {
    x: number,
    y: number,
    width: number,
    height: number,
}

export interface ImageSizeSchema {
    _id: string,
    creationDate: Date,
    box: BoxSchema,
}

export interface TagOriginSchema {
    name: string,
    model: string,
    weights: string,
    imageSizeID: string,
    box: BoxSchema,
    confidence: number,
}