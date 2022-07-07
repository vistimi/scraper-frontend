import { TagSchema } from "./responseSchema";

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

export interface PutImageFileSchema {
    origin: string,
    name: string,
    file: string,
}

export interface DeleteImageSchema {
    origin: string,
    id: string,
}

export interface PostTagSchema {
    name: string,
    origin: {
        "name": string,
    },
}

export interface PostUserSchema {
    origin: string,
    name: string,
    originID: string,
}

export interface PostImageUnwantedSchema {
    origin: string,
    originID: string,
}

export interface DeleteImageUnwantedSchema {
    origin: string,
    id: string,
}