import { BoxSchema, TagSchema } from "./responseSchema";

/** Schema for images wanted and pending */

export interface PutImageTagSchema {
    origin: string,
    id: string,
    tag: TagSchema,
}

export interface PutImageTagsPullSchema {
    origin: string,
    id: string,
    names: string[],
}

export interface PutImageCropSchema {
    origin: string,
    id: string,
    name: string,
    box: BoxSchema,
}

export interface PostImageCropSchema {
    origin: string,
    id: string,
    name: string,
    imageSizeID: string,
    box: BoxSchema,
}

export interface ImageCopySchema {
    origin: string,
    ID: string,
}

export interface DeleteImageSchema {
    origin: string,
    id: string,
}

export interface DeleteImageTagSchema {
    origin: string,
    id: string,
    tagID: string,
}

export interface PostImageTransfer {
    origin: string,
    id: string,
    from: string,
    to: string,
}

/** Schema for images unwanted */

export interface PostImageUnwantedSchema {
    origin: string,
    id: string,
}

export interface DeleteImageUnwantedSchema {
    origin: string,
    id: string,
}

export interface DeleteImageUnwantedSchema {
    origin: string,
    id: string,
}