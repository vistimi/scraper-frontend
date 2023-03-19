// keep _id to match type of mongodb
export interface PictureSchema {
    origin: string,
    id: string,
    name: string,
    originID: string,
    user: UserSchema,
    extension: string,
    sizes: PictureSizeSchema[],
    title: string,
    description: string,
    license: string,
    creationDate: Date,
    tags: PictureTagSchema[],
}

// keep _id to match type of mongodb
export interface PictureTagSchema {
    id: string,
    name: string,
    creationDate: Date,
    originName: string,
    boxInformation?: BoxInformation,
}

export interface BoxInformation {
    model?: string,
    weights?: string,
    pictureSizeID: string,
    box: BoxSchema,
    confidence?: number,
}

export interface BoxSchema {
    tlx: number,
    tly: number,
    width: number,
    height: number,
}

export interface PictureSizeSchema {
    id: string,
    creationDate: Date,
    box: BoxSchema,
}

export interface UserSchema {
    origin: string,
    id?: string,
    name: string,
    originID: string,
    creationDate?: Date,
}

export interface TagSchema {
    type?: string,
    id?: string,
    name: string,
    creationDate?: Date,
    originName: string,
}