import { TagSchema } from "./responseSchema";

export interface PutImageSchema {
    collection: string,
    id: string,
    tags: TagSchema[],
}

export interface DeleteImageSchema {
    collection: string,
    id: string,
}

export interface PostTagSchema {
    name: string,
    origin: string,
}