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