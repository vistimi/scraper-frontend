import { BoxSchema, TagSchema } from "./responseSchema";

/** Schema for images wanted and pending */

export interface PutImageTagsPushSchema {
    origin: string,
    id: string,
    tags: TagSchema[],
}

export interface PutImageTagsPullSchema {
    origin: string,
    id: string,
    names: string[],
}

export interface ImageCropSchema {
    id: string,
    box: BoxSchema,
    // file: string,
}

export interface DeleteImageSchema {
    origin: string,
    id: string,
}

export interface PutImageTagsPullSchema {
    origin: string,
    id: string,
    names: string[],
}

export interface PostImageTransfer {
    originID: string,
    from: string,
    to: string,
}

/** Schema for images unwanted */

export interface PostImageUnwantedSchema {
    _id: string,
    origin: string,
    originID: string,
}

export interface DeleteImageUnwantedSchema {
    origin: string,
    id: string,
}

/** Schema for tags */

export interface PostTagSchema {
    name: string,
    origin: {
        "name": string,
    },
}

/** Schema for users */

export interface PostUserSchema {
    origin: string,
    name: string,
    originID: string,
}