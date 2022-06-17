import { TagSchema } from "@apiTypes/apiSchema";

export interface putImageBody {
    collection: string,
    id: string,
    tags: TagSchema[],
}

export interface deleteImageBody {
    collection: string,
    id: string,
}