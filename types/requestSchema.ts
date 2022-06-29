import { TagSchema } from "./responseSchema";

export interface PutImageSchema {
    origin: string,
    id: string,
    tags: TagSchema[],
}

export interface DeleteImageSchema {
    origin: string,
    id: string,
}

export interface PostTagSchema {
    name: string,
    origin: string,
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